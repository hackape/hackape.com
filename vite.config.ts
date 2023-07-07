import type { UserConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import unpluginIcons from "unplugin-icons/vite";

const config: UserConfig = {
  plugins: [
    sveltekit(),
    unpluginIcons({
      compiler: "svelte",
      autoInstall: true,
    }),
  ],
};

export default config;
