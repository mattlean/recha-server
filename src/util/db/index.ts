/* eslint import/prefer-default-export: 0 */
import { Application } from 'express'
import { Pool } from 'pg'

import { CONFIG } from '../../types'
import * as todo from './todo'

export const applyDefaultProps = (data: object[] | object, type: string): object[] | object => {
  const transform = (d: object): object => ({ ...d, type })

  if (Array.isArray(data)) {
    return data.map(ele => transform(ele))
  }
  return transform(data)
}

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

export { todo }
