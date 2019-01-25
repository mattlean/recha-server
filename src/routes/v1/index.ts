import { Router } from 'express'

import todos from './todos'
import { API } from '../../config'
import { genApiData } from '../../util'

const router = Router()

router.use('/todos', todos)

router.get('/', (req, res) => res.json(genApiData(API.VERS.V1.NUM)))

export default router
