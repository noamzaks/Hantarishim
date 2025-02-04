import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "חנתרישים",
        short_name: "חנתרישים",
        theme_color: "#9775fa",
        background_color: "#9775fa",
        icons: [{ src: "/icon.png", sizes: "256x256", type: "image/png" }],
      },
    }),
  ],
})
