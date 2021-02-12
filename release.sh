#!/bin/zsh
set -e

LR_vars=$1
echo $LR_vars
[[ -n $1 ]] || LR_vars="./.lr_staging" #defaulting to staging.
[[ -f $LR_vars ]] || (echo "logrocket env file invalid $LR_vars" && exit 1)
version=`cat package.json | python -c 'import json,sys,datetime; from datetime import time; d = datetime.datetime.now(); obj=json.load(sys.stdin); version = obj["gitRevision"]; dateString = d.strftime("%d-%m-%H-%M"); print({version.find("release") == 0: version[8:-2] + "." + dateString}.get(True, version + "." + dateString));'`
echo "building version $version ..."
echo $LR_vars
export RELEASE_VERSION="$version"
. $LR_vars
NODE_ENV=production webpack --mode=production
URL_PREFIX="~/react/$version/"
echo $URL_PREFIX

if [ ! -z "$LOGROCKET_IDENTIFIER" ] 
then
    echo "creating logrocket release and uploading source maps for $LOGROCKET_IDENTIFIER in NA ..."
    logrocket release $version --apikey=$LOGROCKET_API_KEY
    logrocket upload build/ --release=$version --apikey=$LOGROCKET_API_KEY --url-prefix=$URL_PREFIX
elif [ ! -z "$LOGROCKET_IDENTIFIER_EU" ] 
then
    echo "creating logrocket release and uploading source maps for $LOGROCKET_IDENTIFIER_EU in EU ..."
    logrocket release $version --apikey=$LOGROCKET_API_KEY_EU
    logrocket upload build/ --release=$version --apikey=$LOGROCKET_API_KEY_EU --url-prefix=$URL_PREFIX
else
    (echo "Neither of LOGROCKET_API_KEY nor LOGROCKET_API_KEY_EU set so exiting" && exit 1)
fi

# move the source map files into a separate folder
mkdir -p build/sourcemaps && mv build/*.js.map build/sourcemaps/
aws s3 cp build/ s3://integrator-staging-ui-resources/react/$version/ --recursive --acl public-read
aws s3 cp build/index.html s3://integrator-staging-ui-resources/react/index.html --acl public-read