import express from 'express'
import morgan from 'morgan'
import path from 'path'

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, '../front')))

app.use(morgan('dev'))

app.get('/hello-world', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
