const { compileJS, setMode } = require('ljas-webpack')
const { injectStyles } = require('ljas-webpack/style')
const { setupHTML } = require('ljas-webpack/html')
const { FRONT } = require('../PATHS')
const merge = require('webpack-merge')

module.exports = () => {
  return merge([
    {
      entry: `${FRONT.SRC}/index.jsx`,
      output: {
        path: FRONT.BUILD,
      },
      resolve: {
        extensions: ['.js', '.jsx'],
      },
    },

    setMode('development'),

    compileJS({
      include: [FRONT.SRC],
      options: {
        presets: [
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
