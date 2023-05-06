import pgPromise, { IDatabase } from 'pg-promise'

const pgp = pgPromise()

/**
 * Create database with pg-promise
 */
export const createDB = (): IDatabase<any> => {
  console.log('db created')
  return pgp('postgres://localhost:5432/recha2')
}
