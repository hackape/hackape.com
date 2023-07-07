import { type Writable, writable, derived } from "svelte/store";

function createDarkModeStore() {
  const hasSavedTheme = () => "theme" in window.localStorage;

  const mediaQueryDarkModeStore = writable(false, (set) => {
    const onPreferenceChange = (ev: { matches: boolean }) => {
      const preferDarkMode = ev.matches;
      if (hasSavedTheme()) {
        if (window.localStorage.theme === "dark") {
          set(true);
        } else {
          set(false);
        }
      } else {
        set(preferDarkMode);
      }
    };

    if (typeof window !== "undefined") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", onPreferenceChange);
      onPreferenceChange(mql);

      return () => {
        mql.removeEventListener("change", onPreferenceChange);
      };
    } else {
      return () => {};
    }
  });

  const darkClassSettingSideEffectStore = derived(
    mediaQueryDarkModeStore,
    (darkMode, set) => {
      if (typeof document !== "undefined") {
        if (darkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      set(darkMode);
    },
    false
  );

  const set = (enableDarkMode: boolean) => {
    if (enableDarkMode) {
      localStorage.theme = "dark";
    } else {
      localStorage.theme = "light";
    }
    mediaQueryDarkModeStore.set(enableDarkMode);
  };

  const darkMode: Writable<boolean> = {
    set,
    update: mediaQueryDarkModeStore.update,
    subscribe: darkClassSettingSideEffectStore.subscribe,
  };

  return darkMode;
}

export const darkMode = createDarkModeStore();

const formatter = Intl.DateTimeFormat("zh", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h24",
  minute: "2-digit",
});

export function formatDate(dateString: string, withTime = false) {
  const parts = formatter.formatToParts(new Date(dateString));
  const entries = parts.map((p) => [p.type, p.value]);
  const { year, month, day, hour, minute } = Object.fromEntries(entries);
  return withTime ? `${year}-${month}-${day} ${hour}:${minute}` : `${year}-${month}-${day}`;
}
