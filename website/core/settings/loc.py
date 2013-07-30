"""Local settings and globals."""
import sys
from os.path import normpath, join
from .base import *

# Import secrets
sys.path.append(
    abspath(join(PROJECT_ROOT, '../secrets/buzz/stg'))
)

from secrets import *

# Set static URL
STATIC_URL = '/static'