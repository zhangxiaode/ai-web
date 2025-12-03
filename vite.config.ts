import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression';
import path from 'path';
import UnoCSS from "unocss/vite";

export default ({ mode }) => {
  return defineConfig({
    plugins: [
      vue(),
      viteCompression({
        verbose: true, // 默认即可
        disable: false, // 开启压缩(不禁用)，默认即可
        deleteOriginFile: false, //删除源文件
        threshold: 502400, //压缩前最小文件大小
        algorithm: 'gzip', //压缩算法
        ext: '.gz', //文件类型
      }),
      UnoCSS()
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
      terserOptions: {
        // 清除console和debugger
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
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
      https: false,
      open: false,
      hmr: true,
      proxy: {
        "/ai/apis": {
          target:  loadEnv(mode, process.cwd()).VITE_BASE_API,
          ws: false,
          changeOrigin: true,
        }
      },
    },
  })
}
