import { Router } from 'express'
import goals from './goals'

const r = Router()

r.use('/goals', goals)

export default r
