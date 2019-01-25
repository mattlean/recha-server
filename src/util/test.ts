/* eslint import/prefer-default-export: 0 */
import { Pool, QueryResult } from 'pg'

export const clearDBTable = (pool: Pool, table: string): Promise<QueryResult['rows']> => {
  if (process.env.NODE_ENV === 'test') {
    return pool.query(`DELETE FROM ${table} RETURNING *`).then(result => result.rows)
  }

  throw new Error('Invalid environment')
}
