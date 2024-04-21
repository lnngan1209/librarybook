import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  buildModules: [
    '@ant-design-vue/nuxt'
  ],

  antd: {
    // Sử dụng toàn bộ các component của Ant Design Vue
    // Không cần cấu hình thêm cho component cụ thể
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    }
  },
})
