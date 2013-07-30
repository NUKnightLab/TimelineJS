## Amazon S3 manager
## Author: Michal Ludvig <michal@logix.cz>
##         http://www.logix.cz/michal
## License: GPL Version 2

import os
import re
import sys
from BidirMap import BidirMap
from logging import debug
import S3
from Utils import unicodise, check_bucket_name_dns_conformity
import Config

class S3Uri(object):
    type = None
    _subclasses = None

    def __new__(self, string):
        if not self._subclasses:
            ## Generate a list of all subclasses of S3Uri
            self._subclasses = []
            dict = sys.modules[__name__].__dict__
            for something in dict:
                if type(dict[something]) is not type(self):
                    continue
                if issubclass(dict[something], self) and dict[something] != self:
                    self._subclasses.append(dict[something])
        for subclass in self._subclasses:
            try:
                instance = object.__new__(subclass)
                instance.__init__(string)
                return instance
            except ValueError, e:
                continue
        raise ValueError("%s: not a recognized URI" % string)

    def __str__(self):
        return self.uri()

    def __unicode__(self):
        return self.uri()

    def __repr__(self):
        return "<%s: %s>" % (self.__class__.__name__, self.__unicode__())

    def public_url(self):
        raise ValueError("This S3 URI does not have Anonymous URL representation")

    def basename(self):
        return self.__unicode__().split("/")[-1]

class S3UriS3(S3Uri):
    type = "s3"
    _re = re.compile("^s3://([^/]+)/?(.*)", re.IGNORECASE)
    def __init__(self, string):
        match = self._re.match(string)
        if not match:
            raise ValueError("%s: not a S3 URI" % string)
        groups = match.groups()
        self._bucket = groups[0]
        self._object = unicodise(groups[1])

    def bucket(self):
        return self._bucket

    def object(self):
        return self._object

    def has_bucket(self):
        return bool(self._bucket)

    def has_object(self):
        return bool(self._object)

    def uri(self):
        return "/".join(["s3:/", self._bucket, self._object])

    def is_dns_compatible(self):
        return check_bucket_name_dns_conformity(self._bucket)

    def public_url(self):
        if self.is_dns_compatible():
            return "http://%s.%s/%s" % (self._bucket, Config.Config().host_base, self._object)
        else:
            return "http://%s/%s/%s" % (self._bucket, Config.Config().host_base, self._object)

    def host_name(self):
        if self.is_dns_compatible():
            return "%s.s3.amazonaws.com" % (self._bucket)
        else:
            return "s3.amazonaws.com"

    @staticmethod
    def compose_uri(bucket, object = ""):
        return "s3://%s/%s" % (bucket, object)

    @staticmethod
    def httpurl_to_s3uri(http_url):
        m=re.match("(https?://)?([^/]+)/?(.*)", http_url, re.IGNORECASE)
        hostname, object = m.groups()[1:]
        hostname = hostname.lower()
        if hostname == "s3.amazonaws.com":
            ## old-style url: http://s3.amazonaws.com/bucket/object
            if object.count("/") == 0:
                ## no object given
                bucket = object
                object = ""
            else:
                ## bucket/object
                bucket, object = object.split("/", 1)
        elif hostname.endswith(".s3.amazonaws.com"):
            ## new-style url: http://bucket.s3.amazonaws.com/object
            bucket = hostname[:-(len(".s3.amazonaws.com"))]
        else:
            raise ValueError("Unable to parse URL: %s" % http_url)
        return S3Uri("s3://%(bucket)s/%(object)s" % {
            'bucket' : bucket,
            'object' : object })

class S3UriS3FS(S3Uri):
    type = "s3fs"
    _re = re.compile("^s3fs://([^/]*)/?(.*)", re.IGNORECASE)
    def __init__(self, string):
        match = self._re.match(string)
        if not match:
            raise ValueError("%s: not a S3fs URI" % string)
        groups = match.groups()
        self._fsname = groups[0]
        self._path = unicodise(groups[1]).split("/")

    def fsname(self):
        return self._fsname

    def path(self):
        return "/".join(self._path)

    def uri(self):
        return "/".join(["s3fs:/", self._fsname, self.path()])

class S3UriFile(S3Uri):
    type = "file"
    _re = re.compile("^(\w+://)?(.*)")
    def __init__(self, string):
        match = self._re.match(string)
        groups = match.groups()
        if groups[0] not in (None, "file://"):
            raise ValueError("%s: not a file:// URI" % string)
        self._path = unicodise(groups[1]).split("/")

    def path(self):
        return "/".join(self._path)

    def uri(self):
        return "/".join(["file:/", self.path()])

    def isdir(self):
        return os.path.isdir(self.path())

    def dirname(self):
        return os.path.dirname(self.path())

class S3UriCloudFront(S3Uri):
    type = "cf"
    _re = re.compile("^cf://([^/]*)/*(.*)", re.IGNORECASE)
    def __init__(self, string):
        match = self._re.match(string)
        if not match:
            raise ValueError("%s: not a CloudFront URI" % string)
        groups = match.groups()
        self._dist_id = groups[0]
        self._request_id = groups[1] != "/" and groups[1] or None

    def dist_id(self):
        return self._dist_id

    def request_id(self):
        return self._request_id

    def uri(self):
        uri = "cf://" + self.dist_id()
        if self.request_id():
            uri += "/" + self.request_id()
        return uri

if __name__ == "__main__":
    uri = S3Uri("s3://bucket/object")
    print "type()  =", type(uri)
    print "uri     =", uri
    print "uri.type=", uri.type
    print "bucket  =", uri.bucket()
    print "object  =", uri.object()
    print

    uri = S3Uri("s3://bucket")
    print "type()  =", type(uri)
    print "uri     =", uri
    print "uri.type=", uri.type
    print "bucket  =", uri.bucket()
    print

    uri = S3Uri("s3fs://filesystem1/path/to/remote/file.txt")
    print "type()  =", type(uri)
    print "uri     =", uri
    print "uri.type=", uri.type
    print "path    =", uri.path()
    print

    uri = S3Uri("/path/to/local/file.txt")
    print "type()  =", type(uri)
    print "uri     =", uri
    print "uri.type=", uri.type
    print "path    =", uri.path()
    print

    uri = S3Uri("cf://1234567890ABCD/")
    print "type()  =", type(uri)
    print "uri     =", uri
    print "uri.type=", uri.type
    print "dist_id =", uri.dist_id()
    print

# vim:et:ts=4:sts=4:ai
