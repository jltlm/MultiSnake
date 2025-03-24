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
      "https://ec2-34-238-49-255.compute-1.amazonaws.com/",
      "l32yyy3u94ug.share.zrok.io"
    ],
    cors: true,
    // proxy: {
    //   '/socket.io': {
    //     target: 'https://zy5cffzl17uv.share.zrok.io',
    //     ws: true
    //   }
    // }
  },
})
