from os.path import abspath, basename, dirname, join
import sys
from fabric.api import env
from fabric.decorators import roles, runs_once, task
import distutils.core

#
# Project-specific settings, alter as needed
#
# env.project_name = basename(dirname(__file__))
env.project_name = 'TimelineJS'

#
# Add paths
#
def add_paths(*args):
    """Make paths are in sys.path."""
    for p in args:
        if p not in sys.path:
            sys.path.append(p)
 
project_path = dirname(abspath(__file__))
repos_path = dirname(project_path)
fablib_path = join(repos_path, 'fablib')

add_paths(project_path, repos_path, fablib_path)

#
# Import from fablib
#
from fablib import *

@task
def stage_wp():
    """* Use to copy over CSS/JS files to WP Plugin directory"""    
    print("This will copy over the css/js folders from within build to the Wordpress Plugin Directory")
    if not confirm('Is your TimelineJS-Wordpress-Plugin Directory in the same directory as where TimelineJS is located? (y/n) '):
    	abort('Cancelling')

    # # Copy over CSS files
    build_css_dir = "build/css"
    wp_css_dir = "../TimelineJS-Wordpress-Plugin/css"
    distutils.dir_util.copy_tree(build_css_dir, wp_css_dir)

    # # Copy over JS files
    build_js_dir = "build/js"
    wp_js_dir = "../TimelineJS-Wordpress-Plugin/js"
    distutils.dir_util.copy_tree(build_js_dir, wp_js_dir)

    print("\nRemember to push the updated files in TimelineJS-Wordpress-Plugin as well....")





