const {
  cleanOutput,
  compileJS,
  setupDevServer,
  setMode,
} = require('ljas-webpack')
const { injectStyles } = require('ljas-webpack/style')
const { setupHTML } = require('ljas-webpack/html')
const { FRONT } = require('../PATHS')
const merge = require('webpack-merge')

module.exports = () => {
  return merge([
    {
      entry: `${FRONT.SRC}/index.tsx`,
      output: {
        path: FRONT.BUILD,
      },
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },

    cleanOutput(),

    setMode('development'),

    compileJS({
      test: /\.(j|t)sx?$/i,
      include: [FRONT.SRC],
      options: {
        presets: [
          '@babel/preset-typescript',
          ['@babel/preset-react', { development: true, runtime: 'automatic' }],
        ],
      },
    }),

    injectStyles({
      cssLoaderOptions: { sourceMap: true },
      sassLoaderOptions: { sourceMap: true },
    }),

    setupDevServer({
      host: process.env.HOST,
      port: 9489,
      historyApiFallback: true,
    }),

    setupHTML({ template: 'src/front/template.ejs' }),
  ])
}
