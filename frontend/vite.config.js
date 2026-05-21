import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import polyfillNode from 'rollup-plugin-polyfill-node'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  envDir: '../',
  plugins: [
    react(),
    tailwindcss(),
    polyfillNode(),
  ],
  resolve: {
    alias: {
      util: path.resolve(__dirname, 'node_modules/util/util.js'),
      'node:util': path.resolve(__dirname, 'node_modules/util/util.js'),
      buffer: path.resolve(__dirname, 'node_modules/buffer/index.js'),
      'node:buffer': path.resolve(__dirname, 'node_modules/buffer/index.js'),
      process: path.resolve(__dirname, 'node_modules/process/browser.js')
    }
  },
  optimizeDeps: {
    include: ['util', 'buffer', 'process', '@web3modal/ethers', '@web3modal/ethers/react', 'ethers'],
    rollupOptions: {
      supported: {
        bigint: true
      }
    }
  },
  define: {
    'process.env.BROWSER': 'true',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'globalThis'
  },
  build: {
    target: 'es2020',
    minify: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      plugins: [polyfillNode()],
      output: {
        manualChunks(id) {
          if (id.includes('@web3modal/ethers')) {
            return 'web3modal';
          }
          if (id.includes('ethers')) {
            return 'ethers';
          }
          if (id.includes('three') || id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
            return 'three';
          }
        }
      }
    }
  },
  server: {
    cors: true
  }
})
