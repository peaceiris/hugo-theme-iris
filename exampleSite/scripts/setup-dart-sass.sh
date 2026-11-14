#!/usr/bin/env bash
set -euo pipefail

# Keep the native (embedded protocol) compiler outside the Hugo project.
version=1.108.2
install_dir="${SASS_INSTALL_DIR:-${HOME}/.local/share/hugo-theme-iris/dart-sass}"
case "$(uname -s)/$(uname -m)" in
  Linux/x86_64) platform=linux-x64; checksum=32d2eb5b83cbc180fce9657ff3c57401a9006c59eccfe0bfdde0aa755a66d42f ;;
  Linux/aarch64|Linux/arm64) platform=linux-arm64; checksum=1c7a587c81467e8f7551d71e5d62845b53270033c5cc3d36aa8fa07330a5d2a9 ;;
  Darwin/x86_64) platform=macos-x64; checksum=8822d1f3715d84126a6adfe7053559a64e69687bb6e1b5da0d7f854b0c6ba2fa ;;
  Darwin/arm64) platform=macos-arm64; checksum=95b1bbb13f0b38ba8aacefae45ef23f11271231d24fb57b1593c9e2adf65481c ;;
  *) echo 'Unsupported platform: use Linux (glibc) or macOS on x64/arm64.' >&2; exit 1 ;;
esac

if [[ -x "${install_dir}/sass" ]] && [[ "$("${install_dir}/sass" --version)" = "${version}" ]]; then
  echo "Dart Sass ${version} is already installed in ${install_dir}"
  exit 0
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "${tmp_dir}"' EXIT
archive="${tmp_dir}/dart-sass.tar.gz"
curl --fail --location --retry 3 --output "${archive}" \
  "https://github.com/sass/dart-sass/releases/download/${version}/dart-sass-${version}-${platform}.tar.gz"
if command -v sha256sum >/dev/null 2>&1; then
  actual="$(sha256sum "${archive}")"
else
  actual="$(shasum -a 256 "${archive}")"
fi
if [[ "${actual%% *}" != "${checksum}" ]]; then
  echo 'Dart Sass archive checksum mismatch' >&2
  exit 1
fi
tar -xzf "${archive}" -C "${tmp_dir}"
[[ "$("${tmp_dir}/dart-sass/sass" --version)" = "${version}" ]]
mkdir -p "${install_dir}"
cp -R "${tmp_dir}/dart-sass/." "${install_dir}/"
echo "Installed Dart Sass ${version} in ${install_dir}"
