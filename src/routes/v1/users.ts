import { Router } from 'express'

import { pool } from '../../app'
import { applyDefaultProps, createUser, deleteUser, getUserById, getUsers, updateUser } from '../../util/db'

const router = Router()

const TYPE = 'User'

router.get('/', (req, res, next) =>
  getUsers(pool)
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
)

router.get('/:id', (req, res, next) =>
  getUserById(pool, req.params.id)
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
)

router.post('/', (req, res, next) => {
  const { email, name } = req.body
  createUser(pool, { email, name })
    .then(result => res.status(201).json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

router.put('/:id', (req, res, next) => {
  const { email, name } = req.body
  updateUser(pool, req.params.id, { email, name })
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

router.delete('/:id', (req, res, next) => {
  deleteUser(pool, req.params.id)
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

export default router
