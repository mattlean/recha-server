import { Router } from 'express'

import { applyDefaultProps } from '../../util/db'
import { createTodo, deleteTodo, getTodoById, getTodos, patchTodo } from '../../util/db/todos'
import { db } from '../../app'
import { TYPE } from '../../types/Todo'

const router = Router()

router.get('/', (req, res, next) => {
  const { col, date, dir } = req.query

  return getTodos(db, date, col, dir)
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

router.get('/:id', (req, res, next) =>
  getTodoById(db, req.params.id)
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
)

router.post('/', (req, res, next) => {
  const { completed_at, date, details, name, order_num } = req.body
  createTodo(db, { completed_at, date, details, name, order_num })
    .then(result => res.status(201).json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

router.patch('/:id', (req, res, next) => {
  const { completed_at, date, details, name, order_num } = req.body
  patchTodo(db, req.params.id, { completed_at, date, details, name, order_num })
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

router.delete('/:id', (req, res, next) => {
  deleteTodo(db, req.params.id)
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

export default router
