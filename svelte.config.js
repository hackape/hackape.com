// @ts-check
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";
import { mdsvex } from "mdsvex";
import remarkAbbr from "remark-abbr";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/**
 * https://mdsvex.pngwn.io/docs
 * @type {object}
 */
const mdsvexConfig = {
  extensions: [".svelte.md", ".md", ".svx"],
  smartypants: false,
  remarkPlugins: [
    // https://github.com/zestedesavoir/zmarkdown/tree/HEAD/packages/remark-abbr#readme
    // convert `*[ABBR]: Explanation goes here` to `<abbr>` html tag
    remarkAbbr,
  ],
  rehypePlugins: [
    // https://github.com/rehypejs/rehype-slug
    // add slug id to `<h1>`...`<h5>`
    rehypeSlug,
    // https://github.com/rehypejs/rehype-autolink-headings
    // also add wrap heading into link
    () => rehypeAutolinkHeadings({ behavior: "wrap" }),
  ],
};

/**
 * https://kit.svelte.dev/docs/configuration
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
  },
};

export default config;
