import { Pool, QueryResult } from 'pg'

import { TodoData } from '../../types/Todo'
import { genErr } from '../err'

export const completeTodo = (pool: Pool, id: number, completed_at: string): Promise<QueryResult['rows']> =>
  pool
    .query('UPDATE todos SET completed_at = $2 WHERE id = $1 RETURNING *', [id, completed_at])
    .then(result => result.rows[0])

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
