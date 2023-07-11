/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 * @typedef {Root|Root['children'][number]} Node
 */

import shiki from "shiki";
import { visit } from "unist-util-visit";
import { u } from "unist-builder";

/**
 * @param {{theme:string}} options
 */
export function codeHighlighter(options) {
  var settings = options || {};
  var theme = settings.theme || "nord";

  /**
   * @type {import("shiki").Highlighter}
   */
  var highlighter;

  return transformer;

  /**
   * @param {Node} tree
   */
  async function transformer(tree) {
    highlighter = await shiki.getHighlighter({
      theme: theme,
    });
    visit(tree, "element", visitor);
  }

  /**
   * @param {Element} node
   * @param {number|undefined} index
   * @param {any} parent
   */
  function visitor(node, index, parent) {
    if (!parent || parent.tagName !== "pre" || node.tagName !== "code") {
      return;
    }

    const shikiTheme = highlighter.getTheme(theme);
    addStyle(parent, "background: " + shikiTheme.bg);

    const lang = codeLanguage(node);

    const lines = highlighter.codeToThemedTokens(hastToString(node), lang);
    const tree = tokensToHast(lines);

    node.children = tree;
  }
}

/**
 * @param {shiki.IThemedToken[][]} lines
 */
function tokensToHast(lines) {
  let tree = [];

  for (const line of lines) {
    if (line.length === 0) {
      tree.push(u("text", "\n"));
    } else {
      for (const token of line) {
        tree.push(
          u(
            "element",
            {
              tagName: "span",
              properties: { style: "color: " + token.color },
            },
            [u("text", token.content)]
          )
        );
      }

      tree.push(u("text", "\n"));
    }
  }

  // Remove the last \n
  tree.pop();

  return tree;
}

/**
 * @param {Element} node
 * @param {string} style
 */
function addStyle(node, style) {
  var props = node.properties || {};
  var styles = props.style || [];
  // @ts-ignore
  styles.push(style);
  props.style = styles;
  node.properties = props;
}

/**
 * @param {Element} node
 */
function codeLanguage(node) {
  const className = node.properties.className || [];
  var value;

  // @ts-ignore
  for (const element of className) {
    value = element;

    if (value.slice(0, 9) === "language-") {
      return value.slice(9);
    }
  }

  return null;
}

/**
 * Get the plain-text value of a hast node.
 *
 * @param {Node} node
 * @returns {string}
 */
function hastToString(node) {
  // “The concatenation of data of all the Text node descendants of the context
  // object, in tree order.”
  if ("children" in node) {
    return all(node);
  }

  // “Context object’s data.”
  return "value" in node ? node.value : "";
}

/**
 * @param {Node} node
 * @returns {string}
 */
function one(node) {
  if (node.type === "text") {
    return node.value;
  }

  return "children" in node ? all(node) : "";
}

/**
 * @param {Root|Element} node
 * @returns {string}
 */
function all(node) {
  let index = -1;
  /** @type {string[]} */
  const result = [];

  while (++index < node.children.length) {
    result[index] = one(node.children[index]);
  }

  return result.join("");
}
