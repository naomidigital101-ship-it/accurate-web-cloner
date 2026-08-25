// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    cloudflare: {
      wrangler: {
        assets: {
          /**
           * בלי זה קלאודפלייר מגישה את הקבצים הסטטיים ישירות, בלי לעבור בוורקר,
           * ולכן אי אפשר להוסיף להם כותרות. קובץ _headers לא עוזר כאן כי לאבבל
           * בונה אותו מחדש בפריסה ודורסת את מה שכתבנו בו.
           *
           * רק /wp/* עובר דרך הוורקר - שם יושבות התמונות שצריכות קאשינג ארוך.
           * כל שאר הנכסים ממשיכים בדרך המהירה הרגילה.
           */
          run_worker_first: ["/wp/*"],
        },
      },
    },
  },
});
