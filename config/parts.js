const CleanWebpackPlugin = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const PATHS = require('../PATHS')

// Clean paths
exports.cleanPaths = paths => ({
  plugins: [new CleanWebpackPlugin(paths, { root: PATHS.root })]
})

// Create source maps
exports.genSourceMaps = ({ type }) => ({ devtool: type })

// Load JavaScript & TypeScript through Babel
exports.loadJS = ({ exclude, include } = {}) => ({
  module: {
    rules: [
      {
        use: 'babel-loader',
        exclude,
        include,
        test: /\.(js|ts)$/
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      }
    ]
  }
})

// Minify JavaScript
exports.minJS = () => ({
  optimization: {
    minimizer: [new TerserPlugin({ sourceMap: true })]
  }
})

// Ignore node_modules dependencies in bundling
exports.setExternals = () => ({ externals: [nodeExternals()] })

// Set free variable
exports.setFreeVariable = (key, val) => {
  const env = {}
  env[key] = JSON.stringify(val)

  return { plugins: [new webpack.DefinePlugin(env)] }
}
