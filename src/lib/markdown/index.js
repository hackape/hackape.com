import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import extractFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import { codeHighlighter } from "./plugins.js";
import rehypeStringify from "rehype-stringify";
import YAML from "yaml";

/**
 * @param {string} content
 * @returns {Promise<import("unified").VFileWithOutput<any>>}
 */
export async function renderMarkdown(content) {
  const toMDAST = unified()
    .use(remarkParse)
    .use(extractFrontmatter, [{ type: "yaml", marker: "-" }])
    .use(parseFrontmatter);

  const toHAST = toMDAST()
    .use(
      remarkRehype,
      // @ts-ignore
      {
        allowDangerousHtml: true,
        allowDangerousCharacters: true,
      }
    )
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(codeHighlighter, { theme: "css-variables" })
    .use(
      rehypeStringify,
      // @ts-ignore
      {
        allowDangerousHtml: true,
        allowDangerousCharacters: true,
      }
    );

  return toHAST.process(content);
}

function parseFrontmatter() {
  // @ts-ignore
  function transformer(tree, vFile) {
    visit(tree, "yaml", (node) => {
      const data = YAML.parse(node.value);
      if (data) {
        // @ts-ignore
        vFile.data.frontmatter = data;
      }
    });
  }

  return transformer;
}

// renderMarkdown(`
// \`\`\`js
// web3.eth.getBlock(48, function (error, result) {
//   if (!error) console.log(result);
//   else console.error(error);
// });
// \`\`\`
// `).then((result) => {
//   console.log(result);
// });
