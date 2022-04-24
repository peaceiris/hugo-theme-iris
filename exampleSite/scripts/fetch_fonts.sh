#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

rm -rf ./static/output/chtml/fonts/woff-v2 2>/dev/null || true
# cp -r ./node_modules/mathjax/es5/output/chtml/fonts/woff-v2 ./static/output/chtml/fonts/woff-v2
