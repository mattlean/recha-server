/* eslint import/prefer-default-export: 0 */
import { IDatabase } from 'pg-promise'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearDBTable = (db: IDatabase<any>, table: string): Promise<any[]> => {
  if (process.env.NODE_ENV === 'test') {
    return db.any(`DELETE FROM ${table} RETURNING *`)
  }

  throw new Error('Invalid environment')
}
