#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

cd $1
git init
wget https://github.com/peaceiris/hugo-theme-iris/archive/master.zip
unzip master.zip
rm master.zip
cp -r ./hugo-theme-iris-master/exampleSite/{config,content,data,scripts,static,.gitignore,package.hugo.json,.npmrc} .
rm -rf hugo-theme-iris-master
hugo mod init "github.com/$2/$1"
hugo mod get -u github.com/peaceiris/hugo-theme-iris
hugo mod npm pack
npm install
git add .
git commit -m "Add hugo-theme-iris"
