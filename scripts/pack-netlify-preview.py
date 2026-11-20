"""Pack the static preview files before handing the ZIP to upload-artifact."""

import argparse
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


EXCLUDED = {'CNAME', '_redirects', 'admin/config.yml'}


def preview_files(root, directory):
  for entry in sorted(directory.iterdir()):
    name = entry.relative_to(root).as_posix()
    if entry.name.startswith('.') or name in EXCLUDED:
      continue
    if entry.is_symlink():
      raise ValueError(f'symlink in preview output: {name!r}')
    if entry.is_dir():
      yield from preview_files(root, entry)
    elif entry.is_file():
      yield entry, name
    else:
      raise ValueError(f'nonregular preview output: {name!r}')


def pack(source, archive):
  if source.is_symlink() or not (source / 'index.html').is_file():
    raise ValueError('preview output must contain a root index.html file')
  if archive.resolve().is_relative_to(source.resolve()):
    raise ValueError('preview ZIP must be outside the source directory')
  with ZipFile(archive, 'x', compression=ZIP_DEFLATED) as zipped:
    for entry, name in preview_files(source, source):
      zipped.write(entry, name)


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('source', type=Path)
  parser.add_argument('archive', type=Path)
  args = parser.parse_args()
  try:
    pack(args.source, args.archive)
  except (OSError, ValueError) as error:
    parser.exit(1, f'Preview packaging failed: {error!r}\n')


if __name__ == '__main__':
  main()
