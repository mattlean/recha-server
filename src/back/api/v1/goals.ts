import { Router } from 'express'

const r = Router()

// GET /goals: List goals
r.get('/', async (req, res, next) => {
  const db = req.app.locals.db

  try {
    const goals = await db.any('SELECT * FROM goals')
    res.json(goals)
  } catch (err) {
    return err
  }
})

// POST /goals: Create goal
r.post('/', async (req, res, next) => {
  const db = req.app.locals.db

  try {
    const id = await db.one(
      'INSERT INTO goals(name) VALUES (${name}) RETURNING id',
      req.body
    )
    res.json(id)
  } catch (err) {
    return err
  }
})

export default r
