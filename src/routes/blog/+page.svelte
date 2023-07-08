<script>
import { formatDate } from "$lib/utils";

/** @type {import("./$types").PageData} */
export let data;
</script>

<div class="prose m-auto dark:prose-invert">
  {#each data.posts as post}
    <div class="Post py-4">
      <div class="text-xs">{formatDate(post.publishedAt)}</div>
      <h1 class="mt-2">
        <a class="no-underline" href={`/blog/${post.slug}`}>{post.title}</a>
      </h1>
    </div>
  {/each}
</div>

<style lang="postcss">
:global(.dark) {
  a {
    color: rgb(27 235 158);
  }

  a:hover {
    @apply text-slate-900;
    background-color: rgb(27 235 158);
  }
}

a:hover {
  @apply bg-slate-200;
}

h1 {
  line-height: 1.2;
}
</style>
