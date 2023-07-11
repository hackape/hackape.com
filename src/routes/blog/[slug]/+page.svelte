<script>
import { PUBLIC_GH_REPO, PUBLIC_GH_USERNAME } from "$env/static/public";
import Giscus from "@giscus/svelte";
import PostMeta from "./PostMeta.svelte";
// import { glitch } from '$lib/glitch';
import { darkMode } from "$lib/utils";
import { blur } from "svelte/transition";

let duration = 2000;
/** @type {import('./$types').PageData} */
export let data;
</script>

<section
  class="prose mx-auto dark:prose-invert md:my-12"
  in:blur={{ duration: 500 }}
  out:blur={{ delay: 500, duration: 1000 }}>
  <header>
    <h1 class="heading">
      <!-- <h1 class="heading" use:glitchDebug={{ duration, store: tickStore2 }}> -->
      {data.metadata.title}
    </h1>
    <PostMeta metadata={data.metadata} username={PUBLIC_GH_USERNAME} />
  </header>
  <article
    class="hover:prose-a:text-blue-600
prose-ul:list-disc
">
    <!-- transition:glitch={{ delay: 200, duration }}> -->
    {@html data.content}
  </article>

  <hr />

  <Giscus
    repo={`${PUBLIC_GH_USERNAME}/${PUBLIC_GH_REPO}`}
    repoId=""
    mapping="number"
    term={`${data.metadata.number}`}
    reactionsEnabled="1"
    emitMetadata="0"
    inputPosition="top"
    theme={$darkMode ? "transparent_dark" : "light"}
    lang="en"
    loading="lazy" />
</section>
<!-- 
<style>
article > :global(*) {
  white-space: break-spaces;
}

article :global(pre) {
  white-space: pre;
}
</style> -->
