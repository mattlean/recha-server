import bodyParser from 'body-parser'
import { Router } from 'express'
import v1 from './v1'

const r = Router()
const jsonParser = bodyParser.json()

r.use('/v1', jsonParser, v1)

export default r
