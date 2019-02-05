import { Pool, QueryResult } from 'pg'

import Todo from '../../types/Todo'
import { genErr } from '../err'

export const TABLE = 'todos'

export const completeTodo = (pool: Pool, id: number, completed_at: string): Promise<QueryResult['rows']> =>
  pool
    .query(`UPDATE ${TABLE} SET completed_at = $2 WHERE id = $1 RETURNING *`, [id, completed_at])
    .then(result => result.rows[0])

export const createTodo = (pool: Pool, data: Partial<Todo>): Promise<QueryResult['rows']> =>
  pool
    .query(`INSERT INTO ${TABLE} (date, name, details) VALUES ($1, $2, $3) RETURNING *`, [
      data.date,
      data.name,
      data.details
    ])
    .then(result => result.rows[0])

export const deleteTodo = (pool: Pool, id: number): Promise<QueryResult> =>
  pool.query(`DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`, [id]).then(result => {
    if (result.rowCount === 0) {
      throw genErr(404)
    }

    return result.rows[0]
  })

export const getTodoById = (pool: Pool, id: number): Promise<QueryResult['rows']> =>
  pool.query(`SELECT * FROM ${TABLE} WHERE id = $1`, [id]).then(result => {
    if (result.rowCount === 0) {
      throw genErr(404)
    }

    return result.rows[0]
  })

export const getTodos = (pool: Pool): Promise<QueryResult['rows']> =>
  pool.query(`SELECT * FROM ${TABLE} ORDER BY id ASC`).then(result => result.rows)

export const patchTodo = (pool: Pool, id: number, data: Partial<Todo>): Promise<QueryResult['rows']> => {
  const { date, name, details } = data

  if (!date && !name && (!details && details !== null)) {
    throw new Error('No accepted data passed')
  }

  const nameVals = []
  const vals = [String(id)]
  Object.keys(data).forEach(key => {
    if (key === 'date' || key === 'name' || key === 'details') {
      if (data[key] || data[key] === null) {
        nameVals.push({ name: key, val: data[key] })
        vals.push(data[key])
      }
    }
  })

  let text = `UPDATE ${TABLE} SET`
  nameVals.forEach((ele, i) => {
    let str = ` ${ele.name}=$${i + 2}`
    if (i !== nameVals.length - 1) {
      str += ','
    }
    text += str
  })
  text += ' WHERE id = $1 RETURNING *'

  return pool.query(text, vals).then(result => result.rows[0])
}
