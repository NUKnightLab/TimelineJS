## Amazon S3 manager
## Author: Michal Ludvig <michal@logix.cz>
##         http://www.logix.cz/michal
## License: GPL Version 2

from BidirMap import BidirMap
import Utils

class SortedDictIterator(object):
    def __init__(self, sorted_dict, keys):
        self.sorted_dict = sorted_dict
        self.keys = keys

    def next(self):
        try:
            return self.keys.pop(0)
        except IndexError:
            raise StopIteration

class SortedDict(dict):
    def __init__(self, mapping = {}, ignore_case = True, **kwargs):
        """
        WARNING: SortedDict() with ignore_case==True will
                 drop entries differing only in capitalisation!
                 Eg: SortedDict({'auckland':1, 'Auckland':2}).keys() => ['Auckland']
                 With ignore_case==False it's all right
        """
        dict.__init__(self, mapping, **kwargs)
        self.ignore_case = ignore_case

    def keys(self):
        keys = dict.keys(self)
        if self.ignore_case:
            # Translation map
            xlat_map = BidirMap()
            for key in keys:
                xlat_map[key.lower()] = key
            # Lowercase keys
            lc_keys = xlat_map.keys()
            lc_keys.sort()
            return [xlat_map[k] for k in lc_keys]
        else:
            keys.sort()
            return keys

    def __iter__(self):
        return SortedDictIterator(self, self.keys())



if __name__ == "__main__":
    d = { 'AWS' : 1, 'Action' : 2, 'america' : 3, 'Auckland' : 4, 'America' : 5 }
    sd = SortedDict(d)
    print "Wanted: Action, america, Auckland, AWS,    [ignore case]"
    print "Got:   ",
    for key in sd:
        print "%s," % key,
    print "   [used: __iter__()]"
    d = SortedDict(d, ignore_case = False)
    print "Wanted: AWS, Action, Auckland, america,    [case sensitive]"
    print "Got:   ",
    for key in d.keys():
        print "%s," % key,
    print "   [used: keys()]"

# vim:et:ts=4:sts=4:ai
