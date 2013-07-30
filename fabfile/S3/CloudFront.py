## Amazon CloudFront support
## Author: Michal Ludvig <michal@logix.cz>
##         http://www.logix.cz/michal
## License: GPL Version 2

import sys
import time
import httplib
import random
from datetime import datetime
from logging import debug, info, warning, error

try:
    import xml.etree.ElementTree as ET
except ImportError:
    import elementtree.ElementTree as ET

from Config import Config
from Exceptions import *
from Utils import getTreeFromXml, appendXmlTextNode, getDictFromTree, dateS3toPython, sign_string, getBucketFromHostname, getHostnameFromBucket
from S3Uri import S3Uri, S3UriS3
from FileLists import fetch_remote_list

cloudfront_api_version = "2010-11-01"
cloudfront_resource = "/%(api_ver)s/distribution" % { 'api_ver' : cloudfront_api_version }

def output(message):
    sys.stdout.write(message + "\n")

def pretty_output(label, message):
    #label = ("%s " % label).ljust(20, ".")
    label = ("%s:" % label).ljust(15)
    output("%s %s" % (label, message))

class DistributionSummary(object):
    ## Example:
    ##
    ## <DistributionSummary>
    ##  <Id>1234567890ABC</Id>
    ##  <Status>Deployed</Status>
    ##  <LastModifiedTime>2009-01-16T11:49:02.189Z</LastModifiedTime>
    ##  <DomainName>blahblahblah.cloudfront.net</DomainName>
    ##  <S3Origin>
    ##     <DNSName>example.bucket.s3.amazonaws.com</DNSName>
    ##  </S3Origin>
    ##  <CNAME>cdn.example.com</CNAME>
    ##  <CNAME>img.example.com</CNAME>
    ##  <Comment>What Ever</Comment>
    ##  <Enabled>true</Enabled>
    ## </DistributionSummary>

    def __init__(self, tree):
        if tree.tag != "DistributionSummary":
            raise ValueError("Expected <DistributionSummary /> xml, got: <%s />" % tree.tag)
        self.parse(tree)

    def parse(self, tree):
        self.info = getDictFromTree(tree)
        self.info['Enabled'] = (self.info['Enabled'].lower() == "true")
        if self.info.has_key("CNAME") and type(self.info['CNAME']) != list:
            self.info['CNAME'] = [self.info['CNAME']]

    def uri(self):
        return S3Uri("cf://%s" % self.info['Id'])

class DistributionList(object):
    ## Example:
    ##
    ## <DistributionList xmlns="http://cloudfront.amazonaws.com/doc/2010-07-15/">
    ##  <Marker />
    ##  <MaxItems>100</MaxItems>
    ##  <IsTruncated>false</IsTruncated>
    ##  <DistributionSummary>
    ##  ... handled by DistributionSummary() class ...
    ##  </DistributionSummary>
    ## </DistributionList>

    def __init__(self, xml):
        tree = getTreeFromXml(xml)
        if tree.tag != "DistributionList":
            raise ValueError("Expected <DistributionList /> xml, got: <%s />" % tree.tag)
        self.parse(tree)

    def parse(self, tree):
        self.info = getDictFromTree(tree)
        ## Normalise some items
        self.info['IsTruncated'] = (self.info['IsTruncated'].lower() == "true")

        self.dist_summs = []
        for dist_summ in tree.findall(".//DistributionSummary"):
            self.dist_summs.append(DistributionSummary(dist_summ))

class Distribution(object):
    ## Example:
    ##
    ## <Distribution xmlns="http://cloudfront.amazonaws.com/doc/2010-07-15/">
    ##  <Id>1234567890ABC</Id>
    ##  <Status>InProgress</Status>
    ##  <LastModifiedTime>2009-01-16T13:07:11.319Z</LastModifiedTime>
    ##  <DomainName>blahblahblah.cloudfront.net</DomainName>
    ##  <DistributionConfig>
    ##  ... handled by DistributionConfig() class ...
    ##  </DistributionConfig>
    ## </Distribution>

    def __init__(self, xml):
        tree = getTreeFromXml(xml)
        if tree.tag != "Distribution":
            raise ValueError("Expected <Distribution /> xml, got: <%s />" % tree.tag)
        self.parse(tree)

    def parse(self, tree):
        self.info = getDictFromTree(tree)
        ## Normalise some items
        self.info['LastModifiedTime'] = dateS3toPython(self.info['LastModifiedTime'])

        self.info['DistributionConfig'] = DistributionConfig(tree = tree.find(".//DistributionConfig"))

    def uri(self):
        return S3Uri("cf://%s" % self.info['Id'])

class DistributionConfig(object):
    ## Example:
    ##
    ## <DistributionConfig>
    ##  <Origin>somebucket.s3.amazonaws.com</Origin>
    ##  <CallerReference>s3://somebucket/</CallerReference>
    ##  <Comment>http://somebucket.s3.amazonaws.com/</Comment>
    ##  <Enabled>true</Enabled>
    ##  <Logging>
    ##    <Bucket>bu.ck.et</Bucket>
    ##    <Prefix>/cf-somebucket/</Prefix>
    ##  </Logging>
    ## </DistributionConfig>

    EMPTY_CONFIG = "<DistributionConfig><S3Origin><DNSName/></S3Origin><CallerReference/><Enabled>true</Enabled></DistributionConfig>"
    xmlns = "http://cloudfront.amazonaws.com/doc/%(api_ver)s/" % { 'api_ver' : cloudfront_api_version }
    def __init__(self, xml = None, tree = None):
        if xml is None:
            xml = DistributionConfig.EMPTY_CONFIG

        if tree is None:
            tree = getTreeFromXml(xml)

        if tree.tag != "DistributionConfig":
            raise ValueError("Expected <DistributionConfig /> xml, got: <%s />" % tree.tag)
        self.parse(tree)

    def parse(self, tree):
        self.info = getDictFromTree(tree)
        self.info['Enabled'] = (self.info['Enabled'].lower() == "true")
        if not self.info.has_key("CNAME"):
            self.info['CNAME'] = []
        if type(self.info['CNAME']) != list:
            self.info['CNAME'] = [self.info['CNAME']]
        self.info['CNAME'] = [cname.lower() for cname in self.info['CNAME']]
        if not self.info.has_key("Comment"):
            self.info['Comment'] = ""
        if not self.info.has_key("DefaultRootObject"):
            self.info['DefaultRootObject'] = ""
        ## Figure out logging - complex node not parsed by getDictFromTree()
        logging_nodes = tree.findall(".//Logging")
        if logging_nodes:
            logging_dict = getDictFromTree(logging_nodes[0])
            logging_dict['Bucket'], success = getBucketFromHostname(logging_dict['Bucket'])
            if not success:
                warning("Logging to unparsable bucket name: %s" % logging_dict['Bucket'])
            self.info['Logging'] = S3UriS3("s3://%(Bucket)s/%(Prefix)s" % logging_dict)
        else:
            self.info['Logging'] = None

    def __str__(self):
        tree = ET.Element("DistributionConfig")
        tree.attrib['xmlns'] = DistributionConfig.xmlns

        ## Retain the order of the following calls!
        s3org = appendXmlTextNode("S3Origin", '', tree)
        appendXmlTextNode("DNSName", self.info['S3Origin']['DNSName'], s3org)
        appendXmlTextNode("CallerReference", self.info['CallerReference'], tree)
        for cname in self.info['CNAME']:
            appendXmlTextNode("CNAME", cname.lower(), tree)
        if self.info['Comment']:
            appendXmlTextNode("Comment", self.info['Comment'], tree)
        appendXmlTextNode("Enabled", str(self.info['Enabled']).lower(), tree)
        # don't create a empty DefaultRootObject element as it would result in a MalformedXML error
        if str(self.info['DefaultRootObject']):
            appendXmlTextNode("DefaultRootObject", str(self.info['DefaultRootObject']), tree)
        if self.info['Logging']:
            logging_el = ET.Element("Logging")
            appendXmlTextNode("Bucket", getHostnameFromBucket(self.info['Logging'].bucket()), logging_el)
            appendXmlTextNode("Prefix", self.info['Logging'].object(), logging_el)
            tree.append(logging_el)
        return ET.tostring(tree)

class Invalidation(object):
    ## Example:
    ##
    ## <Invalidation xmlns="http://cloudfront.amazonaws.com/doc/2010-11-01/">
    ##   <Id>id</Id>
    ##   <Status>status</Status>
    ##   <CreateTime>date</CreateTime>
    ##   <InvalidationBatch>
    ##       <Path>/image1.jpg</Path>
    ##       <Path>/image2.jpg</Path>
    ##       <Path>/videos/movie.flv</Path>
    ##       <CallerReference>my-batch</CallerReference>
    ##   </InvalidationBatch>
    ## </Invalidation>

    def __init__(self, xml):
        tree = getTreeFromXml(xml)
        if tree.tag != "Invalidation":
            raise ValueError("Expected <Invalidation /> xml, got: <%s />" % tree.tag)
        self.parse(tree)

    def parse(self, tree):
        self.info = getDictFromTree(tree)

    def __str__(self):
        return str(self.info)

class InvalidationList(object):
    ## Example:
    ##
    ## <InvalidationList>
    ##   <Marker/>
    ##   <NextMarker>Invalidation ID</NextMarker>
    ##   <MaxItems>2</MaxItems>
    ##   <IsTruncated>true</IsTruncated>
    ##   <InvalidationSummary>
    ##     <Id>[Second Invalidation ID]</Id>
    ##     <Status>Completed</Status>
    ##   </InvalidationSummary>
    ##   <InvalidationSummary>
    ##     <Id>[First Invalidation ID]</Id>
    ##     <Status>Completed</Status>
    ##   </InvalidationSummary>
    ## </InvalidationList>

    def __init__(self, xml):
        tree = getTreeFromXml(xml)
        if tree.tag != "InvalidationList":
            raise ValueError("Expected <InvalidationList /> xml, got: <%s />" % tree.tag)
        self.parse(tree)

    def parse(self, tree):
        self.info = getDictFromTree(tree)

    def __str__(self):
        return str(self.info)

class InvalidationBatch(object):
    ## Example:
    ##
    ## <InvalidationBatch>
    ##   <Path>/image1.jpg</Path>
    ##   <Path>/image2.jpg</Path>
    ##   <Path>/videos/movie.flv</Path>
    ##   <Path>/sound%20track.mp3</Path>
    ##   <CallerReference>my-batch</CallerReference>
    ## </InvalidationBatch>

    def __init__(self, reference = None, distribution = None, paths = []):
        if reference:
            self.reference = reference
        else:
            if not distribution:
                distribution="0"
            self.reference = "%s.%s.%s" % (distribution,
                datetime.strftime(datetime.now(),"%Y%m%d%H%M%S"),
                random.randint(1000,9999))
        self.paths = []
        self.add_objects(paths)

    def add_objects(self, paths):
        self.paths.extend(paths)

    def get_reference(self):
        return self.reference

    def __str__(self):
        tree = ET.Element("InvalidationBatch")

        for path in self.paths:
            if len(path) < 1 or path[0] != "/":
                path = "/" + path
            appendXmlTextNode("Path", path, tree)
        appendXmlTextNode("CallerReference", self.reference, tree)
        return ET.tostring(tree)

class CloudFront(object):
    operations = {
        "CreateDist" : { 'method' : "POST", 'resource' : "" },
        "DeleteDist" : { 'method' : "DELETE", 'resource' : "/%(dist_id)s" },
        "GetList" : { 'method' : "GET", 'resource' : "" },
        "GetDistInfo" : { 'method' : "GET", 'resource' : "/%(dist_id)s" },
        "GetDistConfig" : { 'method' : "GET", 'resource' : "/%(dist_id)s/config" },
        "SetDistConfig" : { 'method' : "PUT", 'resource' : "/%(dist_id)s/config" },
        "Invalidate" : { 'method' : "POST", 'resource' : "/%(dist_id)s/invalidation" },
        "GetInvalList" : { 'method' : "GET", 'resource' : "/%(dist_id)s/invalidation" },
        "GetInvalInfo" : { 'method' : "GET", 'resource' : "/%(dist_id)s/invalidation/%(request_id)s" },
    }

    ## Maximum attempts of re-issuing failed requests
    _max_retries = 5
    dist_list = None

    def __init__(self, config):
        self.config = config

    ## --------------------------------------------------
    ## Methods implementing CloudFront API
    ## --------------------------------------------------

    def GetList(self):
        response = self.send_request("GetList")
        response['dist_list'] = DistributionList(response['data'])
        if response['dist_list'].info['IsTruncated']:
            raise NotImplementedError("List is truncated. Ask s3cmd author to add support.")
        ## TODO: handle Truncated
        return response

    def CreateDistribution(self, uri, cnames_add = [], comment = None, logging = None, default_root_object = None):
        dist_config = DistributionConfig()
        dist_config.info['Enabled'] = True
        dist_config.info['S3Origin']['DNSName'] = uri.host_name()
        dist_config.info['CallerReference'] = str(uri)
        dist_config.info['DefaultRootObject'] = default_root_object
        if comment == None:
            dist_config.info['Comment'] = uri.public_url()
        else:
            dist_config.info['Comment'] = comment
        for cname in cnames_add:
            if dist_config.info['CNAME'].count(cname) == 0:
                dist_config.info['CNAME'].append(cname)
        if logging:
            dist_config.info['Logging'] = S3UriS3(logging)
        request_body = str(dist_config)
        debug("CreateDistribution(): request_body: %s" % request_body)
        response = self.send_request("CreateDist", body = request_body)
        response['distribution'] = Distribution(response['data'])
        return response

    def ModifyDistribution(self, cfuri, cnames_add = [], cnames_remove = [],
                           comment = None, enabled = None, logging = None,
                           default_root_object = None):
        if cfuri.type != "cf":
            raise ValueError("Expected CFUri instead of: %s" % cfuri)
        # Get current dist status (enabled/disabled) and Etag
        info("Checking current status of %s" % cfuri)
        response = self.GetDistConfig(cfuri)
        dc = response['dist_config']
        if enabled != None:
            dc.info['Enabled'] = enabled
        if comment != None:
            dc.info['Comment'] = comment
        if default_root_object != None:
            dc.info['DefaultRootObject'] = default_root_object
        for cname in cnames_add:
            if dc.info['CNAME'].count(cname) == 0:
                dc.info['CNAME'].append(cname)
        for cname in cnames_remove:
            while dc.info['CNAME'].count(cname) > 0:
                dc.info['CNAME'].remove(cname)
        if logging != None:
            if logging == False:
                dc.info['Logging'] = False
            else:
                dc.info['Logging'] = S3UriS3(logging)
        response = self.SetDistConfig(cfuri, dc, response['headers']['etag'])
        return response

    def DeleteDistribution(self, cfuri):
        if cfuri.type != "cf":
            raise ValueError("Expected CFUri instead of: %s" % cfuri)
        # Get current dist status (enabled/disabled) and Etag
        info("Checking current status of %s" % cfuri)
        response = self.GetDistConfig(cfuri)
        if response['dist_config'].info['Enabled']:
            info("Distribution is ENABLED. Disabling first.")
            response['dist_config'].info['Enabled'] = False
            response = self.SetDistConfig(cfuri, response['dist_config'],
                                          response['headers']['etag'])
            warning("Waiting for Distribution to become disabled.")
            warning("This may take several minutes, please wait.")
            while True:
                response = self.GetDistInfo(cfuri)
                d = response['distribution']
                if d.info['Status'] == "Deployed" and d.info['Enabled'] == False:
                    info("Distribution is now disabled")
                    break
                warning("Still waiting...")
                time.sleep(10)
        headers = {}
        headers['if-match'] = response['headers']['etag']
        response = self.send_request("DeleteDist", dist_id = cfuri.dist_id(),
                                     headers = headers)
        return response

    def GetDistInfo(self, cfuri):
        if cfuri.type != "cf":
            raise ValueError("Expected CFUri instead of: %s" % cfuri)
        response = self.send_request("GetDistInfo", dist_id = cfuri.dist_id())
        response['distribution'] = Distribution(response['data'])
        return response

    def GetDistConfig(self, cfuri):
        if cfuri.type != "cf":
            raise ValueError("Expected CFUri instead of: %s" % cfuri)
        response = self.send_request("GetDistConfig", dist_id = cfuri.dist_id())
        response['dist_config'] = DistributionConfig(response['data'])
        return response

    def SetDistConfig(self, cfuri, dist_config, etag = None):
        if etag == None:
            debug("SetDistConfig(): Etag not set. Fetching it first.")
            etag = self.GetDistConfig(cfuri)['headers']['etag']
        debug("SetDistConfig(): Etag = %s" % etag)
        request_body = str(dist_config)
        debug("SetDistConfig(): request_body: %s" % request_body)
        headers = {}
        headers['if-match'] = etag
        response = self.send_request("SetDistConfig", dist_id = cfuri.dist_id(),
                                     body = request_body, headers = headers)
        return response

    def InvalidateObjects(self, uri, paths, default_index_file, invalidate_default_index_on_cf, invalidate_default_index_root_on_cf):
        # joseprio: if the user doesn't want to invalidate the default index
        # path, or if the user wants to invalidate the root of the default
        # index, we need to process those paths
        if default_index_file is not None and (not invalidate_default_index_on_cf or invalidate_default_index_root_on_cf):
            new_paths = []
            default_index_suffix = '/' + default_index_file
            for path in paths:
                if path.endswith(default_index_suffix) or path ==  default_index_file:
                    if invalidate_default_index_on_cf:
                        new_paths.append(path)
                    if invalidate_default_index_root_on_cf:
                        new_paths.append(path[:-len(default_index_file)])
                else:
                    new_paths.append(path)
            paths = new_paths

        # uri could be either cf:// or s3:// uri
        cfuri = self.get_dist_name_for_bucket(uri)
        if len(paths) > 999:
            try:
                tmp_filename = Utils.mktmpfile()
                f = open(tmp_filename, "w")
                f.write("\n".join(paths)+"\n")
                f.close()
                warning("Request to invalidate %d paths (max 999 supported)" % len(paths))
                warning("All the paths are now saved in: %s" % tmp_filename)
            except:
                pass
            raise ParameterError("Too many paths to invalidate")
        invalbatch = InvalidationBatch(distribution = cfuri.dist_id(), paths = paths)
        debug("InvalidateObjects(): request_body: %s" % invalbatch)
        response = self.send_request("Invalidate", dist_id = cfuri.dist_id(),
                                     body = str(invalbatch))
        response['dist_id'] = cfuri.dist_id()
        if response['status'] == 201:
            inval_info = Invalidation(response['data']).info
            response['request_id'] = inval_info['Id']
        debug("InvalidateObjects(): response: %s" % response)
        return response

    def GetInvalList(self, cfuri):
        if cfuri.type != "cf":
            raise ValueError("Expected CFUri instead of: %s" % cfuri)
        response = self.send_request("GetInvalList", dist_id = cfuri.dist_id())
        response['inval_list'] = InvalidationList(response['data'])
        return response

    def GetInvalInfo(self, cfuri):
        if cfuri.type != "cf":
            raise ValueError("Expected CFUri instead of: %s" % cfuri)
        if cfuri.request_id() is None:
            raise ValueError("Expected CFUri with Request ID")
        response = self.send_request("GetInvalInfo", dist_id = cfuri.dist_id(), request_id = cfuri.request_id())
        response['inval_status'] = Invalidation(response['data'])
        return response

    ## --------------------------------------------------
    ## Low-level methods for handling CloudFront requests
    ## --------------------------------------------------

    def send_request(self, op_name, dist_id = None, request_id = None, body = None, headers = {}, retries = _max_retries):
        operation = self.operations[op_name]
        if body:
            headers['content-type'] = 'text/plain'
        request = self.create_request(operation, dist_id, request_id, headers)
        conn = self.get_connection()
        debug("send_request(): %s %s" % (request['method'], request['resource']))
        conn.request(request['method'], request['resource'], body, request['headers'])
        http_response = conn.getresponse()
        response = {}
        response["status"] = http_response.status
        response["reason"] = http_response.reason
        response["headers"] = dict(http_response.getheaders())
        response["data"] =  http_response.read()
        conn.close()

        debug("CloudFront: response: %r" % response)

        if response["status"] >= 500:
            e = CloudFrontError(response)
            if retries:
                warning(u"Retrying failed request: %s" % op_name)
                warning(unicode(e))
                warning("Waiting %d sec..." % self._fail_wait(retries))
                time.sleep(self._fail_wait(retries))
                return self.send_request(op_name, dist_id, body, retries - 1)
            else:
                raise e

        if response["status"] < 200 or response["status"] > 299:
            raise CloudFrontError(response)

        return response

    def create_request(self, operation, dist_id = None, request_id = None, headers = None):
        resource = cloudfront_resource + (
                   operation['resource'] % { 'dist_id' : dist_id, 'request_id' : request_id })

        if not headers:
            headers = {}

        if headers.has_key("date"):
            if not headers.has_key("x-amz-date"):
                headers["x-amz-date"] = headers["date"]
            del(headers["date"])

        if not headers.has_key("x-amz-date"):
            headers["x-amz-date"] = time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.gmtime())

        if len(self.config.access_token)>0:
            self.config.refresh_role()
            headers['x-amz-security-token']=self.config.access_token

        signature = self.sign_request(headers)
        headers["Authorization"] = "AWS "+self.config.access_key+":"+signature

        request = {}
        request['resource'] = resource
        request['headers'] = headers
        request['method'] = operation['method']

        return request

    def sign_request(self, headers):
        string_to_sign = headers['x-amz-date']
        signature = sign_string(string_to_sign)
        debug(u"CloudFront.sign_request('%s') = %s" % (string_to_sign, signature))
        return signature

    def get_connection(self):
        if self.config.proxy_host != "":
            raise ParameterError("CloudFront commands don't work from behind a HTTP proxy")
        return httplib.HTTPSConnection(self.config.cloudfront_host)

    def _fail_wait(self, retries):
        # Wait a few seconds. The more it fails the more we wait.
        return (self._max_retries - retries + 1) * 3

    def get_dist_name_for_bucket(self, uri):
        if (uri.type == "cf"):
            return uri
        if (uri.type != "s3"):
            raise ParameterError("CloudFront or S3 URI required instead of: %s" % arg)

        debug("_get_dist_name_for_bucket(%r)" % uri)
        if CloudFront.dist_list is None:
            response = self.GetList()
            CloudFront.dist_list = {}
            for d in response['dist_list'].dist_summs:
                if d.info.has_key("S3Origin"):
                    CloudFront.dist_list[getBucketFromHostname(d.info['S3Origin']['DNSName'])[0]] = d.uri()
                elif d.info.has_key("CustomOrigin"):
                    # Aral: This used to skip over distributions with CustomOrigin, however, we mustn't
                    #       do this since S3 buckets that are set up as websites use custom origins.
                    #       Thankfully, the custom origin URLs they use start with the URL of the
                    #       S3 bucket. Here, we make use this naming convention to support this use case.
                    distListIndex = getBucketFromHostname(d.info['CustomOrigin']['DNSName'])[0];
                    distListIndex = distListIndex[:len(uri.bucket())]
                    CloudFront.dist_list[distListIndex] = d.uri()
                else:
                    # Aral: I'm not sure when this condition will be reached, but keeping it in there.
                    continue
            debug("dist_list: %s" % CloudFront.dist_list)
        try:
            return CloudFront.dist_list[uri.bucket()]
        except Exception, e:
            debug(e)
            raise ParameterError("Unable to translate S3 URI to CloudFront distribution name: %s" % arg)

class Cmd(object):
    """
    Class that implements CloudFront commands
    """

    class Options(object):
        cf_cnames_add = []
        cf_cnames_remove = []
        cf_comment = None
        cf_enable = None
        cf_logging = None
        cf_default_root_object = None

        def option_list(self):
            return [opt for opt in dir(self) if opt.startswith("cf_")]

        def update_option(self, option, value):
            setattr(Cmd.options, option, value)

    options = Options()

    @staticmethod
    def _parse_args(args):
        cf = CloudFront(Config())
        cfuris = []
        for arg in args:
            uri = cf.get_dist_name_for_bucket(S3Uri(arg))
            cfuris.append(uri)
        return cfuris

    @staticmethod
    def info(args):
        cf = CloudFront(Config())
        if not args:
            response = cf.GetList()
            for d in response['dist_list'].dist_summs:
                if d.info.has_key("S3Origin"):
                    origin = S3UriS3.httpurl_to_s3uri(d.info['S3Origin']['DNSName'])
                elif d.info.has_key("CustomOrigin"):
                    origin = "http://%s/" % d.info['CustomOrigin']['DNSName']
                else:
                    origin = "<unknown>"
                pretty_output("Origin", origin)
                pretty_output("DistId", d.uri())
                pretty_output("DomainName", d.info['DomainName'])
                if d.info.has_key("CNAME"):
                    pretty_output("CNAMEs", ", ".join(d.info['CNAME']))
                pretty_output("Status", d.info['Status'])
                pretty_output("Enabled", d.info['Enabled'])
                output("")
        else:
            cfuris = Cmd._parse_args(args)
            for cfuri in cfuris:
                response = cf.GetDistInfo(cfuri)
                d = response['distribution']
                dc = d.info['DistributionConfig']
                if dc.info.has_key("S3Origin"):
                    origin = S3UriS3.httpurl_to_s3uri(dc.info['S3Origin']['DNSName'])
                elif dc.info.has_key("CustomOrigin"):
                    origin = "http://%s/" % dc.info['CustomOrigin']['DNSName']
                else:
                    origin = "<unknown>"
                pretty_output("Origin", origin)
                pretty_output("DistId", d.uri())
                pretty_output("DomainName", d.info['DomainName'])
                if dc.info.has_key("CNAME"):
                    pretty_output("CNAMEs", ", ".join(dc.info['CNAME']))
                pretty_output("Status", d.info['Status'])
                pretty_output("Comment", dc.info['Comment'])
                pretty_output("Enabled", dc.info['Enabled'])
                pretty_output("DfltRootObject", dc.info['DefaultRootObject'])
                pretty_output("Logging", dc.info['Logging'] or "Disabled")
                pretty_output("Etag", response['headers']['etag'])

    @staticmethod
    def create(args):
        cf = CloudFront(Config())
        buckets = []
        for arg in args:
            uri = S3Uri(arg)
            if uri.type != "s3":
                raise ParameterError("Bucket can only be created from a s3:// URI instead of: %s" % arg)
            if uri.object():
                raise ParameterError("Use s3:// URI with a bucket name only instead of: %s" % arg)
            if not uri.is_dns_compatible():
                raise ParameterError("CloudFront can only handle lowercase-named buckets.")
            buckets.append(uri)
        if not buckets:
            raise ParameterError("No valid bucket names found")
        for uri in buckets:
            info("Creating distribution from: %s" % uri)
            response = cf.CreateDistribution(uri, cnames_add = Cmd.options.cf_cnames_add,
                                             comment = Cmd.options.cf_comment,
                                             logging = Cmd.options.cf_logging,
                                             default_root_object = Cmd.options.cf_default_root_object)
            d = response['distribution']
            dc = d.info['DistributionConfig']
            output("Distribution created:")
            pretty_output("Origin", S3UriS3.httpurl_to_s3uri(dc.info['S3Origin']['DNSName']))
            pretty_output("DistId", d.uri())
            pretty_output("DomainName", d.info['DomainName'])
            pretty_output("CNAMEs", ", ".join(dc.info['CNAME']))
            pretty_output("Comment", dc.info['Comment'])
            pretty_output("Status", d.info['Status'])
            pretty_output("Enabled", dc.info['Enabled'])
            pretty_output("DefaultRootObject", dc.info['DefaultRootObject'])
            pretty_output("Etag", response['headers']['etag'])

    @staticmethod
    def delete(args):
        cf = CloudFront(Config())
        cfuris = Cmd._parse_args(args)
        for cfuri in cfuris:
            response = cf.DeleteDistribution(cfuri)
            if response['status'] >= 400:
                error("Distribution %s could not be deleted: %s" % (cfuri, response['reason']))
            output("Distribution %s deleted" % cfuri)

    @staticmethod
    def modify(args):
        cf = CloudFront(Config())
        if len(args) > 1:
            raise ParameterError("Too many parameters. Modify one Distribution at a time.")
        try:
            cfuri = Cmd._parse_args(args)[0]
        except IndexError, e:
            raise ParameterError("No valid Distribution URI found.")
        response = cf.ModifyDistribution(cfuri,
                                         cnames_add = Cmd.options.cf_cnames_add,
                                         cnames_remove = Cmd.options.cf_cnames_remove,
                                         comment = Cmd.options.cf_comment,
                                         enabled = Cmd.options.cf_enable,
                                         logging = Cmd.options.cf_logging,
                                         default_root_object = Cmd.options.cf_default_root_object)
        if response['status'] >= 400:
            error("Distribution %s could not be modified: %s" % (cfuri, response['reason']))
        output("Distribution modified: %s" % cfuri)
        response = cf.GetDistInfo(cfuri)
        d = response['distribution']
        dc = d.info['DistributionConfig']
        pretty_output("Origin", S3UriS3.httpurl_to_s3uri(dc.info['S3Origin']['DNSName']))
        pretty_output("DistId", d.uri())
        pretty_output("DomainName", d.info['DomainName'])
        pretty_output("Status", d.info['Status'])
        pretty_output("CNAMEs", ", ".join(dc.info['CNAME']))
        pretty_output("Comment", dc.info['Comment'])
        pretty_output("Enabled", dc.info['Enabled'])
        pretty_output("DefaultRootObject", dc.info['DefaultRootObject'])
        pretty_output("Etag", response['headers']['etag'])

    @staticmethod
    def invalinfo(args):
        cf = CloudFront(Config())
        cfuris = Cmd._parse_args(args)
        requests = []
        for cfuri in cfuris:
            if cfuri.request_id():
                requests.append(str(cfuri))
            else:
                inval_list = cf.GetInvalList(cfuri)
                try:
                    for i in inval_list['inval_list'].info['InvalidationSummary']:
                        requests.append("/".join(["cf:/", cfuri.dist_id(), i["Id"]]))
                except:
                    continue
        for req in requests:
            cfuri = S3Uri(req)
            inval_info = cf.GetInvalInfo(cfuri)
            st = inval_info['inval_status'].info
            pretty_output("URI", str(cfuri))
            pretty_output("Status", st['Status'])
            pretty_output("Created", st['CreateTime'])
            pretty_output("Nr of paths", len(st['InvalidationBatch']['Path']))
            pretty_output("Reference", st['InvalidationBatch']['CallerReference'])
            output("")

# vim:et:ts=4:sts=4:ai
