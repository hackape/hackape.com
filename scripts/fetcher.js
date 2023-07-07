// @ts-check
/// <reference path="types.d.ts" />
import { fetch } from "undici";
/**
 * @param {string} [after]
 * @returns {Promise<IDiscussions>}
 */
export async function fetchDiscussions(after) {
  const _after = after ? `after: "${after}",` : "";
  return (
    await fetchData(gql`{
  repository(owner: "${process.env.PUBLIC_GH_USERNAME}", name: "${process.env.PUBLIC_GH_REPO}") {
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
  let endCursor;
  let list = [];
  while (true) {
    const { nodes, pageInfo } = await fetchDiscussions(endCursor);
    list = list.concat(nodes);
    if (!pageInfo.hasNextPage) break;
    endCursor = pageInfo.endCursor;
  }
  return list;
}

function gql(tmpl, ...args) {
  return tmpl.reduce((acc, s, i) => acc + args[i - 1] + s);
}

async function fetchData(query) {
  const resp = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${process.env.GH_TOKEN}` },
    body: JSON.stringify({ query }),
  });
  /** @type {any} */
  const json = await resp.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}
