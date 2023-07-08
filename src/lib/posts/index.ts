import graymatter from "gray-matter";
import slugify from "slugify";
import YAML from "yaml";
import type { IDiscussion, IPost } from "./types";

export * from "./fetcher";

function parseFrontMatter(p: IDiscussion) {
  const file = graymatter(p.body);
  const data = file.data;

  let title = data.title ?? p.title;
  let slug: string = data.slug ?? slugify(title, { strict: true, lower: true });
  if (!slug) slug = "" + p.number;
  const excerpt = data.excerpt ?? file.content.split(/\r\n|\n/)[0].trim(); // 1st paragraph

  return { content: file.content, data: { ...data, title, excerpt, slug } };
}

export function processPost(p: IDiscussion): IPost {
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
