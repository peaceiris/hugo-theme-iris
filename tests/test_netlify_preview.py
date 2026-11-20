from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import stat
import tempfile
import unittest
from unittest.mock import patch
import warnings
import zipfile


spec = spec_from_file_location(
  'extract_netlify_preview',
  Path(__file__).resolve().parents[1] / 'scripts' / 'extract-netlify-preview.py',
)
preview = module_from_spec(spec)
spec.loader.exec_module(preview)


class ExtractNetlifyPreviewTest(unittest.TestCase):
  def setUp(self):
    work = tempfile.TemporaryDirectory()
    self.addCleanup(work.cleanup)
    self.archive = Path(work.name) / 'artifact.zip'
    self.output = Path(work.name) / 'site'

  def make_archive(self, entries=()):
    with zipfile.ZipFile(self.archive, 'w', zipfile.ZIP_DEFLATED) as zipped:
      zipped.writestr('index.html', '<h1>Preview</h1>')
      for name, data in entries:
        zipped.writestr(name, data)

  def assert_rejected(self):
    with self.assertRaises(ValueError):
      preview.extract(self.archive, self.output)
    self.assertFalse(self.output.exists())

  def test_static_files_and_directories(self):
    self.make_archive([('css/', b''), ('css/main.css', b'body{}'),
                       ('posts/literal:colon/index.html', b'')])
    preview.extract(self.archive, self.output)
    self.assertEqual((self.output / 'css/main.css').read_bytes(), b'body{}')
    self.assertTrue((self.output / 'index.html').is_file())
    self.assertTrue((self.output / 'posts/literal:colon/index.html').is_file())

  def test_rejects_ambiguous_or_unsafe_path(self):
    for path in ('/x.html', '../x.html', 'css/../x.html', 'css\\x.html',
                 'css//x.html', 'css/./x.html', 'C:/x.html', '.hidden/x.html',
                 'dir./x.html', 'dir//', './'):
      with self.subTest(path=path):
        self.make_archive([(path, b'')])
        self.assert_rejected()

  def test_rejects_netlify_controls_and_nonstatic_files(self):
    for path in ('netlify.toml', '_headers', '_redirects', '.netlify/index.html',
                 'functions/x.js', '_edge-functions/x.js', 'package.sh'):
      with self.subTest(path=path):
        self.make_archive([(path, b'')])
        self.assert_rejected()

  def test_rejects_nonregular_entries(self):
    for kind in (stat.S_IFLNK, stat.S_IFIFO, stat.S_IFCHR):
      with self.subTest(kind=kind):
        entry = zipfile.ZipInfo('asset.js')
        entry.create_system = 3
        entry.external_attr = (kind | 0o777) << 16
        self.make_archive([(entry, b'index.html')])
        self.assert_rejected()

  def test_rejects_duplicate_and_conflicting_paths(self):
    for paths in (('index.html',), ('INDEX.HTML',), ('Dir/x.css', 'dir/y.css'),
                  ('x.html/y.css', 'x.html'), ('css/', 'css/')):
      with self.subTest(paths=paths), warnings.catch_warnings():
        warnings.simplefilter('ignore', UserWarning)
        self.make_archive([(path, b'') for path in paths])
        self.assert_rejected()

  def test_rejects_size_and_entry_limits(self):
    self.make_archive([('asset.css', b'a' * 1024)])
    for limit, value in (('MAX_FILE', 100), ('MAX_TOTAL', 1024),
                         ('MAX_ARCHIVE', 100), ('MAX_ENTRIES', 1)):
      with self.subTest(limit=limit), patch.object(preview, limit, value):
        self.assert_rejected()

  def test_rejects_nonfresh_output(self):
    self.make_archive()
    self.output.mkdir()
    with self.assertRaises(FileExistsError):
      preview.extract(self.archive, self.output)
    self.assertEqual(list(self.output.iterdir()), [])

  def test_requires_root_index(self):
    with zipfile.ZipFile(self.archive, 'w') as zipped:
      zipped.writestr('nested/index.html', 'Preview')
    self.assert_rejected()


if __name__ == '__main__':
  unittest.main()
