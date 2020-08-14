#!/bin/sh
# This makes building & installing on heroku easier & avoids the package.json scripts hell

# Get path where the script is run from (this should be the root of the project)
PROJECT_ROOT="$PWD"

# Install and build individual react apps 
# Params:
# $1 - directory of react app
install_build() {
    cd $1
    yarn install && yarn build
    cd $PROJECT_ROOT
}

# Invoke the installation and build function for each app
install_build client
install_build admin
