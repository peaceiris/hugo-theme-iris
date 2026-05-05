#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

project_name="$1"
github_id="$2"
theme_ref="${3:-main}"

cd "${project_name}"
git init
theme_archive="hugo-theme-iris.zip"
wget -O "${theme_archive}" "https://github.com/peaceiris/hugo-theme-iris/archive/${theme_ref}.zip"
unzip "${theme_archive}"
rm "${theme_archive}"
theme_dir="$(find . -maxdepth 1 -type d -name 'hugo-theme-iris-*' -print | head -n 1)"
if [[ -z "${theme_dir}" ]]; then
  echo "failed to extract hugo-theme-iris archive for ${theme_ref}" >&2
  exit 1
fi
hugo mod init "github.com/${github_id}/${project_name}"
cp -r "${theme_dir}"/exampleSite/{.gitignore,assets,config,content,data,i18n,package-lock.json,package.json,scripts,static} .
rm ./assets/images/.gitignore
rm -rf "${theme_dir}"
hugo mod get -u "github.com/peaceiris/hugo-theme-iris@${theme_ref}"
git add .
git commit -m "Add hugo-theme-iris"
