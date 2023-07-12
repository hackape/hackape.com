import { fetchAllDiscussions, processPost } from "$lib/posts";
import { json } from "@sveltejs/kit";

export async function GET() {
  const list = await fetchAllDiscussions();
  const posts = list.filter((p) => p.category.name == "Posts").map(processPost);
  return json(posts);
}

export const prerender = true;
