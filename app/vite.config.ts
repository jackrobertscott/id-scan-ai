import ViteReact from "@vitejs/plugin-react"
import {resolve} from "path"
import {defineConfig} from "vite"
import {VitePWA} from "vite-plugin-pwa"

export default defineConfig({
  root: resolve(import.meta.dirname, "."),
  build: {outDir: "build/browser"}, // relative to "root"
  esbuild: {legalComments: "none"}, // hide comments in the output
  server: {port: 3000},
  plugins: [
    ViteReact({
      babel: {
        // ... babel plugin npm package currently broken ...
        // plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "ID Scan AI",
        short_name: "ID Scan AI",
        theme_color: "hsl(0, 0%, 50%)",
        background_color: "hsl(0, 0%, 50%)",
        display: "standalone",
        icons: [
          {
            src: "/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
})
