from os.path import abspath, basename, dirname, join
import sys
from fabric.api import env

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
