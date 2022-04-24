#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

cd $1
git init
wget https://github.com/peaceiris/hugo-theme-iris/archive/main.zip
unzip main.zip
rm main.zip
hugo mod init "github.com/$2/$1"
cp -r ./hugo-theme-iris-main/exampleSite/{.gitignore,assets,config,content,data,i18n,package-lock.json,package.json,scripts,static} .
rm ./assets/images/.gitignore
rm -rf hugo-theme-iris-main
hugo mod get -u github.com/peaceiris/hugo-theme-iris
git add .
git commit -m "Add hugo-theme-iris"
