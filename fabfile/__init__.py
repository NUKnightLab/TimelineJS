# -*- coding: utf-8 -*-
import sys
import os
from os.path import dirname, abspath, join
from datetime import date
import json
import codecs
import shutil
import fnmatch
import re
import collections
from fabric.api import env, settings, hide, local, lcd
from fabric.decorators import task
from fabric.operations import prompt
from fabric.utils import puts, abort, warn

env.debug = False

#
# Set paths
#
env.project_path = dirname(dirname(abspath(__file__)))
env.sites_path = dirname(env.project_path)
env.build_path = join(env.project_path, 'build')
env.source_path = join(env.project_path, 'source')

#
# Read config.json and update vars
#
with open(join(env.project_path, 'config.json')) as fp:
    s = fp.read()
    s = re.sub(r'//.*', '', s)
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.DOTALL)
    CONFIG = json.loads(s, object_pairs_hook=collections.OrderedDict)
    
today = date.today()
CONFIG['date'] = today
CONFIG['year'] = today.year

# Path to cdn deployment
env.cdn_path = abspath(join(
    env.sites_path, 'cdn.knightlab.com', 'app', 'libs', CONFIG['name']))

# Path to s3cmd.cnf in secrets repository
env.s3cmd_cfg = join(env.sites_path, 'secrets', 's3cmd.cfg')

# Banner for the top of CSS and JS files
BANNER = """
/* 
    TimelineJS - ver. %(version)s - %(date)s
    Copyright (c) 2012-%(year)s Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. 
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
""".lstrip()
        

def _check_path(path):
    """Check for the existence of a path"""
    if not os.path.exists(path):
        abort('Could not find %s.' % path)

def _clean(path):
    """Delete directory contents"""
    path = os.path.abspath(path)
    puts('clean: %s' % path)

    if os.path.exists(path):    
        if os.path.isdir(path):
            for item in [join(path, x) for x in os.listdir(path)]:
                if os.path.isfile(item):
                    os.unlink(item)
                else:
                    shutil.rmtree(item)
        else:
            os.unlink(path)

def _find_file(file_name, cur_dir):
    """Find a file.  Look first in cur_dir, then env.source_path"""
    file_path = os.path.abspath(join(cur_dir, file_name))
    if os.path.exists(file_path):
        return file_path
    for dirpath, dirs, files in os.walk(env.source_path):
        if file_name in files:
            return os.path.join(dirpath, file_name)
    raise Exception('Could not find "%s" in %s' % (file_name, env.source_path))

def _match_files(src, regex):
    """Return relative filepaths matching regex in src"""
    re_match = re.compile(regex)
    
    for (dirpath, dirnames, filenames) in os.walk(src):  
        rel_dir = _relpath(src, dirpath)
        
        for f in filter(lambda x: not x.startswith('.'), filenames):
            rel_path = join(rel_dir, f)
            if re_match.match(rel_path):   
                yield rel_path
  
def _makedirs(path, isfile=False):
    """Make directories in path"""
    if isfile:
        path = dirname(path)
    if not os.path.exists(path):
        os.makedirs(path)

def _open_file(path, mode, encoding=''):
    """Open a file with character encoding detection"""   
    if mode.startswith('r'):
        bytes = min(32, os.path.getsize(path))
    
        with open(path, 'rb') as fd:
            raw = fd.read()       
            if raw.startswith(codecs.BOM_UTF8):
                encoding = 'utf-8-sig'
            else:
                encoding = 'utf-8'
    
    return codecs.open(path, mode, encoding)  

def _relpath(root_path, path):
    """Get relative path from root_path"""
    if root_path == path:
        return ''
    return os.path.relpath(path, root_path)
 
#
# tagging
#

def _get_tags():
    """Get list of current tags from the repo"""
    tags = os.popen('cd %(project_path)s;git tag' % env).read().strip()
    if tags:
        return [x.strip() for x in tags.split('\n')]
    return []
    
def _last_version_tag():
    """Get the last version tag"""
    re_num = re.compile('[^0-9.]')
    
    tags = sorted([map(int, re_num.sub('', t).split('.')) for t in _get_tags()])
    if tags:
        return '.'.join(map(str, tags[-1]))
    return None
          
def _get_version_tag():
    """Get a new version tag from user"""
    tags = _get_tags()
    puts('This project has the following tags:')
    puts(tags)
        
    while True:
        version = prompt("Enter a new version number: ").strip()
        
        if not re.match(r'^[0-9]+\.[0-9]+\.[0-9]+$', version):
            warn('Invalid version number, must be in the format:' \
                ' major.minor.revision')
        elif version in tags:
            warn('Invalid version number, tag already exists')
        else:
            break
    
    return version
    
def _render_templates(src_path, dst_path):
    """Render flask templates"""
    puts('render: %s >> %s' % (src_path, dst_path))        
    from website import app
    from flask import g, request
  
    compiled_includes = []
    
    for f in _match_files(src_path, '^[^_].*$'):  
        with app.app.test_request_context():
            g.compile_includes = True
            g.compiled_includes = compiled_includes
            content = app.catch_all(f)
            compiled_includes = g.compiled_includes

        page_file = join(dst_path, f)
        puts('  %s' % page_file)
        _makedirs(page_file, isfile=True)
        with open(page_file, 'w') as fd:
            fd.write(content.encode('utf-8'))


#
#  build steps
#

def banner(conf):
    """
    Place banner at top of js and css files in-place.    
    """
    _banner_text = BANNER % CONFIG
   
    def _do(file_path):
        puts('  %s' % file_path)  
        with _open_file(file_path, 'r+') as fd:
            s = fd.read()
            fd.seek(0)
            fd.write(_banner_text+s)

    for r in conf:
        src = join(env.project_path, r)
        puts('banner: %s' % src)
        if os.path.isdir(src):
            for f in _match_files(src, '.*\.(css|js)$'):
                _do(join(src, f))
        else:
            _do(src)

def concat(conf):
    """
    Concatenate files
    """        
    for r in conf:
        dst = join(env.project_path, r['dst']) 
        src = map(lambda x: join(env.project_path, x), r['src'])      
        _makedirs(dst, isfile=True)
        local('cat %s > %s' % (' '.join(src), dst))

def copy(conf):
    """
    Copy files
    """  
    def _do(src_path, dst_path):
        puts('  %s' % src_path)     
        _makedirs(dst_path, isfile=True)
        shutil.copy2(src_path, dst_path)
        
    for r in conf:
        src = join(env.project_path, r['src'])
        dst = join(env.project_path, r['dst'])
        puts('copy: %s >> %s' % (src, dst))
        if os.path.isdir(src):
            regex = r['regex'] if 'regex' in r else '.*'           
            for f in _match_files(src, regex):
                _do(join(src, f), join(dst, f))
        else:   
            _do(src, dst)             

def lessc(conf):
    """
    Compile LESS
    """        
    def _do(src_path, dst_path):
        _makedirs(dst_path, isfile=True)
        with hide('warnings'), settings(warn_only=True):
            result = local('lessc -x %s %s' % (src_path, dst_path))
        if result.failed:
            abort('Error running lessc on %s' % src_path)    

    if not os.popen('which lessc').read().strip():
        abort('You must install the LESS compiler')
        
    for r in conf:
        src = join(env.project_path, r['src'])
        dst = join(env.project_path, r['dst'])
        
        if os.path.isdir(src):
            regex = r['regex'] if 'regex' in r else '.*'           
            for f in _match_files(src, regex):
                (base, ext) = os.path.splitext(join(dst, f)) 
                _do(join(src, f), base+".css")
        else:
            _do(src, dst)             
            

def minify(conf):
    """
    Minify javascript 
    """       
    def _do(src_path, dst_path, opt):
        local('uglifyjs %s --output %s %s' % (opt, dst_path, src_path))
                   
    for r in conf:
        src = join(env.project_path, r['src'])
        dst = join(env.project_path, r['dst'])
        puts('minify: %s >> %s' % (src, dst))
 
        opt = r['opt'] if ('opt' in r) else ''
        out_ext = r['ext'] if ('ext' in r) else ''
       
        if os.path.isdir(src):
            _makedirs(dst, isfile=False)
            for f in _match_files(src, '.*\.js'):
                (base, in_ext) = os.path.splitext(join(dst, f))
                _do(join(src, f), base+out_ext+in_ext, opt)
        else:                
            _makedirs(dst, isfile=True)
            _do(src, dst, opt)

        
def process(conf):
    """
    Process codekit style imports
    """
    _re_prepend = re.compile(r'@codekit-prepend\s*[\'"](?P<file>.+)[\'"]\s*;')
    _re_append = re.compile(r'@codekit-append\s*[\'"](?P<file>.+)[\'"]\s*;')

    def _mark(f_out, path):
        f_out.write("""
/* **********************************************
     Begin %s
********************************************** */

""" % os.path.basename(path))
        
    def _do(f_out, path, imported):
        s = ''
        dirpath = dirname(path)      
        with _open_file(path, 'r') as f_in:
            s = f_in.read()
     
        # Write out prepends
        for m in _re_prepend.finditer(s):
            file_path = _find_file(m.group('file'), dirpath)
            if not file_path in imported:
                puts('  prepend: %s' % file_path)
                imported.append(file_path)
                _do(f_out, file_path, imported)
        
        # Write out file
        _mark(f_out, os.path.basename(path))  
        f_out.write(s+'\n')
        
        # Write out appends    
        for m in _re_append.finditer(s):
            file_path = _find_file(m.group('file'), dirpath)
            if not file_path in imported:
                puts('  append: %s' % file_path)
                imported.append(file_path)
                _do(f_out, file_path, imported)
              
    for r in conf:
        src = join(env.project_path, r['src'])
        dst = join(env.project_path, r['dst'])       
        puts('process: %s >> %s' % (src, dst))
     
        _makedirs(dst, isfile=True)
        with _open_file(dst, 'w', 'utf-8') as out_file:
            _do(out_file, src, [])

            
def usemin(conf):
    """
    Replaces usemin-style build blocks with a reference to a single file.    

    Build blocks take the format:
    
        <!-- build:type path -->
        (references to unoptimized files go here)
        <!-- endbuild -->
    
    where:
        type = css | js
        path = reference to the optimized file
    
    Any leading backslashes will be stripped, but the path will otherwise
    by used as it appears within the opening build tag.
    """
    _re_build = re.compile(r"""
        <!--\s*build:(?P<type>\css|js)\s+(?P<dest>\S+)\s*-->
        .*?
        <!--\s*endbuild\s*-->
        """, 
        re.VERBOSE | re.DOTALL)

    def _sub(m):
        type = m.group('type')
        dest = m.group('dest').strip('\\')
    
        if type == 'css':
            return '<link rel="stylesheet" href="%s">' % dest
        elif type == 'js':
            return '<script type="text/javascript" src="%s"></script>' % dest
        else:
            warn('Unknown build block type (%s)' % type)
            return m.group(0)

    def _do(file_path):
        with _open_file(file_path, 'r+') as fd:
            s = fd.read()        
            (new_s, n) = _re_build.subn(_sub, s)     
            if n:
                puts('  (%d) %s' % (n, file_path))        
                fd.seek(0)
                fd.write(new_s)
                fd.truncate()
                      
    for r in conf:
        src = join(env.project_path, r)  
        puts('usemin: %s' % src)

        if os.path.isdir(src):            
            for f in _match_files(src, '.*\.html'):
                _do(join(src, f))
        else:                
            _do(src)
     
                 
# 
# tasks
#
        
@task 
def debug():
    """Setup debug settings"""
    warn('DEBUG IS ON:')
    CONFIG['deploy']['bucket'] = 'test.knilab.com'
    CONFIG['version'] = '0.0.0'
     
    print 'deploy.bucket:', CONFIG['deploy']['bucket']
    print 'version:', CONFIG['version']
    print 'version tagging is OFF'
    print ''
    
    doit = prompt("Continue? (y/n): ").strip()
    if doit != 'y':
        abort('Stopped')
        
    env.debug = True
            
@task
def serve():
    """Run the local version of the documentation site (timeline.knightlab.com)"""
    with lcd(join(env.project_path)):
        local('python website/app.py')
 
      
@task
def build():
    """Build version"""   
    # Get build config
    if not 'build' in CONFIG:
        abort('Could not find "build" in config file')
      
    # Determine version
    if not 'version' in CONFIG:
        CONFIG['version'] = _last_version_tag()
    if not CONFIG['version']:
        abort('No available version tag')      
    
    print 'Building version %(version)s...' % CONFIG

    # Clean build directory
    _clean(env.build_path)

    for key, param in CONFIG['build'].iteritems():
        getattr(sys.modules[__name__], key)(param)
           
   
@task
def stage():
    """
    Build version, copy to local cdn repository, tag last commit
    """    
    if not 'stage' in CONFIG:
        abort('Could not find "stage" in config file')

    # Make sure cdn exists
    _check_path(dirname(env.cdn_path))
    
    # Ask user for a new version
    if not env.debug:
        CONFIG['version'] = _get_version_tag()     
  
    build()
    
    cdn_path = join(env.cdn_path, CONFIG['version'])

    _clean(cdn_path)
    
    for r in CONFIG['stage']:
        copy([{"src": r['src'], "dst": cdn_path, "regex": r['regex']}])
        
    if not env.debug:
        with lcd(env.project_path):
            local('git tag %(version)s' % CONFIG)
            local('git push origin %(version)s' % CONFIG)
            
    
@task
def stage_latest():
    """
    Copy version to latest within local cdn repository
    """
    if 'version' in CONFIG:
        version = CONFIG['version']
    else:
        tags = _get_tags()
        puts('This project has the following tags:')
        puts(tags)
    
        while True:
            version = prompt("Which version to stage as 'latest'? ").strip()        
            if not version in tags:
                warn('You must enter an existing version')
            else:
                break
    
    print 'stage_latest: %s' % version
    
    # Make sure version has been staged
    version_cdn_path = join(env.cdn_path, version)
    if not os.path.exists(version_cdn_path): 
        abort("Version '%s' has not been staged" % version)
      
    # Stage version as latest           
    latest_cdn_path = join(env.cdn_path, 'latest')
    _clean(latest_cdn_path)
    copy([{"src": version_cdn_path, "dst": latest_cdn_path}])


@task
def deploy():
    """Deploy to S3 bucket"""
    if not 'deploy' in CONFIG:
        abort('Could not find "deploy" in config file')

    # Make sure s3cmd.cnf exists
    _check_path(env.s3cmd_cfg)   
    
    # Do we need to build anything here?!?     
    #build()
    
    template_path = join(env.project_path, 'website', 'templates')
    deploy_path = join(env.project_path, 'build', 'website')
    
    _clean(deploy_path)
    
    # render templates and run usemin
    _render_templates(template_path, deploy_path)   
    usemin([deploy_path])
    
    # copy static fiels
    copy([{
        "src": join(env.project_path, 'website', 'static'),
        "dst": join(deploy_path, 'static')
    }])
    
    # additional copy?
    if 'copy' in CONFIG['deploy']:
        copy(CONFIG['deploy']['copy'])
   
    # sync to S3
    with lcd(env.project_path):
        local('fabfile/s3cmd --config=%s sync' \
                ' --rexclude ".*/\.[^/]*$"' \
                ' --delete-removed --acl-public' \
                ' %s/ s3://%s/' \
                % (env.s3cmd_cfg, deploy_path, CONFIG['deploy']['bucket'])
            )


          