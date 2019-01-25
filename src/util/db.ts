/* eslint import/prefer-default-export: 0 */
import { Application } from 'express'
import { Pool, QueryResult } from 'pg'

import { CONFIG } from '../types'
import { TodoData } from '../types/Todo'
import { genErr } from './err'

export const applyDefaultProps = (data: object[] | object, type: string): object[] | object => {
  const transform = (d: object): object => ({ ...d, type })

  if (Array.isArray(data)) {
    return data.map(ele => transform(ele))
  }
  return transform(data)
}

export const completeTodo = (pool: Pool, id: number, completed_at: string): Promise<QueryResult['rows']> =>
  pool
    .query('UPDATE todos SET completed_at = $2 WHERE id = $1 RETURNING *', [id, completed_at])
    .then(result => result.rows[0])

// Create node-postgres connection pool
// If Express app is passed, assign pool to app's local variables
export const createPool = (DB_CONFIG: CONFIG['DB'], app?: Application): Pool => {
  const POOL_CONFIG = {
    database: DB_CONFIG.NAME,
    host: DB_CONFIG.HOST,
    user: DB_CONFIG.USER,
    password: DB_CONFIG.PASS,
    port: DB_CONFIG.PORT
  }

  const newPool = new Pool(POOL_CONFIG)

  if (app) {
    const a = app
    a.locals.pool = newPool
  }

  return newPool
}

export const createTodo = (pool: Pool, data: TodoData): Promise<QueryResult['rows']> =>
  pool
    .query('INSERT INTO todos (name, text) VALUES ($1, $2) RETURNING *', [data.name, data.text])
    .then(result => result.rows[0])

export const deleteTodo = (pool: Pool, id: number): Promise<QueryResult> =>
  pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]).then(result => {
    if (result.rowCount === 0) {
      throw genErr(404)
    }

    return result.rows[0]
  })

export const getTodoById = (pool: Pool, id: number): Promise<QueryResult['rows']> =>
  pool.query('SELECT * FROM todos WHERE id = $1', [id]).then(result => {
    if (result.rowCount === 0) {
      throw genErr(404)
    }

    return result.rows[0]
  })

export const getTodos = (pool: Pool): Promise<QueryResult['rows']> =>
  pool.query('SELECT * FROM todos ORDER BY id ASC').then(result => result.rows)

export const updateTodoInfo = (pool: Pool, id: number, data: TodoData): Promise<QueryResult['rows']> =>
  pool
    .query('UPDATE todos SET name = $2, text = $3 WHERE id = $1 RETURNING *', [id, data.name, data.text])
    .then(result => result.rows[0])
