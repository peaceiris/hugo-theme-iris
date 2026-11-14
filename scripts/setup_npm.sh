#!/usr/bin/env bash
set -euo pipefail

npm_range=$(node -p 'require("./package.json").engines.npm')
npm install --global "npm@${npm_range}"
node --version
npm_version=$(npm --version)
echo "npm ${npm_version}"
# engines.npm uses a major version range (for example, 12.x).
test "${npm_version%%.*}.x" = "${npm_range}"
