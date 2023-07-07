// @ts-check
/// <reference path="types.d.ts" />
import dotenv from "dotenv";
import path from "path";
import { mkdir, existsSync, promises as fsp } from "fs";
import graymatter from "gray-matter";
import slugify from "slugify";
import YAML from "yaml";
import { fetchAllDiscussions } from "./fetcher.js";

dotenv.config();

console.log(`
😎 https://github.com/${process.env.PUBLIC_GH_USERNAME}/${process.env.PUBLIC_GH_REPO}
🔑 Detect GH_TOKEN: ${Boolean(process.env.GH_TOKEN)}
`);

if (!process.env.PUBLIC_GH_USERNAME || !process.env.PUBLIC_GH_REPO || !process.env.GH_TOKEN) {
  throw Error("Missing env vars. PUBLIC_GH_USERNAME, PUBLIC_GH_REPO and GH_TOKEN are required");
}

/** @param {{ title: string; body: string }} p  */
function parseFrontMatter({ title, body }) {
  const file = graymatter(body);
  const data = file.data;
  title = data.title ?? title;
  const slug = data.slug ?? slugify(title, { strict: true, lower: true });
  const excerpt = data.excerpt ?? file.content.split(/\r\n|\n/)[0].trim(); // 1st paragraph
  return { content: file.content, data: { ...data, title, excerpt, slug } };
}

/**
 * @param {IDiscussion} p
 * @returns {IPost}
 */
function processPost(p) {
  const { content, data } = parseFrontMatter(p);
  const frontMatter = {
    number: p.number,
    // @ts-ignore
    title: p.title,
    publishedAt: p.publishedAt,
    updatedAt: p.lastEditedAt,
    url: p.url,
    labels: p.labels.nodes,
    ...data,
  };
  const frontMatterText = `---\n${YAML.stringify(frontMatter)}---\n`;
  return { ...frontMatter, body: `${frontMatterText}${content}` };
}

const postsDir = path.join(process.cwd(), "__posts");
if (!existsSync(postsDir)) {
  mkdir(postsDir, { recursive: true }, (err) => console.error(err));
}

/**
 * @param {IPost[]} posts
 * @returns
 */
function writePosts(posts) {
  const manifestJson = JSON.stringify(
    posts.map(({ title, slug, excerpt, publishedAt }) => ({ title, slug, excerpt, publishedAt })),
    null,
    2
  );
  return Promise.all(
    posts
      .map((p) => fsp.writeFile(path.resolve(postsDir, `${p.slug}.md`), p.body))
      .concat(fsp.writeFile(path.resolve(postsDir, "manifest.json"), manifestJson))
  );
}

async function main() {
  const list = await fetchAllDiscussions();
  const posts = list.filter((p) => p.category.name == "Post").map(processPost);
  await writePosts(posts);
  console.log(`🎉  Download ${posts.length} posts`);
}

main();
