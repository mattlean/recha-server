import express, { Express } from 'express'
import morgan from 'morgan'
import path from 'path'

/**
 * Initialize Recha server app
 */
export const initApp = (): Express => {
  const app = express()

  app.use(express.static(path.join(__dirname, '../front')))

  app.use(morgan('dev'))

  app.get('/hello-world', (req, res) => {
    res.send('Hello World!')
  })

  return app
}
