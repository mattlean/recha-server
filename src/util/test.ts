/* eslint import/prefer-default-export: 0 */
import { IDatabase } from 'pg-promise'

/**
 * Clear all rows in database table. Only works for test environment!
 * @param db pg-promise Database object
 * @param table Database table name
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearDBTable = (db: IDatabase<any>, table: string): Promise<any[]> => {
  if (process.env.NODE_ENV === 'test') {
    return db.any('DELETE FROM $1# RETURNING *', [table])
  }

  throw new Error('Invalid environment')
}
