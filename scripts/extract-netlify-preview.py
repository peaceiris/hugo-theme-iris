"""Materialize a static Netlify preview from an untrusted Actions artifact."""

import argparse
from pathlib import Path
import re
import shutil
import stat
import zipfile


MAX_ARCHIVE = 64 * 1024**2
MAX_TOTAL = 128 * 1024**2
MAX_FILE = 32 * 1024**2
MAX_ENTRIES = 4096
CHUNK = 64 * 1024
STATIC_SUFFIXES = set(
  '.html .css .js .mjs .json .xml .txt .svg .png .jpg .jpeg .gif .webp .avif '
  '.ico .woff .woff2 .ttf .otf .eot .pdf .map'.split()
)
RESERVED = {
  '_redirects', '_headers', '_functions', '_edge-functions', '_edge_functions',
  '_netlify', 'netlify.toml', 'netlify.yml', 'netlify.yaml', 'functions',
  'edge-functions', 'edge_functions',
}
# A colon in a nested Hugo slug is valid on the Linux runner. Reject it in
# the first component so drive-like prefixes are never accepted.
COMPONENT = re.compile(r'[A-Za-z0-9_-][A-Za-z0-9_.:-]{0,254}')


def plan(entries):
  if len(entries) > MAX_ENTRIES:
    raise ValueError('too many archive entries')

  explicit = set()
  paths = {}
  total = compressed = 0
  result = []
  for entry in entries:
    name = entry.orig_filename
    directory = entry.is_dir()
    parts = tuple((name[:-1] if directory else name).split('/'))
    if (
      name != entry.filename or len(name) > 1024 or len(parts) > 64
      or ':' in parts[0]
      or any(not COMPONENT.fullmatch(part) or part.endswith('.')
             or part.lower() in RESERVED for part in parts)
    ):
      raise ValueError(f'unsafe archive path: {name!r}')

    mode = stat.S_IFMT(entry.external_attr >> 16)
    expected_mode = stat.S_IFDIR if directory else stat.S_IFREG
    dos_directory = bool(entry.external_attr & 0x10)
    if mode not in (0, expected_mode) or (dos_directory and not directory):
      raise ValueError(f'nonregular archive entry: {name!r}')
    if entry.flag_bits & 1 or entry.compress_type not in (
      zipfile.ZIP_STORED, zipfile.ZIP_DEFLATED,
    ):
      raise ValueError(f'unsupported archive entry: {name!r}')
    if directory:
      if entry.file_size:
        raise ValueError(f'nonempty directory entry: {name!r}')
    elif Path(parts[-1]).suffix.lower() not in STATIC_SUFFIXES:
      raise ValueError(f'nonstatic archive entry: {name!r}')

    if parts in explicit:
      raise ValueError(f'duplicate archive entry: {name!r}')
    explicit.add(parts)
    for i in range(1, len(parts) + 1):
      prefix = parts[:i]
      key = tuple(part.lower() for part in prefix)
      value = (prefix, directory or i < len(parts))
      if paths.setdefault(key, value) != value:
        raise ValueError(f'conflicting archive paths: {name!r}')

    total += entry.file_size
    compressed += entry.compress_size
    if entry.file_size > MAX_FILE or total > MAX_TOTAL or compressed > MAX_ARCHIVE:
      raise ValueError('archive exceeds size limits')
    result.append((entry, parts, directory))

  if paths.get(('index.html',)) != (('index.html',), False):
    raise ValueError('archive is missing a root index.html file')
  return result


def extract(archive, output):
  with archive.open('rb') as file:
    if not stat.S_ISREG(archive.stat().st_mode) or archive.stat().st_size > MAX_ARCHIVE:
      raise ValueError('invalid archive file or size')
    with zipfile.ZipFile(file) as zipped:
      entries = plan(zipped.infolist())
      output.mkdir(mode=0o700, exist_ok=False)
      try:
        for entry, parts, directory in entries:
          target = output.joinpath(*parts)
          if directory:
            target.mkdir(parents=True, exist_ok=True)
            continue
          target.parent.mkdir(parents=True, exist_ok=True)
          remaining = entry.file_size
          with zipped.open(entry) as source, target.open('xb') as dest:
            while data := source.read(min(CHUNK, remaining + 1)):
              remaining -= len(data)
              if remaining < 0:
                raise ValueError('archive entry exceeds declared size')
              dest.write(data)
          if remaining != 0:
            raise ValueError('archive entry shorter than declared size')
      except BaseException:
        shutil.rmtree(output)
        raise


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('archive', type=Path)
  parser.add_argument('output', type=Path)
  args = parser.parse_args()
  try:
    extract(args.archive, args.output)
  except (ValueError, OSError, RuntimeError, zipfile.BadZipFile) as error:
    parser.exit(1, f'Preview extraction failed: {error!r}\n')


if __name__ == '__main__':
  main()
