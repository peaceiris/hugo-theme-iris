#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

NVMRC_PATH=".nvmrc"
CURRENT_NODE_VERSION=$(cat "${NVMRC_PATH}")
NEW_NODE_VERSION=$(node -v)
BRANCH_NAME="bump-node-from-${CURRENT_NODE_VERSION}-to-${NEW_NODE_VERSION#v}"

echo "${NEW_NODE_VERSION#v}" > "${NVMRC_PATH}"

git checkout -b "${BRANCH_NAME}"
git add "${NVMRC_PATH}"
git commit -m "deps(npm-dev): bump node from ${CURRENT_NODE_VERSION} to ${NEW_NODE_VERSION#v}"
git push origin "${BRANCH_NAME}"
gh pr create --fill
gh pr view --web
