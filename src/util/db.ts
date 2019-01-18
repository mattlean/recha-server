import { Pool } from 'pg'

import { CONFIG } from '../types' // eslint-disable-line no-unused-vars

const createPool = (DB_CONFIG: CONFIG['DB']) => {
  const pool = {
    host: DB_CONFIG.HOST,
    name: DB_CONFIG.NAME,
    user: DB_CONFIG.USER,
    password: DB_CONFIG.PASS,
    port: DB_CONFIG.PORT
  }
  return new Pool(pool)
}

export { createPool } // eslint-disable-line import/prefer-default-export
