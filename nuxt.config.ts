// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    esbuild: {
      options: {
        target: "esnext",
        tsconfigRaw: {
          // See https://github.com/nuxt/nuxt/issues/14126
          compilerOptions: {
            experimentalDecorators: true,
          },
        },
      },
    },
  },
});
