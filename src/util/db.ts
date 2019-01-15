import mongoose = require('mongoose')

import logger = require('./logger')

const db = {
  connect(uri: string) {
    return mongoose
      .connect(
        uri,
        { useNewUrlParser: true }
      )
      .then(() => {
        const successMsg = `Connected to database: ${uri}`
        logger.info(successMsg)
        return successMsg
      })
      .catch(err => logger.error(err))
  },

  disconnect(successMsg: string = 'Disconnected from database') {
    return mongoose
      .disconnect()
      .then(() => {
        logger.info(successMsg)
        return successMsg
      })
      .catch(err => logger.error(err))
  }
}

export = db
