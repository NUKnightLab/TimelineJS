## Create and compare lists of files/objects
## Author: Michal Ludvig <michal@logix.cz>
##         http://www.logix.cz/michal
## License: GPL Version 2

from S3 import S3
from Config import Config
from S3Uri import S3Uri
from FileDict import FileDict
from Utils import *
from Exceptions import ParameterError
from HashCache import HashCache

from logging import debug, info, warning, error

import os
import glob
import copy

__all__ = ["fetch_local_list", "fetch_remote_list", "compare_filelists", "filter_exclude_include", "parse_attrs_header"]

def _fswalk_follow_symlinks(path):
    '''
    Walk filesystem, following symbolic links (but without recursion), on python2.4 and later

    If a symlink directory loop is detected, emit a warning and skip.
    E.g.: dir1/dir2/sym-dir -> ../dir2
    '''
    assert os.path.isdir(path) # only designed for directory argument
    walkdirs = set([path])
    for dirpath, dirnames, filenames in os.walk(path):
        handle_exclude_include_walk(dirpath, dirnames, [])
        real_dirpath = os.path.realpath(dirpath)
        for dirname in dirnames:
            current = os.path.join(dirpath, dirname)
            real_current = os.path.realpath(current)
            if os.path.islink(current):
                if (real_dirpath == real_current or
                    real_dirpath.startswith(real_current + os.path.sep)):
                    warning("Skipping recursively symlinked directory %s" % dirname)
                else:
                    walkdirs.add(current)
    for walkdir in walkdirs:
        for dirpath, dirnames, filenames in os.walk(walkdir):
            handle_exclude_include_walk(dirpath, dirnames, [])
            yield (dirpath, dirnames, filenames)

def _fswalk_no_symlinks(path):
    '''
    Directory tree generator

    path (str) is the root of the directory tree to walk
    '''
    for dirpath, dirnames, filenames in os.walk(path):
        handle_exclude_include_walk(dirpath, dirnames, filenames)
        yield (dirpath, dirnames, filenames)

def filter_exclude_include(src_list):
    info(u"Applying --exclude/--include")
    cfg = Config()
    exclude_list = FileDict(ignore_case = False)
    for file in src_list.keys():
        debug(u"CHECK: %s" % file)
        excluded = False
        for r in cfg.exclude:
            if r.search(file):
                excluded = True
                debug(u"EXCL-MATCH: '%s'" % (cfg.debug_exclude[r]))
                break
        if excluded:
            ## No need to check for --include if not excluded
            for r in cfg.include:
                if r.search(file):
                    excluded = False
                    debug(u"INCL-MATCH: '%s'" % (cfg.debug_include[r]))
                    break
        if excluded:
            ## Still excluded - ok, action it
            debug(u"EXCLUDE: %s" % file)
            exclude_list[file] = src_list[file]
            del(src_list[file])
            continue
        else:
            debug(u"PASS: %r" % (file))
    return src_list, exclude_list

def handle_exclude_include_walk(root, dirs, files):
    cfg = Config()
    copydirs = copy.copy(dirs)
    copyfiles = copy.copy(files)

    # exclude dir matches in the current directory
    # this prevents us from recursing down trees we know we want to ignore
    for x in copydirs:
        d = os.path.join(root, x, '')
        debug(u"CHECK: %r" % d)
        excluded = False
        for r in cfg.exclude:
            if r.search(d):
                excluded = True
                debug(u"EXCL-MATCH: '%s'" % (cfg.debug_exclude[r]))
                break
        if excluded:
            ## No need to check for --include if not excluded
            for r in cfg.include:
                if r.search(d):
                    excluded = False
                    debug(u"INCL-MATCH: '%s'" % (cfg.debug_include[r]))
                    break
        if excluded:
            ## Still excluded - ok, action it
            debug(u"EXCLUDE: %r" % d)
            dirs.remove(x)
            continue
        else:
            debug(u"PASS: %r" % (d))

    # exclude file matches in the current directory
    for x in copyfiles:
        file = os.path.join(root, x)
        debug(u"CHECK: %r" % file)
        excluded = False
        for r in cfg.exclude:
            if r.search(file):
                excluded = True
                debug(u"EXCL-MATCH: '%s'" % (cfg.debug_exclude[r]))
                break
        if excluded:
            ## No need to check for --include if not excluded
            for r in cfg.include:
                if r.search(file):
                    excluded = False
                    debug(u"INCL-MATCH: '%s'" % (cfg.debug_include[r]))
                    break
        if excluded:
            ## Still excluded - ok, action it
            debug(u"EXCLUDE: %s" % file)
            files.remove(x)
            continue
        else:
            debug(u"PASS: %r" % (file))

def fetch_local_list(args, recursive = None):
    def _get_filelist_local(loc_list, local_uri, cache):
        info(u"Compiling list of local files...")

        if deunicodise(local_uri.basename()) == "-":
            loc_list["-"] = {
                'full_name_unicode' : '-',
                'full_name' : '-',
                'size' : -1,
                'mtime' : -1,
            }
            return loc_list, True
        if local_uri.isdir():
            local_base = deunicodise(local_uri.basename())
            local_path = deunicodise(local_uri.path())
            if cfg.follow_symlinks:
                filelist = _fswalk_follow_symlinks(local_path)
            else:
                filelist = _fswalk_no_symlinks(local_path)
            single_file = False
        else:
            local_base = ""
            local_path = deunicodise(local_uri.dirname())
            filelist = [( local_path, [], [deunicodise(local_uri.basename())] )]
            single_file = True
        for root, dirs, files in filelist:
            rel_root = root.replace(local_path, local_base, 1)
            for f in files:
                full_name = os.path.join(root, f)
                if not os.path.isfile(full_name):
                    continue
                if os.path.islink(full_name):
                                    if not cfg.follow_symlinks:
                                            continue
                relative_file = unicodise(os.path.join(rel_root, f))
                if os.path.sep != "/":
                    # Convert non-unix dir separators to '/'
                    relative_file = "/".join(relative_file.split(os.path.sep))
                if cfg.urlencoding_mode == "normal":
                    relative_file = replace_nonprintables(relative_file)
                if relative_file.startswith('./'):
                    relative_file = relative_file[2:]
                sr = os.stat_result(os.lstat(full_name))
                loc_list[relative_file] = {
                    'full_name_unicode' : unicodise(full_name),
                    'full_name' : full_name,
                    'size' : sr.st_size,
                    'mtime' : sr.st_mtime,
                    'dev'   : sr.st_dev,
                    'inode' : sr.st_ino,
                    'uid' : sr.st_uid,
                    'gid' : sr.st_gid,
                    'sr': sr # save it all, may need it in preserve_attrs_list
                    ## TODO: Possibly more to save here...
                }
                if 'md5' in cfg.sync_checks:
                    md5 = cache.md5(sr.st_dev, sr.st_ino, sr.st_mtime, sr.st_size)
                    if md5 is None:
                            try:
                                md5 = loc_list.get_md5(relative_file) # this does the file I/O
                            except IOError:
                                continue
                            cache.add(sr.st_dev, sr.st_ino, sr.st_mtime, sr.st_size, md5)
                    loc_list.record_hardlink(relative_file, sr.st_dev, sr.st_ino, md5)
        return loc_list, single_file

    def _maintain_cache(cache, local_list):
        if cfg.cache_file:
            cache.mark_all_for_purge()
            for i in local_list.keys():
                cache.unmark_for_purge(local_list[i]['dev'], local_list[i]['inode'], local_list[i]['mtime'], local_list[i]['size'])
            cache.purge()
            cache.save(cfg.cache_file)

    cfg = Config()

    cache = HashCache()
    if cfg.cache_file:
        try:
            cache.load(cfg.cache_file)
        except IOError:
            info(u"No cache file found, creating it.")

    local_uris = []
    local_list = FileDict(ignore_case = False)
    single_file = False

    if type(args) not in (list, tuple):
        args = [args]

    if recursive == None:
        recursive = cfg.recursive

    for arg in args:
        uri = S3Uri(arg)
        if not uri.type == 'file':
            raise ParameterError("Expecting filename or directory instead of: %s" % arg)
        if uri.isdir() and not recursive:
            raise ParameterError("Use --recursive to upload a directory: %s" % arg)
        local_uris.append(uri)

    for uri in local_uris:
        list_for_uri, single_file = _get_filelist_local(local_list, uri, cache)

    ## Single file is True if and only if the user
    ## specified one local URI and that URI represents
    ## a FILE. Ie it is False if the URI was of a DIR
    ## and that dir contained only one FILE. That's not
    ## a case of single_file==True.
    if len(local_list) > 1:
        single_file = False

    _maintain_cache(cache, local_list)

    return local_list, single_file

def fetch_remote_list(args, require_attribs = False, recursive = None):
    def _get_filelist_remote(remote_uri, recursive = True):
        ## If remote_uri ends with '/' then all remote files will have
        ## the remote_uri prefix removed in the relative path.
        ## If, on the other hand, the remote_uri ends with something else
        ## (probably alphanumeric symbol) we'll use the last path part
        ## in the relative path.
        ##
        ## Complicated, eh? See an example:
        ## _get_filelist_remote("s3://bckt/abc/def") may yield:
        ## { 'def/file1.jpg' : {}, 'def/xyz/blah.txt' : {} }
        ## _get_filelist_remote("s3://bckt/abc/def/") will yield:
        ## { 'file1.jpg' : {}, 'xyz/blah.txt' : {} }
        ## Furthermore a prefix-magic can restrict the return list:
        ## _get_filelist_remote("s3://bckt/abc/def/x") yields:
        ## { 'xyz/blah.txt' : {} }

        info(u"Retrieving list of remote files for %s ..." % remote_uri)

        s3 = S3(Config())
        response = s3.bucket_list(remote_uri.bucket(), prefix = remote_uri.object(), recursive = recursive)

        rem_base_original = rem_base = remote_uri.object()
        remote_uri_original = remote_uri
        if rem_base != '' and rem_base[-1] != '/':
            rem_base = rem_base[:rem_base.rfind('/')+1]
            remote_uri = S3Uri("s3://%s/%s" % (remote_uri.bucket(), rem_base))
        rem_base_len = len(rem_base)
        rem_list = FileDict(ignore_case = False)
        break_now = False
        for object in response['list']:
            if object['Key'] == rem_base_original and object['Key'][-1] != os.path.sep:
                ## We asked for one file and we got that file :-)
                key = os.path.basename(object['Key'])
                object_uri_str = remote_uri_original.uri()
                break_now = True
                rem_list = FileDict(ignore_case = False)   ## Remove whatever has already been put to rem_list
            else:
                key = object['Key'][rem_base_len:]      ## Beware - this may be '' if object['Key']==rem_base !!
                object_uri_str = remote_uri.uri() + key
            rem_list[key] = {
                'size' : int(object['Size']),
                'timestamp' : dateS3toUnix(object['LastModified']), ## Sadly it's upload time, not our lastmod time :-(
                'md5' : object['ETag'][1:-1],
                'object_key' : object['Key'],
                'object_uri_str' : object_uri_str,
                'base_uri' : remote_uri,
                'dev' : None,
                'inode' : None,
            }
            md5 = object['ETag'][1:-1]
            rem_list.record_md5(key, md5)
            if break_now:
                break
        return rem_list

    cfg = Config()
    remote_uris = []
    remote_list = FileDict(ignore_case = False)

    if type(args) not in (list, tuple):
        args = [args]

    if recursive == None:
        recursive = cfg.recursive

    for arg in args:
        uri = S3Uri(arg)
        if not uri.type == 's3':
            raise ParameterError("Expecting S3 URI instead of '%s'" % arg)
        remote_uris.append(uri)

    if recursive:
        for uri in remote_uris:
            objectlist = _get_filelist_remote(uri)
            for key in objectlist:
                remote_list[key] = objectlist[key]
                remote_list.record_md5(key, objectlist.get_md5(key))
    else:
        for uri in remote_uris:
            uri_str = str(uri)
            ## Wildcards used in remote URI?
            ## If yes we'll need a bucket listing...
            if uri_str.find('*') > -1 or uri_str.find('?') > -1:
                first_wildcard = uri_str.find('*')
                first_questionmark = uri_str.find('?')
                if first_questionmark > -1 and first_questionmark < first_wildcard:
                    first_wildcard = first_questionmark
                prefix = uri_str[:first_wildcard]
                rest = uri_str[first_wildcard+1:]
                ## Only request recursive listing if the 'rest' of the URI,
                ## i.e. the part after first wildcard, contains '/'
                need_recursion = rest.find('/') > -1
                objectlist = _get_filelist_remote(S3Uri(prefix), recursive = need_recursion)
                for key in objectlist:
                    ## Check whether the 'key' matches the requested wildcards
                    if glob.fnmatch.fnmatch(objectlist[key]['object_uri_str'], uri_str):
                        remote_list[key] = objectlist[key]
            else:
                ## No wildcards - simply append the given URI to the list
                key = os.path.basename(uri.object())
                if not key:
                    raise ParameterError(u"Expecting S3 URI with a filename or --recursive: %s" % uri.uri())
                remote_item = {
                    'base_uri': uri,
                    'object_uri_str': unicode(uri),
                    'object_key': uri.object()
                }
                if require_attribs:
                    response = S3(cfg).object_info(uri)
                    remote_item.update({
                    'size': int(response['headers']['content-length']),
                    'md5': response['headers']['etag'].strip('"\''),
                    'timestamp' : dateRFC822toUnix(response['headers']['date'])
                    })
                    # get md5 from header if it's present.  We would have set that during upload
                    if response['headers'].has_key('x-amz-meta-s3cmd-attrs'):
                        attrs = parse_attrs_header(response['headers']['x-amz-meta-s3cmd-attrs'])
                        if attrs.has_key('md5'):
                            remote_item.update({'md5': attrs['md5']})

                remote_list[key] = remote_item
    return remote_list

def parse_attrs_header(attrs_header):
    attrs = {}
    for attr in attrs_header.split("/"):
        key, val = attr.split(":")
        attrs[key] = val
    return attrs


def compare_filelists(src_list, dst_list, src_remote, dst_remote, delay_updates = False):
    def __direction_str(is_remote):
        return is_remote and "remote" or "local"

    def _compare(src_list, dst_lst, src_remote, dst_remote, file):
        """Return True if src_list[file] matches dst_list[file], else False"""
        attribs_match = True
        if not (src_list.has_key(file) and dst_list.has_key(file)):
            info(u"%s: does not exist in one side or the other: src_list=%s, dst_list=%s" % (file, src_list.has_key(file), dst_list.has_key(file)))
            return False

        ## check size first
        if 'size' in cfg.sync_checks and dst_list[file]['size'] != src_list[file]['size']:
            debug(u"xfer: %s (size mismatch: src=%s dst=%s)" % (file, src_list[file]['size'], dst_list[file]['size']))
            attribs_match = False

        ## check md5
        compare_md5 = 'md5' in cfg.sync_checks
        # Multipart-uploaded files don't have a valid md5 sum - it ends with "...-nn"
        if compare_md5:
            if (src_remote == True and src_list[file]['md5'].find("-") >= 0) or (dst_remote == True and dst_list[file]['md5'].find("-") >= 0):
                compare_md5 = False
                info(u"disabled md5 check for %s" % file)
        if attribs_match and compare_md5:
            try:
                src_md5 = src_list.get_md5(file)
                dst_md5 = dst_list.get_md5(file)
            except (IOError,OSError), e:
                # md5 sum verification failed - ignore that file altogether
                debug(u"IGNR: %s (disappeared)" % (file))
                warning(u"%s: file disappeared, ignoring." % (file))
                raise

            if src_md5 != dst_md5:
                ## checksums are different.
                attribs_match = False
                debug(u"XFER: %s (md5 mismatch: src=%s dst=%s)" % (file, src_md5, dst_md5))

        return attribs_match

    # we don't support local->local sync, use 'rsync' or something like that instead ;-)
    assert(not(src_remote == False and dst_remote == False))

    info(u"Verifying attributes...")
    cfg = Config()
    ## Items left on src_list will be transferred
    ## Items left on update_list will be transferred after src_list
    ## Items left on copy_pairs will be copied from dst1 to dst2
    update_list = FileDict(ignore_case = False)
    ## Items left on dst_list will be deleted
    copy_pairs = []

    debug("Comparing filelists (direction: %s -> %s)" % (__direction_str(src_remote), __direction_str(dst_remote)))

    for relative_file in src_list.keys():
        debug(u"CHECK: %s" % (relative_file))

        if dst_list.has_key(relative_file):
            ## Was --skip-existing requested?
            if cfg.skip_existing:
                debug(u"IGNR: %s (used --skip-existing)" % (relative_file))
                del(src_list[relative_file])
                del(dst_list[relative_file])
                continue

            try:
                same_file = _compare(src_list, dst_list, src_remote, dst_remote, relative_file)
            except (IOError,OSError), e:
                debug(u"IGNR: %s (disappeared)" % (relative_file))
                warning(u"%s: file disappeared, ignoring." % (relative_file))
                del(src_list[relative_file])
                del(dst_list[relative_file])
                continue

            if same_file:
                debug(u"IGNR: %s (transfer not needed)" % relative_file)
                del(src_list[relative_file])
                del(dst_list[relative_file])

            else:
                # look for matching file in src
                try:
                    md5 = src_list.get_md5(relative_file)
                except IOError:
                    md5 = None
                if md5 is not None and dst_list.by_md5.has_key(md5):
                    # Found one, we want to copy
                    dst1 = list(dst_list.by_md5[md5])[0]
                    debug(u"DST COPY src: %s -> %s" % (dst1, relative_file))
                    copy_pairs.append((src_list[relative_file], dst1, relative_file))
                    del(src_list[relative_file])
                    del(dst_list[relative_file])
                else:
                    # record that we will get this file transferred to us (before all the copies), so if we come across it later again,
                    # we can copy from _this_ copy (e.g. we only upload it once, and copy thereafter).
                    dst_list.record_md5(relative_file, md5)
                    update_list[relative_file] = src_list[relative_file]
                    del src_list[relative_file]
                    del dst_list[relative_file]

        else:
            # dst doesn't have this file
            # look for matching file elsewhere in dst
            try:
                md5 = src_list.get_md5(relative_file)
            except IOError:
               md5 = None
            dst1 = dst_list.find_md5_one(md5)
            if dst1 is not None:
                # Found one, we want to copy
                debug(u"DST COPY dst: %s -> %s" % (dst1, relative_file))
                copy_pairs.append((src_list[relative_file], dst1, relative_file))
                del(src_list[relative_file])
            else:
                # we don't have this file, and we don't have a copy of this file elsewhere.  Get it.
                # record that we will get this file transferred to us (before all the copies), so if we come across it later again,
                # we can copy from _this_ copy (e.g. we only upload it once, and copy thereafter).
                dst_list.record_md5(relative_file, md5)

    for f in dst_list.keys():
        if src_list.has_key(f) or update_list.has_key(f):
            # leave only those not on src_list + update_list
            del dst_list[f]

    return src_list, dst_list, update_list, copy_pairs

# vim:et:ts=4:sts=4:ai
