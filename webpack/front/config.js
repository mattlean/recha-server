const merge = require('webpack-merge')
const { resolve } = require('path')
const { cleanOutput, setupDevServer, setMode } = require('ljas-webpack')
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
      optimization: { usedExports: true },
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
            test: /\.(j|t)sx?$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    ['@babel/preset-env', { modules: false }],
                    [
                      '@babel/preset-react',
                      { development: true, runtime: 'automatic' },
                    ],
                  ],
                },
              },
              {
                loader: 'ts-loader',
                options: { configFile: '../../tsconfig.front.json' },
              },
            ],
            include: [FRONT.SRC],
          },
        ],
      },
    },

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
