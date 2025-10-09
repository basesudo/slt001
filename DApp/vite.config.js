import { fileURLToPath, URL } from 'node:url'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'

import postCssPxToRem from 'postcss-pxtorem'
import autoprefixer from 'autoprefixer'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { customHtmlPlugin } from './vite.html.plugin.js'
import ViteCompressionPlugin from 'vite-plugin-compression'
import legacy from '@vitejs/plugin-legacy'

export default ({ mode }) =>
  defineConfig({
    // 定义全局变量，可在代码中使用 process.env 访问
    define: {
      'process.env': process.env
    },
    // 静态资源服务的文件夹
    publicDir: 'public',
    base: '',
    // 控制台输出的级别 info、warn、error、silent
    clearScreen: true,
    // optimizeDeps: {
    //   exclude: ['buffer'] // 将 'buffer' 模块排除在外部化之外
    // },
    plugins: [
      // 使用 Vite 插件编译 Vue 单文件组件
      vue(),
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
      PkgConfig(),
      OptimizationPersist(),
      // 引入 node.js 的一些 polyfills，例如 Buffer
      nodePolyfills({ include: ['buffer'] }),
      // 使用 unplugin-vue-components 插件自动引入 Vant 组件
      Components({
        dts: true,
        resolvers: [VantResolver()]
      }),
      // 使用 unplugin-auto-import 插件自动引入一些常用库和模块
      AutoImport({ imports: ['vue', 'vue-router', 'pinia'] }),
      splitVendorChunkPlugin(),
      // 生成 HTML 插件配置
      customHtmlPlugin(mode),
      ViteCompressionPlugin({
        algorithm: 'gzip',
        // ext: '.gz',
        disable: true,
        verbose:false,
        deleteOriginFile:false
      })
    ],
    server: {
      // 是否在控制台输出服务器地址
      host: true,
      // 是否启用 https，设置为 true 则启用 http2
      https: false,
      // 是否允许跨域请求，设置为 true 允许任何源
      cors: true,
      // 启动开发服务器时自动在浏览器中打开应用
      open: false,
      // 服务运行的端口号
      port: 9000,
      // 当端口被占用时是否直接退出，设置为 true 则直接退出
      strictPort: false,
      // 热更新功能
      hmr: true
    },
    css: {
      // PostCSS 配置
      postcss: {
        plugins: [
          // 自动添加浏览器厂商前缀
          autoprefixer(),
          // 将 px 单位转换为 rem
          postCssPxToRem({
            rootValue: 37.5,
            unitToConvert: 'px',
            viewportWidth: 375,
            unitPrecision: 6,
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            exclude: [/node_modules/],
            minPixelValue: 1,
            propList: ['*'],
            selectorBlackList: ['px-'],
            mediaQuery: false,
            replace: true,
            landscape: false
          })
        ]
      }
    },
    resolve: {
      // 路径别名配置
      alias: {
        // 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js',
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    json: {
      // 是否支持从 .json 文件中进行按名导入
      namedExports: false,
      // 若设置为 true 导入的 json 会被转为 export default JSON.parse("..") 会比转译成对象字面量性能更好
      stringify: false
    },
    build: {
      // 指定输出路径
      outDir: 'dist',
      // 小于此阈值的导入或引用资源将内联为 base64 编码，避免额外的 HTTP 请求。设置为 0 可以完全禁用此项
      assetsInlineLimit: 500,
      // 启用/禁用 CSS 代码拆分
      cssCodeSplit: true,
      // 构建后是否生成 source map 文件
      sourcemap: false,
      // 构建后是否混淆代码
      minify: 'terser',
      // 传递给 Terser 的更多 minify 选项
      terserOptions: {
        mangle: true,
        toplevel: true,
        module: true,
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        format: {
          comments: false
        }
      },
      // 是否将构建后的文件写入磁盘
      write: true,
      // 构建时是否清空输出目录
      emptyOutDir: true,
      // 启用/禁用 brotli 压缩大小报告
      brotliSize: true,
      // chunk 大小警告的限制
      chunkSizeWarningLimit: 500,
      // gzip 压缩大小报告
      reportCompressedSize: false
    },
    rollupOptions: {
      // Rollup 不会将入口模块中的任何导出内容添加到相应的 chunk 中
      preserveEntrySignatures: false,
      output: {
        // 代码压缩
        minify: true,
        // 该选项用于压缩 Rollup 产生的额外代码
        compact: true,
        // Rollup 会尝试把内部变量导出为单个字母的变量
        minifyInternalExports: true,
        // 生成的代码块文件的名称
        chunkFileNames: '[name]-[hash].js',
        // 生成的资源文件的名称
        assetFileNames: 'assets/[name]-[hash][extname]',

        // 通过 manualChunks 指定哪些模块需要预加载
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // node_modules 中的依赖
            return 'vendor'
          } else if (id.includes('/src/views/')) {
            return 'views'
          }
          // 返回 null 或 undefined 表示不进行预加载
        }
      }
    }
  })
