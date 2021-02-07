const merge = require('webpack-merge')
const { resolve } = require('path')
const {
  cleanOutput,
  genSourceMaps,
  ignoreNodeModules,
  setMode,
} = require('ljas-webpack')
const { BACK } = require('../../PATHS')

module.exports = () => {
  return merge([
    {
      entry: `${BACK.SRC}/index.ts`,
      node: {
        __dirname: false,
      },
      output: {
        path: BACK.BUILD,
      },
      resolve: {
        alias: {
          back: resolve(__dirname, '../../src/back'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      target: 'node',
    },

    cleanOutput(),

    genSourceMaps('inline-source-map'),

    ignoreNodeModules(),

    setMode('development'),

    {
      module: {
        rules: [
          {
            test: /\.(j|t)sx?$/,
            use: {
              loader: 'ts-loader',
              options: { configFile: '../../tsconfig.back.json' },
            },
            include: [BACK.SRC],
            exclude: /node_modules/,
          },
        ],
      },
    },
  ])
}
