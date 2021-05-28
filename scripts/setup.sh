#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

cd $1
git init
wget https://github.com/peaceiris/hugo-theme-iris/archive/main.zip
unzip main.zip
rm main.zip
cp -r ./hugo-theme-iris-main/exampleSite/{assets,config,content,data,i18n,static,.gitignore} .
rm -rf hugo-theme-iris-main
hugo mod init "github.com/$2/$1"
hugo mod get -u github.com/peaceiris/hugo-theme-iris
git add .
git commit -m "Add hugo-theme-iris"
