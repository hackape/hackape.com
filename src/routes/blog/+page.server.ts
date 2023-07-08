import type { IPost } from "$lib/posts/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const resp = await event.fetch("/api/posts");
  const posts: IPost[] = await resp.json();
  return { posts };
};
