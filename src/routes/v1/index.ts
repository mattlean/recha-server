import { Router } from 'express'

import users from './users'
import { API } from '../../config'

const router = Router()

router.use('/users', users)

router.get('/', (req, res) =>
  res.json({
    API: API.NAME,
    ENV: process.env.NODE_ENV,
    VER: API.VERS.V1.NUM
  })
)

export default router
