import { expandGlobSync } from "https://deno.land/std@0.98.0/fs/mod.ts";
import {
  createHash,
  SupportedAlgorithm,
} from "https://deno.land/std@0.98.0/hash/mod.ts";
import {
  Destination,
  download,
  DownlodedFile,
} from "https://deno.land/x/download@v1.0.1/mod.ts";
import { exists } from "https://deno.land/std@0.98.0/fs/mod.ts";

class Image {
  remoteUrl: string;
  remoteUrlHashed: string;
  saveDir: string;
  extension: string;

  constructor(remoteUrl: string, saveDir: string) {
    this.remoteUrl = remoteUrl;
    this.remoteUrlHashed = this.hash("sha256", remoteUrl);
    this.saveDir = saveDir;
    this.extension = this.getExtension(this.remoteUrl);
  }

  hash(algorithm: SupportedAlgorithm, str: string): string {
    const hash = createHash(`${algorithm}`);
    hash.update(str);
    return hash.toString();
  }

  getExtension(filename: string) {
    return filename.split(".").pop() || "";
  }

  async download() {
    const dst: Destination = {
      file: `${this.remoteUrlHashed}.${this.extension}`,
      dir: this.saveDir,
    };

    if (await exists(`${dst.dir}/${dst.file}`)) {
      console.log(`info: skip ${this.remoteUrl}`);
      return;
    }

    try {
      const fileObj: DownlodedFile = await download(this.remoteUrl, dst);
      console.log(`info: donwload ${this.remoteUrl} to ${fileObj.fullPath}`);
    } catch (err) {
      console.log(err);
    }
  }
}

class Post {
  path: string;
  images: Array<Image>;
  imageSaveDir: string;

  constructor(path: string, imageSaveDir: string) {
    this.path = path;
    this.images = [];
    this.imageSaveDir = imageSaveDir;
  }

  async getImageUrls() {
    const markdownContent = await Deno.readTextFile(this.path);
    // https://docs.github.com/en/github/managing-your-work-on-github/file-attachments-on-issues-and-pull-requests
    const regexMarkdownImageLinks =
      /https:\/\/user-images.githubusercontent.com\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+\.(png|jpg|jpeg)/gm;
    const matches = markdownContent.match(regexMarkdownImageLinks);
    if (matches === null) return;
    for (const remoteUrl of matches) {
      const image = new Image(remoteUrl, this.imageSaveDir);
      this.images.push(image);
    }
  }
}

class Blog {
  domain: string;
  posts: Array<Post>;
  imageSaveDir: string;

  constructor(domain: string, imageSaveDir: string) {
    this.domain = domain;
    this.posts = [];
    this.imageSaveDir = imageSaveDir;
  }

  getPosts(glob: string) {
    for (const file of expandGlobSync(glob)) {
      const post = new Post(file.path, this.imageSaveDir);
      this.posts.push(post);
    }
  }
}

const blog = new Blog("peaceiris.com", "./assets/images");
await blog.getPosts("./content/**/*.md");

for await (const post of blog.posts) {
  await post.getImageUrls();
  for await (const image of post.images) {
    image.download();
  }
}
