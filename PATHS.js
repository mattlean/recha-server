const path = require('path')

const PATHS = {
  COMMON: path.join(__dirname, 'src/common'),
  BACK: {
    BUILD: path.join(__dirname, 'build/back'),
    SRC: path.join(__dirname, 'src/back'),
  },
  FRONT: {
    BUILD: path.join(__dirname, 'build/front'),
    SRC: path.join(__dirname, 'src/front'),
  },
  SRC: path.join(__dirname, 'src'),
  NODE_MODULES: path.join(__dirname, 'node_modules'),
}

module.exports = PATHS
