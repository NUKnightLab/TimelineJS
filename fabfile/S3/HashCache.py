import cPickle as pickle

class HashCache(object):
    def __init__(self):
        self.inodes = dict()

    def add(self, dev, inode, mtime, size, md5):
        if dev not in self.inodes:
            self.inodes[dev] = dict()
        if inode not in self.inodes[dev]:
            self.inodes[dev][inode] = dict()
        self.inodes[dev][inode][mtime] = dict(md5=md5, size=size)

    def md5(self, dev, inode, mtime, size):
        try:
            d = self.inodes[dev][inode][mtime]
            if d['size'] != size:
                return None
        except:
            return None
        return d['md5']

    def mark_all_for_purge(self):
        for d in self.inodes.keys():
            for i in self.inodes[d].keys():
                for c in self.inodes[d][i].keys():
                    self.inodes[d][i][c]['purge'] = True

    def unmark_for_purge(self, dev, inode, mtime, size):
        d = self.inodes[dev][inode][mtime]
        if d['size'] == size and 'purge' in d:
            del self.inodes[dev][inode][mtime]['purge']

    def purge(self):
        for d in self.inodes.keys():
            for i in self.inodes[d].keys():
                for m in self.inodes[d][i].keys():
                    if 'purge' in self.inodes[d][i][m]:
                        del self.inodes[d][i]
                        break

    def save(self, f):
        d = dict(inodes=self.inodes, version=1)
        f = open(f, 'w')
        p = pickle.dump(d, f)
        f.close()

    def load(self, f):
        f = open(f, 'r')
        d = pickle.load(f)
        f.close()
        if d.get('version') == 1 and 'inodes' in d:
            self.inodes = d['inodes']
