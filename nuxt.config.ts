// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/color-mode"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  colorMode: {
    classSuffix: "",
  },
});
