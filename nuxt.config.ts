const wasmHeader = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/color-mode"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  routeRules: {
    "/playground": {
      headers: wasmHeader,
    },
  },

  vite: {
    server: {
      headers: wasmHeader,
    },

    optimizeDeps: {
      exclude: ["@sqlite.org/sqlite-wasm"],
    },
  },
});
