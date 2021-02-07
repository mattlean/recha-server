const merge = require('webpack-merge')
const { resolve } = require('path')
const {
  cleanOutput,
  // compileJS,
  setupDevServer,
  setMode,
} = require('ljas-webpack')
const { injectStyles } = require('ljas-webpack/style')
const { setupHTML } = require('ljas-webpack/html')
const { FRONT } = require('../../PATHS')

module.exports = () => {
  return merge([
    {
      entry: `${FRONT.SRC}/index.tsx`,
      output: {
        path: FRONT.BUILD,
      },
      resolve: {
        alias: {
          front: resolve(__dirname, '../../src/front'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },

    cleanOutput(),

    setMode('development'),

    {
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: {
              loader: 'ts-loader',
              options: { configFile: '../../tsconfig.front-dev.json' },
            },
            include: [FRONT.SRC],
          },
        ],
      },
    },

    // compileJS({
    //   test: /\.(j|t)sx?$/i,
    //   include: [FRONT.SRC],
    //   options: {
    //     presets: [
    //       '@babel/preset-typescript',
    //       ['@babel/preset-react', { development: true, runtime: 'automatic' }],
    //     ],
    //   },
    // }),

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
