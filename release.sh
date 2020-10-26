#!/bin/zsh
set -e

[[ -n $1 ]] || (echo "missing release version!\nUsage: release.sh <release version> <logrocket env file name>" && exit 1)
[[ -n $2 ]] || (echo "missing logrocket env file!\nUsage: release.sh <release version> <logrocket env file name>" && exit 1)
[[ -f $2 ]] || (echo "logrocket env file invalid $2" && exit 1)
echo "building version $1 and uploading source maps to logrocket..."
export RELEASE_VERSION="$1"
. $2
NODE_ENV=production webpack --mode=production
# bundle is build, we no longer need the version number left in
# do logrocket uploads
logrocket release $1 --apikey=$LOGROCKET_API_KEY
logrocket upload build/ --release=$1 --apikey=$LOGROCKET_API_KEY --url-prefix="/react/$1"
# move the source map files into a separate folder
mkdir -p build/sourcemaps && mv build/*.js.map build/sourcemaps/