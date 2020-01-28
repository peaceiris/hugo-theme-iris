#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

if [ "$(git branch --show-current)" != "master" ]; then
  echo "$0: Current branch is not master" 1>&2
  exit 1
fi

RELEASE_TYPE_LIST="prerelease prepatch patch preminor minor major premajor"
if command -v fzf; then
  RELEASE_TYPE=$(echo "${RELEASE_TYPE_LIST}" | tr ' ' '\n' | fzf --layout=reverse)
else
  select sel in ${RELEASE_TYPE_LIST}; do
    RELEASE_TYPE="${sel}"
    break
  done
fi

echo -e "$0: Create \e[36m${RELEASE_TYPE}\e[m release, continue? (y/n)"
read -r res
if [ "${res}" = "n" ]; then
  echo "$0: Stop script"
  exit 0
fi

git fetch origin
git pull origin master
git pull origin --tags

npm ci

npm run build
git add ./exampleSite/resources
git commit -m "chore(release): Add resources"

npm run release -- --release-as "${RELEASE_TYPE}" --preset eslint

TAG_NAME="v$(jq -r '.version' ./package.json)"
git push origin master
git push origin "${TAG_NAME}"
