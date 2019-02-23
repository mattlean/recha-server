import checkpoint from 'checkpointjs'
import { Router } from 'express'

import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodoLists,
  getTodos,
  patchTodo,
  reorderTodos
} from '../../util/db/todos'
import { formatAPIRes } from '../../util'
import { genErr } from '../../util/err'
import { db } from '../../app'
import { TYPE } from '../../types/Todo'

const router = Router()

const schema = {
  completed_at: { allowNull: true, type: 'string', strRules: { isDate: true } },
  date: { isRequired: true, type: 'string', strRules: { isDate: true } },
  details: { allowNull: true, type: 'string', strRules: { isLength: { max: 1024 } } },
  name: { isRequired: true, type: 'string', strRules: { isLength: { min: 1, max: 280 } } },
  order_num: { allowNull: true, type: 'number' }
}

router.get('/', (req, res, next) => {
  const { col, date, dir } = req.query
  const failedResults = checkpoint({ col, date, dir })
    .validate({
      schema: {
        col: { type: 'string', stringValidation: { isIn: ['id', 'date', 'order_num'] } },
        date: { type: 'string', stringValidation: { isDate: true } },
        dir: { type: 'string', stringValidation: { isIn: ['ASC', 'asc', 'DESC', 'desc'] } }
      },
      options: {
        exitASAP: true
      },
      type: 'object'
    })
    .showFailedResults()

  if (failedResults.length > 0) return next(genErr(400, failedResults[0]))

  return getTodos(db, date, col, dir)
    .then(result => {
      res.locals.result = result
      return next()
    })
    .catch(err => next(err))
})

router.get('/lists', (req, res, next) => {
  return getTodoLists(db)
    .then(result => {
      res.locals.result = result
      return next()
    })
    .catch(err => next(err))
})

router.get('/:id', (req, res, next) => {
  if (req.params.id !== 'lists') {
    getTodoById(db, req.params.id)
      .then(result => {
        res.locals.result = result
        return next()
      })
      .catch(err => next(err))
  } else {
    next()
  }
})

router.post('/', (req, res, next) => {
  const { completed_at, date, details, name, order_num } = req.body
  const failedResults = checkpoint({ completed_at, date, details, name, order_num })
    .validate({ schema, options: { exitASAP: true }, type: 'object' })
    .showFailedResults()

  if (failedResults.length > 0) return next(genErr(400, failedResults[0]))

  return createTodo(db, { completed_at, date, details, name, order_num })
    .then(result => {
      res.status(201)
      res.locals.result = result
      return next()
    })
    .catch(err => next(err))
})

router.patch('/reorder', (req, res, next) => {
  const order = req.body
  const failedResults = checkpoint(order)
    .validate({
      schema: { allowNull: false, isRequired: true, type: 'number' },
      options: { exitASAP: true },
      type: 'array',
      arrayType: 'primitive'
    })
    .showFailedResults()

  if (failedResults.length > 0) return next(genErr(400, failedResults[0]))

  // TODO: make sure all todos a part of the same todo list

  return reorderTodos(db, order)
    .then(result => {
      res.locals.result = result
      return next()
    })
    .catch(err => next(err))
})

router.patch('/:id', (req, res, next) => {
  if (req.params.id !== 'reorder') {
    const { completed_at, date, details, name, order_num } = req.body
    const failedResults = checkpoint({ completed_at, date, details, name, order_num })
      .validate({
        schema,
        options: {
          exitASAP: true,
          requireMode: 'atLeastOne'
        },
        type: 'object'
      })
      .showFailedResults()

    if (failedResults.length > 0) return next(genErr(400, failedResults[0]))

    return patchTodo(db, req.params.id, { completed_at, date, details, name, order_num })
      .then(result => {
        res.locals.result = result
        return next()
      })
      .catch(err => next(err))
  }

  return next()
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
