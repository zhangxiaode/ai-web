import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import gzip from 'rollup-plugin-gzip';
import path from 'path';
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from "unocss/vite";

export default ({ mode }) => {
  return defineConfig({
    plugins: [
      vue(),
      AutoImport({
        imports: [
          "vue",
          {"vue-router": ["createRouter", "createWebHistory", "useRouter", "useRoute", "onBeforeRouteLeave", "onBeforeRouteUpdate"]},
          {"pinia": ["defineStore", "createPinia"]},
          {"naive-ui": ["useMessage", "useDialog"]},
          {
            "@/utils/request": [["default", "request"]],
            // "@/common/loading": [["default", "$loading"]],
            // "@/common/message": [["default", "$message"]],
            // "@/common/messageBox": [["confirm", "$confirm"]],
            // "@/common/permission/index": [["default", "$permission"]],
          },
        ],
        resolvers: [NaiveUiResolver()],
        dts: true,
      }),
      Components({
        resolvers: [NaiveUiResolver()],
        dts: true,
      }),
      UnoCSS(),
      gzip()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    build: {
      target: 'es2020',
      assetsDir: 'static',
      minify: 'terser', // 开启压缩
      sourcemap: false, // 不生成 sourceMap 文件
      chunkSizeWarningLimit: 1500, // 打包文件大小超过150k报警
      rollupOptions: {
        treeshake: true, // 开启 Tree Shaking，消除未使用的代码，减小最终的包大小
        input: {
          index: path.resolve(__dirname, "index.html")
        },
        output: {
          chunkFileNames: 'static/js/[hash].js',
          entryFileNames: 'static/js/[hash].js',
          assetFileNames: 'static/[ext]/[hash].[ext]',
          manualChunks(id) {
            if(id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: 8888,
      open: false,
      hmr: true,
      proxy: {
        "/ai/apis": {
          target: loadEnv(mode, process.cwd()).VITE_BASE_API,
          ws: false,
          changeOrigin: true,
        }
      },
    },
  })
}
