#!/bin/zsh
set -e

[[ -n $1 ]] || (echo "missing release version!\nUsage: release.sh <release version> <logrocket env file name>" && exit 1)
[[ -n $2 ]] || (echo "missing logrocket env file!\nUsage: release.sh <release version> <logrocket env file name>" && exit 1)
[[ -f $2 ]] || (echo "logrocket env file invalid $2" && exit 1)
echo "building version $1 ..."
export RELEASE_VERSION="$1"
. $2
NODE_ENV=production webpack --mode=production
echo "creating logrocket release and uploading source maps for $LOGROCKET_IDENTIFIER ..."
URL_PREFIX="~/react/$1/"
logrocket release $1 --apikey=$LOGROCKET_API_KEY
logrocket upload build/ --release=$1 --apikey=$LOGROCKET_API_KEY --url-prefix=$URL_PREFIX
if [[ $LOGROCKET_IDENTIFIER_EU != $LOGROCKET_IDENTIFIER ]]; then
    echo "creating logrocket release and uploading source maps for $LOGROCKET_IDENTIFIER_EU ..."
    logrocket release $1 --apikey=$LOGROCKET_API_KEY_EU
    logrocket upload build/ --release=$1 --apikey=$LOGROCKET_API_KEY_EU --url-prefix=$URL_PREFIX
fi
# move the source map files into a separate folder
mkdir -p build/sourcemaps && mv build/*.js.map build/sourcemaps/