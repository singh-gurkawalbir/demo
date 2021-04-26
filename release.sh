#!/bin/zsh
set -e

env_vars=$1
[[ -f $env_vars ]] || (echo "env file $env_vars invalid" && exit 1)
echo $env_vars
. $env_vars
if [ -z "$LOGROCKET_IDENTIFIER" ] || [ -z "$LOGROCKET_API_KEY" ] || [ -z "$CDN_BASE_URI" ] || [ -z "$S3_BUCKET" ] || [ -z "$ACCESS_KEY_ID" ] || [ -z "$SECRET_ACCESS_KEY" ]; then
  echo 'one or more variables are undefined'        
  exit 1
fi

if [ "$skipBuildAndCopyIndexFileForEUDeployment" = true ] ; then
    echo 'copying NA build index file to EU eu-index file ...'
    aws configure set aws_access_key_id $ACCESS_KEY_ID
    aws configure set aws_secret_access_key $SECRET_ACCESS_KEY
    aws s3 cp build/index.html s3://$S3_BUCKET/react/eu-index.html --acl public-read
    aws configure set aws_access_key_id ''
    aws configure set aws_secret_access_key ''
    exit
fi

version=`python -c 'import version; print version.get_version_number()'`
echo "building version $version ..."
export RELEASE_VERSION="$version"

URL_PREFIX="~/react/$version/"
echo "LogRocket URL prefix $URL_PREFIX ..."
echo "S3 bucket name $S3_BUCKET ..."
yarn install
NODE_ENV=production webpack --mode=production

echo "creating logrocket release and uploading source maps for $LOGROCKET_IDENTIFIER ..."
logrocket release $version --apikey=$LOGROCKET_API_KEY
logrocket upload build/ --release=$version --apikey=$LOGROCKET_API_KEY --url-prefix=$URL_PREFIX

# move the source map files into a separate folder
mkdir -p build/sourcemaps && mv build/*.js.map build/sourcemaps/
# upload the build files to s3 bucket
aws configure set aws_access_key_id $ACCESS_KEY_ID
aws configure set aws_secret_access_key $SECRET_ACCESS_KEY
aws s3 cp build/ s3://$S3_BUCKET/react/$version/ --recursive --acl public-read
aws s3 cp build/index.html s3://$S3_BUCKET/react/index.html --acl public-read
aws configure set aws_access_key_id ''
aws configure set aws_secret_access_key ''