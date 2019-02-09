import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import { json } from 'body-parser'
import 'source-map-support/register'

import { API, CLIENT, DB } from './config'
import { createDB } from './util/db'
import { genApiData, logger } from './util'
import { genErr, genErrRes } from './util/err'
import routeV1 from './routes/v1'

const app = express()

app.use(helmet())
app.use(compression())
app.use(json())

/* Logging middleware */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`)
    next()
  })
}

/* CORS setup */
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

/* Not found handler */
app.use((req, res, next) => next(genErr(404))) // eslint-disable-line no-unused-vars

/* Error handler */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    let errMessage = ''
    if (err.code) errMessage += `CODE: ${err.code} - `
    errMessage += err.stack
    logger.error(errMessage)
  }

  const errRes = genErrRes(err)
  res.status(errRes.data.statusCode).json(errRes)
})

export default app

export const db = (() => {
  if (process.env.NODE_ENV !== 'test') {
    logger.info(`Database: ${DB.HOST}:${DB.PORT}/${DB.NAME}`)
  }
  return createDB(DB, app)
})()
