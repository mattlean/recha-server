/* eslint import/prefer-default-export: 0 */

import { Application } from 'express' // eslint-disable-line no-unused-vars
import { Pool, QueryResult } from 'pg' // eslint-disable-line no-unused-vars

import { CONFIG } from '../types' // eslint-disable-line no-unused-vars
import { UserData } from '../types/User' // eslint-disable-line no-unused-vars
import { genErr } from './err'

// Create node-postgres connection pool
// If Express app is passed, assign pool to app's local variables
export const createPool = (DB_CONFIG: CONFIG['DB'], app: Application): Pool => {
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

export const createUser = (pool: Pool, data: UserData): Promise<QueryResult['rows']> =>
  pool
    .query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [data.name, data.email])
    .then(result => result.rows[0])

export const deleteUser = (pool: Pool, id: number): Promise<QueryResult> =>
  pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]).then(result => {
    if (result.rowCount === 0) {
      throw genErr(404)
    }

    return result.rows[0]
  })

export const getUserById = (pool: Pool, id: number): Promise<QueryResult['rows']> =>
  pool.query('SELECT * FROM users WHERE id = $1', [id]).then(result => {
    if (result.rowCount === 0) {
      throw genErr(404)
    }

    return result.rows[0]
  })

export const getUsers = (pool: Pool): Promise<QueryResult['rows']> =>
  pool.query('SELECT * FROM users ORDER BY id ASC').then(result => result.rows)

export const updateUser = (pool: Pool, id: number, data: UserData): Promise<QueryResult['rows']> =>
  pool
    .query('UPDATE users SET name = $1, EMAIL = $2 WHERE id = $3 RETURNING *', [data.name, data.email, id])
    .then(result => result.rows[0])
