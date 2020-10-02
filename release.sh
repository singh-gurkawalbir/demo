#!/bin/zsh
set -e
LRAPIKEY="yb95vd:glad:JVEth5BxPWsZBtZhjtaT"

[[ -n $1 ]] || (echo "missing release version!!" && exit 1)
echo "building version $1 and uploading source maps to logrocket..."
NODE_ENV=production webpack --mode=production
# bundle is build, we no longer need the version number left in
# do logrocket uploads
logrocket release $1 --apikey=$LRAPIKEY
logrocket upload --release=$1 --apikey=$LRAPIKEY build/