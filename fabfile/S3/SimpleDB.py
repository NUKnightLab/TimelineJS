## Amazon SimpleDB library
## Author: Michal Ludvig <michal@logix.cz>
##         http://www.logix.cz/michal
## License: GPL Version 2

"""
Low-level class for working with Amazon SimpleDB
"""

import time
import urllib
import base64
import hmac
import sha
import httplib
from logging import debug, info, warning, error

from Utils import convertTupleListToDict
from SortedDict import SortedDict
from Exceptions import *

class SimpleDB(object):
    # API Version
    # See http://docs.amazonwebservices.com/AmazonSimpleDB/2007-11-07/DeveloperGuide/
    Version = "2007-11-07"
    SignatureVersion = 1

    def __init__(self, config):
        self.config = config

    ## ------------------------------------------------
    ## Methods implementing SimpleDB API
    ## ------------------------------------------------

    def ListDomains(self, MaxNumberOfDomains = 100):
        '''
        Lists all domains associated with our Access Key. Returns
        domain names up to the limit set by MaxNumberOfDomains.
        '''
        parameters = SortedDict()
        parameters['MaxNumberOfDomains'] = MaxNumberOfDomains
        return self.send_request("ListDomains", DomainName = None, parameters = parameters)

    def CreateDomain(self, DomainName):
        return self.send_request("CreateDomain", DomainName = DomainName)

    def DeleteDomain(self, DomainName):
        return self.send_request("DeleteDomain", DomainName = DomainName)

    def PutAttributes(self, DomainName, ItemName, Attributes):
        parameters = SortedDict()
        parameters['ItemName'] = ItemName
        seq = 0
        for attrib in Attributes:
            if type(Attributes[attrib]) == type(list()):
                for value in Attributes[attrib]:
                    parameters['Attribute.%d.Name' % seq] = attrib
                    parameters['Attribute.%d.Value' % seq] = unicode(value)
                    seq += 1
            else:
                parameters['Attribute.%d.Name' % seq] = attrib
                parameters['Attribute.%d.Value' % seq] = unicode(Attributes[attrib])
                seq += 1
        ## TODO:
        ## - support for Attribute.N.Replace
        ## - support for multiple values for one attribute
        return self.send_request("PutAttributes", DomainName = DomainName, parameters = parameters)

    def GetAttributes(self, DomainName, ItemName, Attributes = []):
        parameters = SortedDict()
        parameters['ItemName'] = ItemName
        seq = 0
        for attrib in Attributes:
            parameters['AttributeName.%d' % seq] = attrib
            seq += 1
        return self.send_request("GetAttributes", DomainName = DomainName, parameters = parameters)

    def DeleteAttributes(self, DomainName, ItemName, Attributes = {}):
        """
        Remove specified Attributes from ItemName.
        Attributes parameter can be either:
        - not specified, in which case the whole Item is removed
        - list, e.g. ['Attr1', 'Attr2'] in which case these parameters are removed
        - dict, e.g. {'Attr' : 'One', 'Attr' : 'Two'} in which case the
          specified values are removed from multi-value attributes.
        """
        parameters = SortedDict()
        parameters['ItemName'] = ItemName
        seq = 0
        for attrib in Attributes:
            parameters['Attribute.%d.Name' % seq] = attrib
            if type(Attributes) == type(dict()):
                parameters['Attribute.%d.Value' % seq] = unicode(Attributes[attrib])
            seq += 1
        return self.send_request("DeleteAttributes", DomainName = DomainName, parameters = parameters)

    def Query(self, DomainName, QueryExpression = None, MaxNumberOfItems = None, NextToken = None):
        parameters = SortedDict()
        if QueryExpression:
            parameters['QueryExpression'] = QueryExpression
        if MaxNumberOfItems:
            parameters['MaxNumberOfItems'] = MaxNumberOfItems
        if NextToken:
            parameters['NextToken'] = NextToken
        return self.send_request("Query", DomainName = DomainName, parameters = parameters)
        ## Handle NextToken? Or maybe not - let the upper level do it

    ## ------------------------------------------------
    ## Low-level methods for handling SimpleDB requests
    ## ------------------------------------------------

    def send_request(self, *args, **kwargs):
        request = self.create_request(*args, **kwargs)
        #debug("Request: %s" % repr(request))
        conn = self.get_connection()
        conn.request("GET", self.format_uri(request['uri_params']))
        http_response = conn.getresponse()
        response = {}
        response["status"] = http_response.status
        response["reason"] = http_response.reason
        response["headers"] = convertTupleListToDict(http_response.getheaders())
        response["data"] =  http_response.read()
        conn.close()

        if response["status"] < 200 or response["status"] > 299:
            debug("Response: " + str(response))
            raise S3Error(response)

        return response

    def create_request(self, Action, DomainName, parameters = None):
        if not parameters:
            parameters = SortedDict()
        if len(self.config.access_token) > 0:
            self.config.refresh_role()
            parameters['Signature']=self.config.access_token
        parameters['AWSAccessKeyId'] = self.config.access_key
        parameters['Version'] = self.Version
        parameters['SignatureVersion'] = self.SignatureVersion
        parameters['Action'] = Action
        parameters['Timestamp'] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        if DomainName:
            parameters['DomainName'] = DomainName
        parameters['Signature'] = self.sign_request(parameters)
        parameters.keys_return_lowercase = False
        uri_params = urllib.urlencode(parameters)
        request = {}
        request['uri_params'] = uri_params
        request['parameters'] = parameters
        return request

    def sign_request(self, parameters):
        h = ""
        parameters.keys_sort_lowercase = True
        parameters.keys_return_lowercase = False
        for key in parameters:
            h += "%s%s" % (key, parameters[key])
        #debug("SignRequest: %s" % h)
        return base64.encodestring(hmac.new(self.config.secret_key, h, sha).digest()).strip()

    def get_connection(self):
        if self.config.proxy_host != "":
            return httplib.HTTPConnection(self.config.proxy_host, self.config.proxy_port)
        else:
            if self.config.use_https:
                return httplib.HTTPSConnection(self.config.simpledb_host)
            else:
                return httplib.HTTPConnection(self.config.simpledb_host)

    def format_uri(self, uri_params):
        if self.config.proxy_host != "":
            uri = "http://%s/?%s" % (self.config.simpledb_host, uri_params)
        else:
            uri = "/?%s" % uri_params
        #debug('format_uri(): ' + uri)
        return uri

# vim:et:ts=4:sts=4:ai
