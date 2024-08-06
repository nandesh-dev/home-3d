import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/home-3d.js',
    format: 'cjs',
  },
  plugins: [nodeResolve()],
}
