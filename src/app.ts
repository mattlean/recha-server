import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import { json } from 'body-parser'
import 'source-map-support/register'

import { API, CLIENT, DB } from './config'
import { createPool } from './util/db'
import { genApiData, logger } from './util'
import routeV1 from './routes/v1'

const app = express()

app.use(helmet())
app.use(compression())
app.use(json())

// logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`)
    next()
  })
}

// CORS setup
if (CLIENT) {
  // eslint-disable-next-line no-unused-vars
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', CLIENT)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'POST,PUT')
      return res.status(200).json({})
    }
    return next()
  })
}

app.get('/', (req, res) => res.json(genApiData()))

app.use(`${API.VERS.V1.PATH}`, routeV1)

// 404
app.use((req, res, next) => res.status(404).send('Not found')) // eslint-disable-line no-unused-vars

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err.stack)

  const status = err.status || 500

  let message
  if (status === 500) {
    message = 'Something broke! :('
  } else {
    ;({ message } = err)
  }

  res.status(status).send(message)
})

export default app

export const pool = (() => {
  logger.info(`Database: ${DB.HOST}:${DB.PORT}/${DB.NAME}`)
  return createPool(DB, app)
})()
