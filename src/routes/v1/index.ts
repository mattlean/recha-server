import { Router } from 'express'

import users from './users'
import { API } from '../../config'
import { genApiData } from '../../util'

const router = Router()

router.use('/users', users)

router.get('/', (req, res) => res.json(genApiData(API.VERS.V1.NUM)))

export default router
