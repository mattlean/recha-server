import pgPromise, { IMain, IDatabase } from 'pg-promise'
import { Application } from 'express'

import { CONFIG } from '../../types'
import * as todos from './todos'

// Create pg-promise Database object
// If Express app is passed, assign pool to app's local variables
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createDB = (DB_CONFIG: CONFIG['DB'], app?: Application): IDatabase<any> => {
  const pgp: IMain = pgPromise()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db: IDatabase<any> = pgp(
    `postgres://${DB_CONFIG.USER}:${DB_CONFIG.PASS}@${DB_CONFIG.HOST}:${DB_CONFIG.PORT}/${DB_CONFIG.NAME}`
  )

  if (app) {
    const a = app
    a.locals.db = db
  }

  return db
}

export { todos }
