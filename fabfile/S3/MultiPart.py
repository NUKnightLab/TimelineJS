## Amazon S3 Multipart upload support
## Author: Jerome Leclanche <jerome.leclanche@gmail.com>
## License: GPL Version 2

import os
from stat import ST_SIZE
from logging import debug, info, warning, error
from Utils import getTextFromXml, formatSize, unicodise
from Exceptions import S3UploadError

class MultiPartUpload(object):

    MIN_CHUNK_SIZE_MB = 5       # 5MB
    MAX_CHUNK_SIZE_MB = 5120    # 5GB
    MAX_FILE_SIZE = 42949672960 # 5TB

    def __init__(self, s3, file, uri, headers_baseline = {}):
        self.s3 = s3
        self.file = file
        self.uri = uri
        self.parts = {}
        self.headers_baseline = headers_baseline
        self.upload_id = self.initiate_multipart_upload()

    def initiate_multipart_upload(self):
        """
        Begin a multipart upload
        http://docs.amazonwebservices.com/AmazonS3/latest/API/index.html?mpUploadInitiate.html
        """
        request = self.s3.create_request("OBJECT_POST", uri = self.uri, headers = self.headers_baseline, extra = "?uploads")
        response = self.s3.send_request(request)
        data = response["data"]
        self.upload_id = getTextFromXml(data, "UploadId")
        return self.upload_id

    def upload_all_parts(self):
        """
        Execute a full multipart upload on a file
        Returns the seq/etag dict
        TODO use num_processes to thread it
        """
        if not self.upload_id:
            raise RuntimeError("Attempting to use a multipart upload that has not been initiated.")

        self.chunk_size = self.s3.config.multipart_chunk_size_mb * 1024 * 1024

        if self.file.name != "<stdin>":
                size_left = file_size = os.stat(self.file.name)[ST_SIZE]
                nr_parts = file_size / self.chunk_size + (file_size % self.chunk_size and 1)
                debug("MultiPart: Uploading %s in %d parts" % (self.file.name, nr_parts))
        else:
            debug("MultiPart: Uploading from %s" % (self.file.name))

        seq = 1
        if self.file.name != "<stdin>":
            while size_left > 0:
                offset = self.chunk_size * (seq - 1)
                current_chunk_size = min(file_size - offset, self.chunk_size)
                size_left -= current_chunk_size
                labels = {
                    'source' : unicodise(self.file.name),
                    'destination' : unicodise(self.uri.uri()),
                    'extra' : "[part %d of %d, %s]" % (seq, nr_parts, "%d%sB" % formatSize(current_chunk_size, human_readable = True))
                }
                try:
                    self.upload_part(seq, offset, current_chunk_size, labels)
                except:
                    error(u"Upload of '%s' part %d failed. Aborting multipart upload." % (self.file.name, seq))
                    self.abort_upload()
                    raise
                seq += 1
        else:
            while True:
                buffer = self.file.read(self.chunk_size)
                offset = self.chunk_size * (seq - 1)
                current_chunk_size = len(buffer)
                labels = {
                    'source' : unicodise(self.file.name),
                    'destination' : unicodise(self.uri.uri()),
                    'extra' : "[part %d, %s]" % (seq, "%d%sB" % formatSize(current_chunk_size, human_readable = True))
                }
                if len(buffer) == 0: # EOF
                    break
                try:
                    self.upload_part(seq, offset, current_chunk_size, labels, buffer)
                except:
                    error(u"Upload of '%s' part %d failed. Aborting multipart upload." % (self.file.name, seq))
                    self.abort_upload()
                    raise
                seq += 1

        debug("MultiPart: Upload finished: %d parts", seq - 1)

    def upload_part(self, seq, offset, chunk_size, labels, buffer = ''):
        """
        Upload a file chunk
        http://docs.amazonwebservices.com/AmazonS3/latest/API/index.html?mpUploadUploadPart.html
        """
        # TODO implement Content-MD5
        debug("Uploading part %i of %r (%s bytes)" % (seq, self.upload_id, chunk_size))
        headers = { "content-length": chunk_size }
        query_string = "?partNumber=%i&uploadId=%s" % (seq, self.upload_id)
        request = self.s3.create_request("OBJECT_PUT", uri = self.uri, headers = headers, extra = query_string)
        response = self.s3.send_file(request, self.file, labels, buffer, offset = offset, chunk_size = chunk_size)
        self.parts[seq] = response["headers"]["etag"]
        return response

    def complete_multipart_upload(self):
        """
        Finish a multipart upload
        http://docs.amazonwebservices.com/AmazonS3/latest/API/index.html?mpUploadComplete.html
        """
        debug("MultiPart: Completing upload: %s" % self.upload_id)

        parts_xml = []
        part_xml = "<Part><PartNumber>%i</PartNumber><ETag>%s</ETag></Part>"
        for seq, etag in self.parts.items():
            parts_xml.append(part_xml % (seq, etag))
        body = "<CompleteMultipartUpload>%s</CompleteMultipartUpload>" % ("".join(parts_xml))

        headers = { "content-length": len(body) }
        request = self.s3.create_request("OBJECT_POST", uri = self.uri, headers = headers, extra = "?uploadId=%s" % (self.upload_id))
        response = self.s3.send_request(request, body = body)

        return response

    def abort_upload(self):
        """
        Abort multipart upload
        http://docs.amazonwebservices.com/AmazonS3/latest/API/index.html?mpUploadAbort.html
        """
        debug("MultiPart: Aborting upload: %s" % self.upload_id)
        request = self.s3.create_request("OBJECT_DELETE", uri = self.uri, extra = "?uploadId=%s" % (self.upload_id))
        response = self.s3.send_request(request)
        return response

# vim:et:ts=4:sts=4:ai
