"""Common settings and globals."""
import os
from os.path import abspath, basename, dirname, join, normpath

CORE_ROOT = dirname(dirname(abspath(__file__)))
PROJECT_ROOT = dirname(dirname(CORE_ROOT))
