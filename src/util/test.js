// @flow

const logger = require('./logger')

const test = {
  clearDBCollection(model: string) {
    const Model = require(`../models/${model}`) // eslint-disable-line global-require, import/no-dynamic-require

    return Model.remove({})
      .exec()
      .catch(err => logger.error(err))
  }
}

module.exports = test
