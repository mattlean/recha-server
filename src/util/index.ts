import db = require('./db')
import err = require('./err')
import logger = require('./logger')
import model = require('./model')
import test = require('./test')

const util = {
  db,
  err,
  logger,
  model,
  test
}

export = util
