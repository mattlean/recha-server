import { Router } from 'express'

import { createTodo, deleteTodo, getTodoById, getTodos, patchTodo } from '../../util/db/todos'
import { formatAPIRes } from '../../util'
import { genErr } from '../../util/err'
import { db } from '../../app'
import { TYPE } from '../../types/Todo'

const router = Router()

router.get('/', (req, res, next) => {
  const { col, date, dir } = req.query
  return getTodos(db, date, col, dir)
    .then(result => {
      res.locals.result = result
      return next()
    })
    .catch(err => next(err))
})

router.get('/:id', (req, res, next) =>
  getTodoById(db, req.params.id)
    .then(result => {
      res.locals.result = result
      return next()
    })
    .catch(err => next(err))
)

router.post('/', (req, res, next) => {
  const { completed_at, date, details, name, order_num } = req.body
  return createTodo(db, { completed_at, date, details, name, order_num })
    .then(result => {
      res.status(201)
      res.locals.result = result
      return next()
    })
    .catch(err => next(err))
})

router.patch('/:id', (req, res, next) => {
  const { completed_at, date, details, name, order_num } = req.body
  return patchTodo(db, req.params.id, { completed_at, date, details, name, order_num })
    .then(result => {
      res.locals.result = result
      return next()
    })
    .catch(err => next(err))
})

router.delete('/:id', (req, res, next) =>
  deleteTodo(db, req.params.id)
    .then(result => {
      res.locals.result = result
      return next()
    })
    .catch(err => next(err))
)

router.use((req, res, next) => {
  const allowedMethods = ['GET', 'DELETE', 'PATCH', 'POST']
  if (allowedMethods.indexOf(req.method) > -1 && res.locals.result) {
    return res.json(formatAPIRes(res.locals.result, TYPE))
  }
  return next(genErr(404))
})

export default router
