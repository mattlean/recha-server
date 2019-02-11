import { Router } from 'express'

import validateInput from '../../util/validateInput'
import { createTodo, deleteTodo, getTodoById, getTodos, patchTodo } from '../../util/db/todos'
import { formatAPIRes } from '../../util'
import { genErr } from '../../util/err'
import { db } from '../../app'
import { TYPE } from '../../types/Todo'

const router = Router()

const constraints = {
  completed_at: { allowNull: true, type: 'string', strRules: { isDate: true } },
  date: { isRequired: true, type: 'string', strRules: { isDate: true } },
  details: { allowNull: true, type: 'string', strRules: { isLength: { max: 1024 } } },
  name: { isRequired: true, type: 'string', strRules: { isLength: { min: 1, max: 280 } } },
  order_num: { allowNull: true, type: 'number' }
}

router.get('/', (req, res, next) => {
  const { col, date, dir } = req.query
  const invalids = validateInput(
    { col, date, dir },
    {
      col: { type: 'string', strRules: { isIn: ['id', 'date', 'order_num'] } },
      date: { type: 'string', strRules: { isDate: true } },
      dir: { type: 'string', strRules: { isIn: ['ASC', 'asc', 'DESC', 'desc'] } }
    },
    {
      exitASAP: true
    }
  ).showInvalidResults('array')

  if (invalids.length > 0) return next(genErr(400, invalids[0]))

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
  const invalids = validateInput({ completed_at, date, details, name, order_num }, constraints, {
    exitASAP: true
  }).showInvalidResults('array')

  if (invalids.length > 0) return next(genErr(400, invalids[0]))

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
  const invalids = validateInput({ completed_at, date, details, name, order_num }, constraints, {
    exitASAP: true,
    requireMode: 'atLeastOne'
  }).showInvalidResults('array')

  if (invalids.length > 0) return next(genErr(400, invalids[0]))

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
