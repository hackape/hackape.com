<script>
import "../styles.css";
import AppHeader from "$components/AppHeader.svelte";
</script>

<div
  class="AppContainer min-h-screen bg-gray-50 p-8 transition-colors duration-500 dark:bg-slate-900">
  <AppHeader />
  <slot />
</div>
