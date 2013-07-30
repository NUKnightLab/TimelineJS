## Amazon S3 manager
## Author: Michal Ludvig <michal@logix.cz>
##         http://www.logix.cz/michal
## License: GPL Version 2

from SortedDict import SortedDict
import Utils

class FileDict(SortedDict):
    def __init__(self, mapping = {}, ignore_case = True, **kwargs):
        SortedDict.__init__(self, mapping = mapping, ignore_case = ignore_case, **kwargs)
        self.hardlinks = dict() # { dev: { inode : {'md5':, 'relative_files':}}}
        self.by_md5 = dict() # {md5: set(relative_files)}

    def record_md5(self, relative_file, md5):
        if md5 not in self.by_md5:
            self.by_md5[md5] = set()
        self.by_md5[md5].add(relative_file)

    def find_md5_one(self, md5):
        try:
            return list(self.by_md5.get(md5, set()))[0]
        except:
            return None

    def get_md5(self, relative_file):
        """returns md5 if it can, or raises IOError if file is unreadable"""
        md5 = None
        if 'md5' in self[relative_file]:
            return self[relative_file]['md5']
        md5 = self.get_hardlink_md5(relative_file)
        if md5 is None:
            md5 = Utils.hash_file_md5(self[relative_file]['full_name'])
        self.record_md5(relative_file, md5)
        self[relative_file]['md5'] = md5
        return md5

    def record_hardlink(self, relative_file, dev, inode, md5):
        if dev not in self.hardlinks:
            self.hardlinks[dev] = dict()
        if inode not in self.hardlinks[dev]:
            self.hardlinks[dev][inode] = dict(md5=md5, relative_files=set())
        self.hardlinks[dev][inode]['relative_files'].add(relative_file)

    def get_hardlink_md5(self, relative_file):
        md5 = None
        dev = self[relative_file]['dev']
        inode = self[relative_file]['inode']
        try:
            md5 = self.hardlinks[dev][inode]['md5']
        except:
            pass
        return md5
