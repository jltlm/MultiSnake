import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // base: "/MultiSnake/",
  plugins: [vue()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    allowedHosts: [
      "7d2b12uladuc.share.zrok.io",
      'hgwaan3k1t2v.share.zrok.io'
    ],
    cors: true,
  },
})
