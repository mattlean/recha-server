import { Router } from 'express'

import { applyDefaultProps } from '../../util/db'
import { completeTodo, createTodo, deleteTodo, getTodoById, getTodos, updateTodoInfo } from '../../util/db/todos'
import { pool } from '../../app'
import { TYPE } from '../../types/Todo'

const router = Router()

router.get('/', (req, res, next) =>
  getTodos(pool)
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
)

router.get('/:id', (req, res, next) =>
  getTodoById(pool, req.params.id)
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
)

router.post('/', (req, res, next) => {
  const { date, name, details } = req.body
  createTodo(pool, { date, name, details })
    .then(result => res.status(201).json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

router.patch('/:id', (req, res, next) => {
  const { date, name, details } = req.body
  updateTodoInfo(pool, req.params.id, { date, name, details })
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

router.patch('/:id/completed', (req, res, next) => {
  const { completed_at } = req.body
  completeTodo(pool, req.params.id, completed_at)
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

router.delete('/:id', (req, res, next) => {
  deleteTodo(pool, req.params.id)
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

export default router
