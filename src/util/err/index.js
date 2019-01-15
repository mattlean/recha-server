// @flow

const ServerErr = require('./ServerErr')

const err = {
  genErr(status?: number, message?: string) {
    let m = message
    if (!m) {
      switch (status) {
        case 404:
          m = 'Not found'
          break
        default:
          m = 'Error'
      }
    }

    return new ServerErr({ m, status })
  }
}

module.exports = err
