// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

declare module "~icons/*" {
  import { SvelteComponent } from "svelte";
  import { SvelteHTMLElements } from "svelte/elements";
  export default class extends SvelteComponent<SvelteHTMLElements["svg"]> {}
}

export {};
