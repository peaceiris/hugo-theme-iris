#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

cd $1
git init
git submodule add https://github.com/peaceiris/hugo-theme-iris.git ./themes/hugo-theme-iris
cp -r ./themes/hugo-theme-iris/exampleSite/{config,content,data,scripts,static} .
git add .
git commit -m "Add hugo-theme-iris"
