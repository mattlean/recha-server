const { compileJS, setMode } = require('ljas-webpack')
const { setupHTML } = require('ljas-webpack/html')
const { FRONT } = require('../PATHS')
const merge = require('webpack-merge')

module.exports = () => {
  return merge([
    {
      entry: `${FRONT.SRC}/index.js`,
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
        presets: [['@babel/preset-react', { development: true }]],
      },
    }),

    setupHTML({ template: 'src/front/template.ejs' }),
  ])
}
