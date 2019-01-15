// @flow

let config = {
  PORT: 3000,
  DB_URI: 'mongodb://localhost/recha',
  CLIENT: null
}

if (process.env.NODE_ENV) {
  config = {
    ...config,
    ...require(`./${process.env.NODE_ENV}`) // eslint-disable-line global-require, import/no-dynamic-require
  }
}

module.exports = config
