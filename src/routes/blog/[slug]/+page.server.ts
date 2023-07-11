import { renderMarkdown } from "$lib/markdown";
import type { IPost } from "$lib/posts/types";
import type { PageServerLoad } from "./$types";

// const posts = import.meta.glob("/__posts/*.md");

// export const load2: PageServerLoad = async ({ params }) => {
//   const key = "/__posts/*.md".replace("*", params.slug);
//   const loader = posts[key];
//   if (!loader) return {};

//   const { metadata, default: component } = (await loader()) as {
//     metadata: any;
//     default: { $$render(): string };
//   };

//   return {
//     metadata,
//     content: component.$$render(),
//   };
// };

export const load: PageServerLoad = async (event) => {
  const resp = await event.fetch("/api/posts");
  const posts: IPost[] = await resp.json();
  const post = posts.find((p) => p.slug === event.params.slug)!;

  const vFile = await renderMarkdown(post.body);
  const metadata = { ...post, body: "" };
  const content = vFile.value;

  return { metadata, content };
};

export const prerender = true;
