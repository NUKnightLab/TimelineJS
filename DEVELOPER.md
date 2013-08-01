## Requirements

 python 2.7.x
 
 [virtualenvwrapper](http://virtualenvwrapper.readthedocs.org/)
 
 [Node.js](http://nodejs.org)
 
 [LESS](http://lesscss.org)
 
    # npm install -g less
  
 [UglifyJS](https://github.com/mishoo/UglifyJS)
 
    # npm install -g uglify-js@1

## Setup

    # Change into the parent directory containing your repositories
    cd path_to_repos_root
  
    # Clone the secrets repository (if necessary)
    git clone git@github.com:NUKnightLab/secrets.git
  
    # Clone the cdn repository (if necessary)
    git clone git@github.com:NUKnightLab/cdn.knightlab.com.git
  
    # Clone the timeline repository
    git clone git@github.com:NUKnightLab/TimelineJS.git
  
    # Change into the timeline repository
    cd TimelineHS
  
    # Create a virtual environment
    mkvirtualenv TimelineJS
  
    # Activate the virtual environment
    workon TimelineJS
  
    # Install python requirements
    pip install -r requirements.txt
  
    # Run the development server
    fab serve


## Overview

Files in the `source` directory are resources for deployment to the CDN.

Files in the `website` directory are specific to the website.

`config.json` is used to control building, staging, and deployment


## Deploying to the CDN

To stage your changes to a versioned directory in your local CDN repository, type `fab stage` This runs a build, copies the files into a versioned directory in your local `cdn.knightlab.com` repository, and tags the last commit with a version number.

To stage your changes to the `latest` directory in your local CDN repository, type `fab stage_latest` This copies files from a versioned directory in your local `cdn.knightlab.com` respository into the corresponding `latest` directory. 

You must push and deploy all CDN changes separately from that repository.


## Deploying to S3 (timeline.knightlab.com)

To deploy to S3, type `fab deploy`. 


  
