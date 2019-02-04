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

export const updateTodoInfo = (pool: Pool, id: number, data: Partial<Todo>): Promise<QueryResult['rows']> =>
  pool
    .query(`UPDATE ${TABLE} SET date=$2, name = $3, details = $4 WHERE id = $1 RETURNING *`, [
      id,
      data.date,
      data.name,
      data.details
    ])
    .then(result => result.rows[0])
