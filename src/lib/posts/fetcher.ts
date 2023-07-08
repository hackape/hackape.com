import { PUBLIC_GH_USERNAME, PUBLIC_GH_REPO } from "$env/static/public";
import { GH_TOKEN } from "$env/static/private";
import type { IDiscussion, IDiscussions } from "./types";

export async function fetchDiscussions(after?: string): Promise<IDiscussions> {
  const _after = after ? `after: "${after}",` : "";
  return (
    await fetchData(`{
  repository(owner: "${PUBLIC_GH_USERNAME}", name: "${PUBLIC_GH_REPO}") {
    discussions(first: 100, ${_after} orderBy: { field: CREATED_AT, direction: DESC }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        number
        title
        createdAt
        publishedAt
        lastEditedAt
        url
        body
        category {
          name
        }
        labels(first: 100) {
          nodes {
            name
            color
          }
        }
      }
    }
  }
}`)
  ).repository.discussions;
}

export async function fetchAllDiscussions() {
  let endCursor: string | undefined = undefined;
  let list: IDiscussion[] = [];
  while (true) {
    const { nodes, pageInfo } = await fetchDiscussions(endCursor);
    list = list.concat(nodes);
    if (!pageInfo.hasNextPage) break;
    endCursor = pageInfo.endCursor;
  }
  return list;
}

async function fetchData(query: string) {
  const resp = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${GH_TOKEN}` },
    body: JSON.stringify({ query }),
  });
  /** @type {any} */
  const json = await resp.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}
