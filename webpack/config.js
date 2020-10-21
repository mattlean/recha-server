const { compileJS, setMode } = require('ljas-webpack')
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

    setupHTML({ template: 'src/front/template.ejs' }),
  ])
}
