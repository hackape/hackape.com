<script lang="ts">
import { darkMode } from "$lib/utils";

function toggleDarkMode() {
  $darkMode = !$darkMode;
}
</script>

<header class="mb-8 flex items-center dark:text-white">
  <div>
    <a href="/blog">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
        ><path
          fill="currentColor"
          d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z" /></svg>
    </a>
  </div>
  <div class="ml-auto">
    <button class="DarkModeButton" on:click={toggleDarkMode}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
        ><g fill="currentColor"
          ><path d="M12 16a4 4 0 0 0 0-8v8Z" /><path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2Zm0 2v4a4 4 0 1 0 0 8v4a8 8 0 1 0 0-16Z"
            clip-rule="evenodd" /></g
        ></svg>
    </button>
  </div>
</header>

<style lang="postcss">
header {
  font-size: 2em;
}

button,
a {
  cursor: pointer;
  display: block;
  padding: 0.25em;
  border-radius: 100%;
  transition-duration: 150ms;
  transition-property: color, background-color, opacity;
  @apply hover/:bg-slate-200;
}

:global(.dark) {
  button,
  a {
    @apply hover/:bg-slate-700;
  }
}
</style>
