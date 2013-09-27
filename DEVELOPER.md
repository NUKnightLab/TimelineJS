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
 
    # Clone the fablib repository (if necessary)
    git clone git@github.com:NUKnightLab/fablib.git
 
    # Clone the timeline repository (and the submodules)
    git clone --recursive git@github.com:NUKnightLab/TimelineJS.git
  
    # Change into the timeline repository
    cd TimelineJS
  
    # Create a virtual environment
    mkvirtualenv TimelineJS
  
    # Activate the virtual environment
    workon TimelineJS
  
    # Install python requirements
    pip install -r requirements.txt
  
    # Run the development server. 
    fab serve

    # Re-compile to preview changes. Of course this will need to be in another terminal, or after the fab serve command was put in the
    # background. It would be great to automate this, but we would like to not add another build system and haven't figured out how to
    # do it with fabric. Pull requests are welcome!
    fab build

## Overview

Files in the `source` directory are resources for deployment to the CDN.

Files in the `website` directory are specific to the website.

`config.json` is used to control building, staging, and deployment

## Updating the documentation site

Documentation site files are in the `website` directory. To review your edits locally, run `fab serve` to start a local server on [http://localhost:5000](http://localhost:5000). 

## Deploying updates to the documentation site (timeline.knightlab.com)

To deploy to S3, type `fab deploy`.

## Deploying javascript changes to the CDN

To stage your changes to a versioned directory in your local CDN repository, type `fab stage` You will be prompted for the new version number. After you provide it, this `fab stage` runs a build, copies the files into a versioned directory in your local `cdn.knightlab.com` repository, and tags the last commit with a version number.

To stage your changes to the `latest` directory in your local CDN repository, type `fab stage_latest` You will be prompted for which version number you want to stage as the 'latest' version on the CDN. This copies files from the directory with that version in your local `cdn.knightlab.com` respository into the corresponding `latest` directory -- so you will have to have used `fab stage` before this.

You must push and deploy all CDN changes separately from that repository. Don't forget to edit the index page there until we work out some automated index building system.

