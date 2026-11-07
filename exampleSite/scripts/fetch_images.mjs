import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { glob, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function fetchImages({
  contentDir = './content',
  imageDir = './assets/images',
  fetchImpl = fetch,
  logger = console,
} = {}) {
  for await (const path of glob('**/*.md', { cwd: contentDir })) {
    const markdown = await readFile(join(contentDir, path), 'utf8');
    // Keep the URL matching and cache names compatible with Hugo's render hooks.
    const urls = markdown.match(/https:\/\/user-images.githubusercontent.com\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+\.(png|jpg|jpeg)/gm) ?? [];
    for (const url of urls) {
      const hash = createHash('sha256').update(url).digest('hex');
      const extension = url.split('.').pop();
      const destination = join(imageDir, `${hash}.${extension}`);
      if (existsSync(destination)) {
        logger.log(`info: skip ${url}`);
        continue;
      }
      try {
        const response = await fetchImpl(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} fetching ${url}`);
        }
        // Finish reading before writing so failed downloads do not poison the cache.
        const bytes = Buffer.from(await response.arrayBuffer());
        await mkdir(imageDir, { recursive: true });
        await writeFile(destination, bytes);
        logger.log(`info: download ${url} to ${destination}`);
      } catch (error) {
        // Remote images remain usable by Hugo when a local copy is unavailable.
        logger.error(error);
      }
    }
  }
}

if (import.meta.main) {
  await fetchImages();
}
