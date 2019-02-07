import pgPromise, { IMain, IDatabase } from 'pg-promise'
import { Application } from 'express'

import { CONFIG } from '../../types'
import * as todos from './todos'

interface QueryVarScaffold {
  name: string
  val: string
}

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

// Generate query var scaffold which is used to dynamically build queries with pg-promise's query-formatting engine
export const genQueryVarScaffold = (data: object, keyFilter: string[], id?: number): QueryVarScaffold[] => {
  const queryVarScaffold = []

  if (id) queryVarScaffold.push({ name: 'id', val: id })

  Object.keys(data).forEach(key => {
    if (keyFilter.indexOf(key) > -1) {
      if (!id && key === 'id' && data[key]) {
        queryVarScaffold.unshift({ name: key, val: data[key] })
      } else if (data[key] || data[key] === null) {
        queryVarScaffold.push({ name: key, val: data[key] })
      }
    }
  })

  return queryVarScaffold
}

export { todos }
