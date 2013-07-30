## Amazon S3 manager
## Author: Michal Ludvig <michal@logix.cz>
##         http://www.logix.cz/michal
## License: GPL Version 2

import sys
import os, os.path
import time
import httplib
import logging
import mimetypes
import re
from logging import debug, info, warning, error
from stat import ST_SIZE

try:
    from hashlib import md5
except ImportError:
    from md5 import md5

from Utils import *
from SortedDict import SortedDict
from AccessLog import AccessLog
from ACL import ACL, GranteeLogDelivery
from BidirMap import BidirMap
from Config import Config
from Exceptions import *
from MultiPart import MultiPartUpload
from S3Uri import S3Uri
from ConnMan import ConnMan

try:
    import magic, gzip
    try:
        ## https://github.com/ahupp/python-magic
        magic_ = magic.Magic(mime=True)
        def mime_magic_file(file):
            return magic_.from_file(file)
        def mime_magic_buffer(buffer):
            return magic_.from_buffer(buffer)
    except TypeError:
        ## http://pypi.python.org/pypi/filemagic
        try:
            magic_ = magic.Magic(flags=magic.MAGIC_MIME)
            def mime_magic_file(file):
                return magic_.id_filename(file)
            def mime_magic_buffer(buffer):
                return magic_.id_buffer(buffer)
        except TypeError:
            ## file-5.11 built-in python bindings
            magic_ = magic.open(magic.MAGIC_MIME)
            magic_.load()
            def mime_magic_file(file):
                return magic_.file(file)
            def mime_magic_buffer(buffer):
                return magic_.buffer(buffer)

    except AttributeError:
        ## Older python-magic versions
        magic_ = magic.open(magic.MAGIC_MIME)
        magic_.load()
        def mime_magic_file(file):
            return magic_.file(file)
        def mime_magic_buffer(buffer):
            return magic_.buffer(buffer)

    def mime_magic(file):
        type = mime_magic_file(file)
        if type != "application/x-gzip; charset=binary":
            return (type, None)
        else:
            return (mime_magic_buffer(gzip.open(file).read(8192)), 'gzip')

except ImportError, e:
    if str(e).find("magic") >= 0:
        magic_message = "Module python-magic is not available."
    else:
        magic_message = "Module python-magic can't be used (%s)." % e.message
    magic_message += " Guessing MIME types based on file extensions."
    magic_warned = False
    def mime_magic(file):
        global magic_warned
        if (not magic_warned):
            warning(magic_message)
            magic_warned = True
        return mimetypes.guess_type(file)

__all__ = []
class S3Request(object):
    def __init__(self, s3, method_string, resource, headers, params = {}):
        self.s3 = s3
        self.headers = SortedDict(headers or {}, ignore_case = True)
        # Add in any extra headers from s3 config object
        if self.s3.config.extra_headers:
            self.headers.update(self.s3.config.extra_headers)
        if len(self.s3.config.access_token)>0:
            self.s3.config.role_refresh()
            self.headers['x-amz-security-token']=self.s3.config.access_token
        self.resource = resource
        self.method_string = method_string
        self.params = params

        self.update_timestamp()
        self.sign()

    def update_timestamp(self):
        if self.headers.has_key("date"):
            del(self.headers["date"])
        self.headers["x-amz-date"] = time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.gmtime())

    def format_param_str(self):
        """
        Format URL parameters from self.params and returns
        ?parm1=val1&parm2=val2 or an empty string if there
        are no parameters.  Output of this function should
        be appended directly to self.resource['uri']
        """
        param_str = ""
        for param in self.params:
            if self.params[param] not in (None, ""):
                param_str += "&%s=%s" % (param, self.params[param])
            else:
                param_str += "&%s" % param
        return param_str and "?" + param_str[1:]

    def sign(self):
        h  = self.method_string + "\n"
        h += self.headers.get("content-md5", "")+"\n"
        h += self.headers.get("content-type", "")+"\n"
        h += self.headers.get("date", "")+"\n"
        for header in self.headers.keys():
            if header.startswith("x-amz-"):
                h += header+":"+str(self.headers[header])+"\n"
        if self.resource['bucket']:
            h += "/" + self.resource['bucket']
        h += self.resource['uri']
        debug("SignHeaders: " + repr(h))
        signature = sign_string(h)

        self.headers["Authorization"] = "AWS "+self.s3.config.access_key+":"+signature

    def get_triplet(self):
        self.update_timestamp()
        self.sign()
        resource = dict(self.resource)  ## take a copy
        resource['uri'] += self.format_param_str()
        return (self.method_string, resource, self.headers)

class S3(object):
    http_methods = BidirMap(
        GET = 0x01,
        PUT = 0x02,
        HEAD = 0x04,
        DELETE = 0x08,
        POST = 0x10,
        MASK = 0x1F,
    )

    targets = BidirMap(
        SERVICE = 0x0100,
        BUCKET = 0x0200,
        OBJECT = 0x0400,
        MASK = 0x0700,
    )

    operations = BidirMap(
        UNDFINED = 0x0000,
        LIST_ALL_BUCKETS = targets["SERVICE"] | http_methods["GET"],
        BUCKET_CREATE = targets["BUCKET"] | http_methods["PUT"],
        BUCKET_LIST = targets["BUCKET"] | http_methods["GET"],
        BUCKET_DELETE = targets["BUCKET"] | http_methods["DELETE"],
        OBJECT_PUT = targets["OBJECT"] | http_methods["PUT"],
        OBJECT_GET = targets["OBJECT"] | http_methods["GET"],
        OBJECT_HEAD = targets["OBJECT"] | http_methods["HEAD"],
        OBJECT_DELETE = targets["OBJECT"] | http_methods["DELETE"],
        OBJECT_POST = targets["OBJECT"] | http_methods["POST"],
    )

    codes = {
        "NoSuchBucket" : "Bucket '%s' does not exist",
        "AccessDenied" : "Access to bucket '%s' was denied",
        "BucketAlreadyExists" : "Bucket '%s' already exists",
    }

    ## S3 sometimes sends HTTP-307 response
    redir_map = {}

    ## Maximum attempts of re-issuing failed requests
    _max_retries = 5

    def __init__(self, config):
        self.config = config

    def get_hostname(self, bucket):
        if bucket and check_bucket_name_dns_conformity(bucket):
            if self.redir_map.has_key(bucket):
                host = self.redir_map[bucket]
            else:
                host = getHostnameFromBucket(bucket)
        else:
            host = self.config.host_base
        debug('get_hostname(%s): %s' % (bucket, host))
        return host

    def set_hostname(self, bucket, redir_hostname):
        self.redir_map[bucket] = redir_hostname

    def format_uri(self, resource):
        if resource['bucket'] and not check_bucket_name_dns_conformity(resource['bucket']):
            uri = "/%s%s" % (resource['bucket'], resource['uri'])
        else:
            uri = resource['uri']
        if self.config.proxy_host != "":
            uri = "http://%s%s" % (self.get_hostname(resource['bucket']), uri)
        debug('format_uri(): ' + uri)
        return uri

    ## Commands / Actions
    def list_all_buckets(self):
        request = self.create_request("LIST_ALL_BUCKETS")
        response = self.send_request(request)
        response["list"] = getListFromXml(response["data"], "Bucket")
        return response

    def bucket_list(self, bucket, prefix = None, recursive = None):
        def _list_truncated(data):
            ## <IsTruncated> can either be "true" or "false" or be missing completely
            is_truncated = getTextFromXml(data, ".//IsTruncated") or "false"
            return is_truncated.lower() != "false"

        def _get_contents(data):
            return getListFromXml(data, "Contents")

        def _get_common_prefixes(data):
            return getListFromXml(data, "CommonPrefixes")

        uri_params = {}
        truncated = True
        list = []
        prefixes = []

        while truncated:
            response = self.bucket_list_noparse(bucket, prefix, recursive, uri_params)
            current_list = _get_contents(response["data"])
            current_prefixes = _get_common_prefixes(response["data"])
            truncated = _list_truncated(response["data"])
            if truncated:
                if current_list:
                    uri_params['marker'] = self.urlencode_string(current_list[-1]["Key"])
                else:
                    uri_params['marker'] = self.urlencode_string(current_prefixes[-1]["Prefix"])
                debug("Listing continues after '%s'" % uri_params['marker'])

            list += current_list
            prefixes += current_prefixes

        response['list'] = list
        response['common_prefixes'] = prefixes
        return response

    def bucket_list_noparse(self, bucket, prefix = None, recursive = None, uri_params = {}):
        if prefix:
            uri_params['prefix'] = self.urlencode_string(prefix)
        if not self.config.recursive and not recursive:
            uri_params['delimiter'] = "/"
        request = self.create_request("BUCKET_LIST", bucket = bucket, **uri_params)
        response = self.send_request(request)
        #debug(response)
        return response

    def bucket_create(self, bucket, bucket_location = None):
        headers = SortedDict(ignore_case = True)
        body = ""
        if bucket_location and bucket_location.strip().upper() != "US":
            bucket_location = bucket_location.strip()
            if bucket_location.upper() == "EU":
                bucket_location = bucket_location.upper()
            else:
                bucket_location = bucket_location.lower()
            body  = "<CreateBucketConfiguration><LocationConstraint>"
            body += bucket_location
            body += "</LocationConstraint></CreateBucketConfiguration>"
            debug("bucket_location: " + body)
            check_bucket_name(bucket, dns_strict = True)
        else:
            check_bucket_name(bucket, dns_strict = False)
        if self.config.acl_public:
            headers["x-amz-acl"] = "public-read"
        request = self.create_request("BUCKET_CREATE", bucket = bucket, headers = headers)
        response = self.send_request(request, body)
        return response

    def bucket_delete(self, bucket):
        request = self.create_request("BUCKET_DELETE", bucket = bucket)
        response = self.send_request(request)
        return response

    def get_bucket_location(self, uri):
        request = self.create_request("BUCKET_LIST", bucket = uri.bucket(), extra = "?location")
        response = self.send_request(request)
        location = getTextFromXml(response['data'], "LocationConstraint")
        if not location or location in [ "", "US" ]:
            location = "us-east-1"
        elif location == "EU":
            location = "eu-west-1"
        return location

    def bucket_info(self, uri):
        # For now reports only "Location". One day perhaps more.
        response = {}
        response['bucket-location'] = self.get_bucket_location(uri)
        return response

    def website_info(self, uri, bucket_location = None):
        headers = SortedDict(ignore_case = True)
        bucket = uri.bucket()
        body = ""

        request = self.create_request("BUCKET_LIST", bucket = bucket, extra="?website")
        try:
            response = self.send_request(request, body)
            response['index_document'] = getTextFromXml(response['data'], ".//IndexDocument//Suffix")
            response['error_document'] = getTextFromXml(response['data'], ".//ErrorDocument//Key")
            response['website_endpoint'] = self.config.website_endpoint % {
                "bucket" : uri.bucket(),
                "location" : self.get_bucket_location(uri)}
            return response
        except S3Error, e:
            if e.status == 404:
                debug("Could not get /?website - website probably not configured for this bucket")
                return None
            raise

    def website_create(self, uri, bucket_location = None):
        headers = SortedDict(ignore_case = True)
        bucket = uri.bucket()
        body = '<WebsiteConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">'
        body += '  <IndexDocument>'
        body += ('    <Suffix>%s</Suffix>' % self.config.website_index)
        body += '  </IndexDocument>'
        if self.config.website_error:
            body += '  <ErrorDocument>'
            body += ('    <Key>%s</Key>' % self.config.website_error)
            body += '  </ErrorDocument>'
        body += '</WebsiteConfiguration>'

        request = self.create_request("BUCKET_CREATE", bucket = bucket, extra="?website")
        debug("About to send request '%s' with body '%s'" % (request, body))
        response = self.send_request(request, body)
        debug("Received response '%s'" % (response))

        return response

    def website_delete(self, uri, bucket_location = None):
        headers = SortedDict(ignore_case = True)
        bucket = uri.bucket()
        body = ""

        request = self.create_request("BUCKET_DELETE", bucket = bucket, extra="?website")
        debug("About to send request '%s' with body '%s'" % (request, body))
        response = self.send_request(request, body)
        debug("Received response '%s'" % (response))

        if response['status'] != 204:
            raise S3ResponseError("Expected status 204: %s" % response)

        return response

    def add_encoding(self, filename, content_type):
        if content_type.find("charset=") != -1:
           return False
        exts = self.config.add_encoding_exts.split(',')
        if exts[0]=='':
            return False
        parts = filename.rsplit('.',2)
        if len(parts) < 2:
            return False
        ext = parts[1]
        if ext in exts:
            return True
        else:
            return False

    def object_put(self, filename, uri, extra_headers = None, extra_label = ""):
        # TODO TODO
        # Make it consistent with stream-oriented object_get()
        if uri.type != "s3":
            raise ValueError("Expected URI type 's3', got '%s'" % uri.type)

        if filename != "-" and not os.path.isfile(filename):
            raise InvalidFileError(u"%s is not a regular file" % unicodise(filename))
        try:
            if filename == "-":
                file = sys.stdin
                size = 0
            else:
                file = open(filename, "rb")
                size = os.stat(filename)[ST_SIZE]
        except (IOError, OSError), e:
            raise InvalidFileError(u"%s: %s" % (unicodise(filename), e.strerror))

        headers = SortedDict(ignore_case = True)
        if extra_headers:
            headers.update(extra_headers)

        ## MIME-type handling
        content_type = self.config.mime_type
        content_encoding = None
        if filename != "-" and not content_type and self.config.guess_mime_type:
            (content_type, content_encoding) = mime_magic(filename)
        if not content_type:
            content_type = self.config.default_mime_type
        if not content_encoding:
            content_encoding = self.config.encoding.upper()

        ## add charset to content type
        if self.add_encoding(filename, content_type) and content_encoding is not None:
            content_type = content_type + "; charset=" + content_encoding

        headers["content-type"] = content_type
        if content_encoding is not None:
            headers["content-encoding"] = content_encoding

        ## Other Amazon S3 attributes
        if self.config.acl_public:
            headers["x-amz-acl"] = "public-read"
        if self.config.reduced_redundancy:
            headers["x-amz-storage-class"] = "REDUCED_REDUNDANCY"

        ## Multipart decision
        multipart = False
        if not self.config.enable_multipart and filename == "-":
            raise ParameterError("Multi-part upload is required to upload from stdin")
        if self.config.enable_multipart:
            if size > self.config.multipart_chunk_size_mb * 1024 * 1024 or filename == "-":
                multipart = True
        if multipart:
            # Multipart requests are quite different... drop here
            return self.send_file_multipart(file, headers, uri, size)

        ## Not multipart...
        headers["content-length"] = size
        request = self.create_request("OBJECT_PUT", uri = uri, headers = headers)
        labels = { 'source' : unicodise(filename), 'destination' : unicodise(uri.uri()), 'extra' : extra_label }
        response = self.send_file(request, file, labels)
        return response

    def object_get(self, uri, stream, start_position = 0, extra_label = ""):
        if uri.type != "s3":
            raise ValueError("Expected URI type 's3', got '%s'" % uri.type)
        request = self.create_request("OBJECT_GET", uri = uri)
        labels = { 'source' : unicodise(uri.uri()), 'destination' : unicodise(stream.name), 'extra' : extra_label }
        response = self.recv_file(request, stream, labels, start_position)
        return response

    def object_delete(self, uri):
        if uri.type != "s3":
            raise ValueError("Expected URI type 's3', got '%s'" % uri.type)
        request = self.create_request("OBJECT_DELETE", uri = uri)
        response = self.send_request(request)
        return response

    def object_copy(self, src_uri, dst_uri, extra_headers = None):
        if src_uri.type != "s3":
            raise ValueError("Expected URI type 's3', got '%s'" % src_uri.type)
        if dst_uri.type != "s3":
            raise ValueError("Expected URI type 's3', got '%s'" % dst_uri.type)
        headers = SortedDict(ignore_case = True)
        headers['x-amz-copy-source'] = "/%s/%s" % (src_uri.bucket(), self.urlencode_string(src_uri.object()))
        ## TODO: For now COPY, later maybe add a switch?
        headers['x-amz-metadata-directive'] = "COPY"
        if self.config.acl_public:
            headers["x-amz-acl"] = "public-read"
        if self.config.reduced_redundancy:
            headers["x-amz-storage-class"] = "REDUCED_REDUNDANCY"
        # if extra_headers:
        #   headers.update(extra_headers)
        request = self.create_request("OBJECT_PUT", uri = dst_uri, headers = headers)
        response = self.send_request(request)
        return response

    def object_move(self, src_uri, dst_uri, extra_headers = None):
        response_copy = self.object_copy(src_uri, dst_uri, extra_headers)
        debug("Object %s copied to %s" % (src_uri, dst_uri))
        if getRootTagName(response_copy["data"]) == "CopyObjectResult":
            response_delete = self.object_delete(src_uri)
            debug("Object %s deleted" % src_uri)
        return response_copy

    def object_info(self, uri):
        request = self.create_request("OBJECT_HEAD", uri = uri)
        response = self.send_request(request)
        return response

    def get_acl(self, uri):
        if uri.has_object():
            request = self.create_request("OBJECT_GET", uri = uri, extra = "?acl")
        else:
            request = self.create_request("BUCKET_LIST", bucket = uri.bucket(), extra = "?acl")

        response = self.send_request(request)
        acl = ACL(response['data'])
        return acl

    def set_acl(self, uri, acl):
        if uri.has_object():
            request = self.create_request("OBJECT_PUT", uri = uri, extra = "?acl")
        else:
            request = self.create_request("BUCKET_CREATE", bucket = uri.bucket(), extra = "?acl")

        body = str(acl)
        debug(u"set_acl(%s): acl-xml: %s" % (uri, body))
        response = self.send_request(request, body)
        return response

    def get_policy(self, uri):
        request = self.create_request("BUCKET_LIST", bucket = uri.bucket(), extra = "?policy")
        response = self.send_request(request)
        return response['data']

    def set_policy(self, uri, policy):
        headers = {}
        # TODO check policy is proper json string
        headers['content-type'] = 'application/json'
        request = self.create_request("BUCKET_CREATE", uri = uri,
                                      extra = "?policy", headers=headers)
        body = policy
        debug(u"set_policy(%s): policy-json: %s" % (uri, body))
        request.sign()
        response = self.send_request(request, body=body)
        return response

    def delete_policy(self, uri):
        request = self.create_request("BUCKET_DELETE", uri = uri, extra = "?policy")
        debug(u"delete_policy(%s)" % uri)
        response = self.send_request(request)
        return response

    def get_accesslog(self, uri):
        request = self.create_request("BUCKET_LIST", bucket = uri.bucket(), extra = "?logging")
        response = self.send_request(request)
        accesslog = AccessLog(response['data'])
        return accesslog

    def set_accesslog_acl(self, uri):
        acl = self.get_acl(uri)
        debug("Current ACL(%s): %s" % (uri.uri(), str(acl)))
        acl.appendGrantee(GranteeLogDelivery("READ_ACP"))
        acl.appendGrantee(GranteeLogDelivery("WRITE"))
        debug("Updated ACL(%s): %s" % (uri.uri(), str(acl)))
        self.set_acl(uri, acl)

    def set_accesslog(self, uri, enable, log_target_prefix_uri = None, acl_public = False):
        request = self.create_request("BUCKET_CREATE", bucket = uri.bucket(), extra = "?logging")
        accesslog = AccessLog()
        if enable:
            accesslog.enableLogging(log_target_prefix_uri)
            accesslog.setAclPublic(acl_public)
        else:
            accesslog.disableLogging()
        body = str(accesslog)
        debug(u"set_accesslog(%s): accesslog-xml: %s" % (uri, body))
        try:
            response = self.send_request(request, body)
        except S3Error, e:
            if e.info['Code'] == "InvalidTargetBucketForLogging":
                info("Setting up log-delivery ACL for target bucket.")
                self.set_accesslog_acl(S3Uri("s3://%s" % log_target_prefix_uri.bucket()))
                response = self.send_request(request, body)
            else:
                raise
        return accesslog, response

    ## Low level methods
    def urlencode_string(self, string, urlencoding_mode = None):
        if type(string) == unicode:
            string = string.encode("utf-8")

        if urlencoding_mode is None:
            urlencoding_mode = self.config.urlencoding_mode

        if urlencoding_mode == "verbatim":
            ## Don't do any pre-processing
            return string

        encoded = ""
        ## List of characters that must be escaped for S3
        ## Haven't found this in any official docs
        ## but my tests show it's more less correct.
        ## If you start getting InvalidSignature errors
        ## from S3 check the error headers returned
        ## from S3 to see whether the list hasn't
        ## changed.
        for c in string:    # I'm not sure how to know in what encoding
                    # 'object' is. Apparently "type(object)==str"
                    # but the contents is a string of unicode
                    # bytes, e.g. '\xc4\x8d\xc5\xafr\xc3\xa1k'
                    # Don't know what it will do on non-utf8
                    # systems.
                    #           [hope that sounds reassuring ;-)]
            o = ord(c)
            if (o < 0x20 or o == 0x7f):
                if urlencoding_mode == "fixbucket":
                    encoded += "%%%02X" % o
                else:
                    error(u"Non-printable character 0x%02x in: %s" % (o, string))
                    error(u"Please report it to s3tools-bugs@lists.sourceforge.net")
                    encoded += replace_nonprintables(c)
            elif (o == 0x20 or  # Space and below
                o == 0x22 or    # "
                o == 0x23 or    # #
                o == 0x25 or    # % (escape character)
                o == 0x26 or    # &
                o == 0x2B or    # + (or it would become <space>)
                o == 0x3C or    # <
                o == 0x3E or    # >
                o == 0x3F or    # ?
                o == 0x60 or    # `
                o >= 123):      # { and above, including >= 128 for UTF-8
                encoded += "%%%02X" % o
            else:
                encoded += c
        debug("String '%s' encoded to '%s'" % (string, encoded))
        return encoded

    def create_request(self, operation, uri = None, bucket = None, object = None, headers = None, extra = None, **params):
        resource = { 'bucket' : None, 'uri' : "/" }

        if uri and (bucket or object):
            raise ValueError("Both 'uri' and either 'bucket' or 'object' parameters supplied")
        ## If URI is given use that instead of bucket/object parameters
        if uri:
            bucket = uri.bucket()
            object = uri.has_object() and uri.object() or None

        if bucket:
            resource['bucket'] = str(bucket)
            if object:
                resource['uri'] = "/" + self.urlencode_string(object)
        if extra:
            resource['uri'] += extra

        method_string = S3.http_methods.getkey(S3.operations[operation] & S3.http_methods["MASK"])

        request = S3Request(self, method_string, resource, headers, params)

        debug("CreateRequest: resource[uri]=" + resource['uri'])
        return request

    def _fail_wait(self, retries):
        # Wait a few seconds. The more it fails the more we wait.
        return (self._max_retries - retries + 1) * 3

    def send_request(self, request, body = None, retries = _max_retries):
        method_string, resource, headers = request.get_triplet()
        debug("Processing request, please wait...")
        if not headers.has_key('content-length'):
            headers['content-length'] = body and len(body) or 0
        try:
            # "Stringify" all headers
            for header in headers.keys():
                headers[header] = str(headers[header])
            conn = ConnMan.get(self.get_hostname(resource['bucket']))
            uri = self.format_uri(resource)
            debug("Sending request method_string=%r, uri=%r, headers=%r, body=(%i bytes)" % (method_string, uri, headers, len(body or "")))
            conn.c.request(method_string, uri, body, headers)
            response = {}
            http_response = conn.c.getresponse()
            response["status"] = http_response.status
            response["reason"] = http_response.reason
            response["headers"] = convertTupleListToDict(http_response.getheaders())
            response["data"] =  http_response.read()
            debug("Response: " + str(response))
            ConnMan.put(conn)
        except ParameterError, e:
            raise
        except Exception, e:
            if retries:
                warning("Retrying failed request: %s (%s)" % (resource['uri'], e))
                warning("Waiting %d sec..." % self._fail_wait(retries))
                time.sleep(self._fail_wait(retries))
                return self.send_request(request, body, retries - 1)
            else:
                raise S3RequestError("Request failed for: %s" % resource['uri'])

        if response["status"] == 307:
            ## RedirectPermanent
            redir_bucket = getTextFromXml(response['data'], ".//Bucket")
            redir_hostname = getTextFromXml(response['data'], ".//Endpoint")
            self.set_hostname(redir_bucket, redir_hostname)
            warning("Redirected to: %s" % (redir_hostname))
            return self.send_request(request, body)

        if response["status"] >= 500:
            e = S3Error(response)
            if retries:
                warning(u"Retrying failed request: %s" % resource['uri'])
                warning(unicode(e))
                warning("Waiting %d sec..." % self._fail_wait(retries))
                time.sleep(self._fail_wait(retries))
                return self.send_request(request, body, retries - 1)
            else:
                raise e

        if response["status"] < 200 or response["status"] > 299:
            raise S3Error(response)

        return response

    def send_file(self, request, file, labels, buffer = '', throttle = 0, retries = _max_retries, offset = 0, chunk_size = -1):
        method_string, resource, headers = request.get_triplet()
        size_left = size_total = headers.get("content-length")
        if self.config.progress_meter:
            progress = self.config.progress_class(labels, size_total)
        else:
            info("Sending file '%s', please wait..." % file.name)
        timestamp_start = time.time()
        try:
            conn = ConnMan.get(self.get_hostname(resource['bucket']))
            conn.c.putrequest(method_string, self.format_uri(resource))
            for header in headers.keys():
                conn.c.putheader(header, str(headers[header]))
            conn.c.endheaders()
        except ParameterError, e:
            raise
        except Exception, e:
            if self.config.progress_meter:
                progress.done("failed")
            if retries:
                warning("Retrying failed request: %s (%s)" % (resource['uri'], e))
                warning("Waiting %d sec..." % self._fail_wait(retries))
                time.sleep(self._fail_wait(retries))
                # Connection error -> same throttle value
                return self.send_file(request, file, labels, buffer, throttle, retries - 1, offset, chunk_size)
            else:
                raise S3UploadError("Upload failed for: %s" % resource['uri'])
        if buffer == '':
            file.seek(offset)
        md5_hash = md5()
        try:
            while (size_left > 0):
                #debug("SendFile: Reading up to %d bytes from '%s' - remaining bytes: %s" % (self.config.send_chunk, file.name, size_left))
                if buffer == '':
                    data = file.read(min(self.config.send_chunk, size_left))
                else:
                    data = buffer
                md5_hash.update(data)
                conn.c.send(data)
                if self.config.progress_meter:
                    progress.update(delta_position = len(data))
                size_left -= len(data)
                if throttle:
                    time.sleep(throttle)
            md5_computed = md5_hash.hexdigest()
            response = {}
            http_response = conn.c.getresponse()
            response["status"] = http_response.status
            response["reason"] = http_response.reason
            response["headers"] = convertTupleListToDict(http_response.getheaders())
            response["data"] = http_response.read()
            response["size"] = size_total
            ConnMan.put(conn)
            debug(u"Response: %s" % response)
        except ParameterError, e:
            raise
        except Exception, e:
            if self.config.progress_meter:
                progress.done("failed")
            if retries:
                if retries < self._max_retries:
                    throttle = throttle and throttle * 5 or 0.01
                warning("Upload failed: %s (%s)" % (resource['uri'], e))
                warning("Retrying on lower speed (throttle=%0.2f)" % throttle)
                warning("Waiting %d sec..." % self._fail_wait(retries))
                time.sleep(self._fail_wait(retries))
                # Connection error -> same throttle value
                return self.send_file(request, file, labels, buffer, throttle, retries - 1, offset, chunk_size)
            else:
                debug("Giving up on '%s' %s" % (file.name, e))
                raise S3UploadError("Upload failed for: %s" % resource['uri'])

        timestamp_end = time.time()
        response["elapsed"] = timestamp_end - timestamp_start
        response["speed"] = response["elapsed"] and float(response["size"]) / response["elapsed"] or float(-1)

        if self.config.progress_meter:
            ## Finalising the upload takes some time -> update() progress meter
            ## to correct the average speed. Otherwise people will complain that
            ## 'progress' and response["speed"] are inconsistent ;-)
            progress.update()
            progress.done("done")

        if response["status"] == 307:
            ## RedirectPermanent
            redir_bucket = getTextFromXml(response['data'], ".//Bucket")
            redir_hostname = getTextFromXml(response['data'], ".//Endpoint")
            self.set_hostname(redir_bucket, redir_hostname)
            warning("Redirected to: %s" % (redir_hostname))
            return self.send_file(request, file, labels, buffer, offset = offset, chunk_size = chunk_size)

        # S3 from time to time doesn't send ETag back in a response :-(
        # Force re-upload here.
        if not response['headers'].has_key('etag'):
            response['headers']['etag'] = ''

        if response["status"] < 200 or response["status"] > 299:
            try_retry = False
            if response["status"] >= 500:
                ## AWS internal error - retry
                try_retry = True
            elif response["status"] >= 400:
                err = S3Error(response)
                ## Retriable client error?
                if err.code in [ 'BadDigest', 'OperationAborted', 'TokenRefreshRequired', 'RequestTimeout' ]:
                    try_retry = True

            if try_retry:
                if retries:
                    warning("Upload failed: %s (%s)" % (resource['uri'], S3Error(response)))
                    warning("Waiting %d sec..." % self._fail_wait(retries))
                    time.sleep(self._fail_wait(retries))
                    return self.send_file(request, file, labels, buffer, throttle, retries - 1, offset, chunk_size)
                else:
                    warning("Too many failures. Giving up on '%s'" % (file.name))
                    raise S3UploadError

            ## Non-recoverable error
            raise S3Error(response)

        debug("MD5 sums: computed=%s, received=%s" % (md5_computed, response["headers"]["etag"]))
        if response["headers"]["etag"].strip('"\'') != md5_hash.hexdigest():
            warning("MD5 Sums don't match!")
            if retries:
                warning("Retrying upload of %s" % (file.name))
                return self.send_file(request, file, labels, buffer, throttle, retries - 1, offset, chunk_size)
            else:
                warning("Too many failures. Giving up on '%s'" % (file.name))
                raise S3UploadError

        return response

    def send_file_multipart(self, file, headers, uri, size):
        chunk_size = self.config.multipart_chunk_size_mb * 1024 * 1024
        timestamp_start = time.time()
        upload = MultiPartUpload(self, file, uri, headers)
        upload.upload_all_parts()
        response = upload.complete_multipart_upload()
        timestamp_end = time.time()
        response["elapsed"] = timestamp_end - timestamp_start
        response["size"] = size
        response["speed"] = response["elapsed"] and float(response["size"]) / response["elapsed"] or float(-1)
        return response

    def recv_file(self, request, stream, labels, start_position = 0, retries = _max_retries):
        method_string, resource, headers = request.get_triplet()
        if self.config.progress_meter:
            progress = self.config.progress_class(labels, 0)
        else:
            info("Receiving file '%s', please wait..." % stream.name)
        timestamp_start = time.time()
        try:
            conn = ConnMan.get(self.get_hostname(resource['bucket']))
            conn.c.putrequest(method_string, self.format_uri(resource))
            for header in headers.keys():
                conn.c.putheader(header, str(headers[header]))
            if start_position > 0:
                debug("Requesting Range: %d .. end" % start_position)
                conn.c.putheader("Range", "bytes=%d-" % start_position)
            conn.c.endheaders()
            response = {}
            http_response = conn.c.getresponse()
            response["status"] = http_response.status
            response["reason"] = http_response.reason
            response["headers"] = convertTupleListToDict(http_response.getheaders())
            debug("Response: %s" % response)
        except ParameterError, e:
            raise
        except Exception, e:
            if self.config.progress_meter:
                progress.done("failed")
            if retries:
                warning("Retrying failed request: %s (%s)" % (resource['uri'], e))
                warning("Waiting %d sec..." % self._fail_wait(retries))
                time.sleep(self._fail_wait(retries))
                # Connection error -> same throttle value
                return self.recv_file(request, stream, labels, start_position, retries - 1)
            else:
                raise S3DownloadError("Download failed for: %s" % resource['uri'])

        if response["status"] == 307:
            ## RedirectPermanent
            response['data'] = http_response.read()
            redir_bucket = getTextFromXml(response['data'], ".//Bucket")
            redir_hostname = getTextFromXml(response['data'], ".//Endpoint")
            self.set_hostname(redir_bucket, redir_hostname)
            warning("Redirected to: %s" % (redir_hostname))
            return self.recv_file(request, stream, labels)

        if response["status"] < 200 or response["status"] > 299:
            raise S3Error(response)

        if start_position == 0:
            # Only compute MD5 on the fly if we're downloading from beginning
            # Otherwise we'd get a nonsense.
            md5_hash = md5()
        size_left = int(response["headers"]["content-length"])
        size_total = start_position + size_left
        current_position = start_position

        if self.config.progress_meter:
            progress.total_size = size_total
            progress.initial_position = current_position
            progress.current_position = current_position

        try:
            while (current_position < size_total):
                this_chunk = size_left > self.config.recv_chunk and self.config.recv_chunk or size_left
                data = http_response.read(this_chunk)
                if len(data) == 0:
                    raise S3Error("EOF from S3!")

                stream.write(data)
                if start_position == 0:
                    md5_hash.update(data)
                current_position += len(data)
                ## Call progress meter from here...
                if self.config.progress_meter:
                    progress.update(delta_position = len(data))
            ConnMan.put(conn)
        except Exception, e:
            if self.config.progress_meter:
                progress.done("failed")
            if retries:
                warning("Retrying failed request: %s (%s)" % (resource['uri'], e))
                warning("Waiting %d sec..." % self._fail_wait(retries))
                time.sleep(self._fail_wait(retries))
                # Connection error -> same throttle value
                return self.recv_file(request, stream, labels, current_position, retries - 1)
            else:
                raise S3DownloadError("Download failed for: %s" % resource['uri'])

        stream.flush()
        timestamp_end = time.time()

        if self.config.progress_meter:
            ## The above stream.flush() may take some time -> update() progress meter
            ## to correct the average speed. Otherwise people will complain that
            ## 'progress' and response["speed"] are inconsistent ;-)
            progress.update()
            progress.done("done")

        if start_position == 0:
            # Only compute MD5 on the fly if we were downloading from the beginning
            response["md5"] = md5_hash.hexdigest()
        else:
            # Otherwise try to compute MD5 of the output file
            try:
                response["md5"] = hash_file_md5(stream.name)
            except IOError, e:
                if e.errno != errno.ENOENT:
                    warning("Unable to open file: %s: %s" % (stream.name, e))
                warning("Unable to verify MD5. Assume it matches.")
                response["md5"] = response["headers"]["etag"]

        response["md5match"] = response["headers"]["etag"].find(response["md5"]) >= 0
        response["elapsed"] = timestamp_end - timestamp_start
        response["size"] = current_position
        response["speed"] = response["elapsed"] and float(response["size"]) / response["elapsed"] or float(-1)
        if response["size"] != start_position + long(response["headers"]["content-length"]):
            warning("Reported size (%s) does not match received size (%s)" % (
                start_position + response["headers"]["content-length"], response["size"]))
        debug("ReceiveFile: Computed MD5 = %s" % response["md5"])
        if not response["md5match"]:
            warning("MD5 signatures do not match: computed=%s, received=%s" % (
                response["md5"], response["headers"]["etag"]))
        return response
__all__.append("S3")

# vim:et:ts=4:sts=4:ai
