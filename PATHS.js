const { join } = require('path')

const PATHS = {
  COMMON: join(__dirname, 'src/common'),
  BACK: {
    BUILD: join(__dirname, 'build/back'),
    SRC: join(__dirname, 'src/back'),
  },
  FRONT: {
    BUILD: join(__dirname, 'build/front'),
    SRC: join(__dirname, 'src/front'),
  },
  SRC: join(__dirname, 'src'),
  NODE_MODULES: join(__dirname, 'node_modules'),
}

module.exports = PATHS
