#!/bin/zsh
set -e

env_vars=$1
[[ -f $env_vars ]] || (echo "env file $env_vars invalid" && exit 1)
echo $env_vars
. $env_vars

REQUIRED_ENV_VARS=(S3_BUCKET ACCESS_KEY_ID SECRET_ACCESS_KEY)

if [ "$skipBuildAndCopyIndexFileForEUDeployment" != true ] ; then
  REQUIRED_ENV_VARS+=(LOGROCKET_IDENTIFIER LOGROCKET_API_KEY CDN_BASE_URI GA_KEY_1 GA_KEY_2)

  # if production env
  if [ $S3_BUCKET = "integrator-ui-resources" ]; then
    REQUIRED_ENV_VARS+=(LOGROCKET_IDENTIFIER_EU LOGROCKET_API_KEY_EU GA_KEY_1_EU GA_KEY_2_EU)
  fi
fi

for eVar in ${REQUIRED_ENV_VARS[@]}
do
  val=$(eval echo "\$$eVar")
  if [ -z "$val" ]; then
    echo "${eVar} variable undefined"
    exit 1
  fi
done

INDEX_FILE="index.html"
if [ "$INDEX_FILE_NAME" ]; then 
  INDEX_FILE=$INDEX_FILE_NAME 
fi

if [ "$skipBuildAndCopyIndexFileForNADeployment" = true ] ; then
    echo 'copying EU build eu_index file to NA index file ...'
    aws configure set aws_access_key_id $ACCESS_KEY_ID
    aws configure set aws_secret_access_key $SECRET_ACCESS_KEY
    aws s3 cp s3://$S3_BUCKET/react/eu_index.html s3://$S3_BUCKET/react/$INDEX_FILE --acl public-read
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

# create logrocket release with generated release number
echo "creating logrocket release and uploading source maps for $LOGROCKET_IDENTIFIER ..."
logrocket release $version --apikey=$LOGROCKET_API_KEY
logrocket upload build/ --release=$version --apikey=$LOGROCKET_API_KEY --url-prefix=$URL_PREFIX

# create logrocket release for EU region
if [ ! -z "$LOGROCKET_IDENTIFIER_EU" ]; then
  echo "creating logrocket release (for EU) and uploading source maps for $LOGROCKET_IDENTIFIER_EU ..."
  logrocket release $version --apikey=$LOGROCKET_API_KEY_EU
  logrocket upload build/ --release=$version --apikey=$LOGROCKET_API_KEY_EU --url-prefix=$URL_PREFIX
fi

# move the source map files into a separate folder
mkdir -p build/sourcemaps && mv build/*.js.map build/sourcemaps/
# upload the build files to s3 bucket
aws configure set aws_access_key_id $ACCESS_KEY_ID
aws configure set aws_secret_access_key $SECRET_ACCESS_KEY
aws s3 cp build/ s3://$S3_BUCKET/react/$version/ --recursive --acl public-read
aws s3 cp build/index.html s3://$S3_BUCKET/react/$INDEX_FILE --acl public-read
aws configure set aws_access_key_id ''
aws configure set aws_secret_access_key ''