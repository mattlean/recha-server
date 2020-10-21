import express from 'express'
import morgan from 'morgan'
import path from 'path'

const initApp = () => {
  console.log('Server initialized')

  const app = express()

  app.use(express.static(path.join(__dirname, '../front')))

  app.use(morgan('dev'))

  app.get('/hello-world', (req, res) => {
    res.send('Hello World!')
  })

  return app
}

export default initApp
