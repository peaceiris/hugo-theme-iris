#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

export DEFAULT_BRANCH="main"
export CURRENT_BRANCH="$(git branch --show-current)"

if [ "${CURRENT_BRANCH}" != "${DEFAULT_BRANCH}" ]; then
  echo "$0: Current branch ${CURRENT_BRANCH} is not ${DEFAULT_BRANCH}"
  exit 1
fi

git pull origin "${DEFAULT_BRANCH}"
export TARGET_FILES=".env theme.toml"
export HUGO_VERSION_LATEST=$(curl -s "https://api.github.com/repos/gohugoio/hugo/releases/latest" | jq -r '.tag_name')
export HUGO_VERSION_CURRENT=$(. ./.env && echo ${HUGO_VERSION})
echo "bump hugo from ${HUGO_VERSION_CURRENT} to ${HUGO_VERSION_LATEST#v}"
git checkout -b "hugo-${HUGO_VERSION_LATEST#v}"
sed -i "s/${HUGO_VERSION_CURRENT}/${HUGO_VERSION_LATEST#v}/g" ${TARGET_FILES}
git add ${TARGET_FILES}
git commit -m "deps: bump hugo from ${HUGO_VERSION_CURRENT} to ${HUGO_VERSION_LATEST#v}"
git push origin "hugo-${HUGO_VERSION_LATEST#v}"
gh pr create --web
