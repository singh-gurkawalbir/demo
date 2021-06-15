#!/bin/bash
if [ $# -eq 0 ]; then
  printf "No release version provided, please provide one\n" >&2
  exit                                   
fi
echo "synching with master and $1"
git checkout -B masterSync
git reset --hard upstream/master
if ! git pull upstream master; then
  printf "pull master failed from some merge error\n" >&2
  git reset --hard;
  exit                                   
fi
if ! git pull upstream release/$1; then
  printf "pull release/$1 failed from some merge error\n" >&2
  git reset --hard;
  exit                                   
fi
git push origin masterSync