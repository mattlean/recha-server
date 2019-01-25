import { Router } from 'express'

import { pool } from '../../app'
import {
  applyDefaultProps,
  completeTodo,
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodoInfo
} from '../../util/db'

const router = Router()

const TYPE = 'Todo'

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
  const { name, text } = req.body
  createTodo(pool, { name, text })
    .then(result => res.status(201).json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

router.put('/:id', (req, res, next) => {
  const { name, text } = req.body
  updateTodoInfo(pool, req.params.id, { name, text })
    .then(result => res.json(applyDefaultProps(result, TYPE)))
    .catch(err => next(err))
})

router.put('/:id/completed', (req, res, next) => {
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
