import pgPromise, { IMain, IDatabase } from 'pg-promise'
import { Application } from 'express'

import { CONFIG } from '../../types'
import * as todos from './todos'

interface QueryVarScaffold {
  name: string
  val: string
}

/**
 * Create a pg-promise Database object
 * @param DB_CONFIG Database configuration object
 * @param app (Optional) Express application. The database will be assigned to its local variables.
 * @returns pg-promise Database object
 */
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

/**
 * Generate query variable scaffold to dynamically build database queries
 * @param data Database row data
 * @param keyFilter Desired keys to filter database row data with
 * @param id (Optional) Database row data unique ID
 * @returns Query variable scaffold array
 */
export const genQueryVarScaffold = (data: object, keyFilter: string[], id?: number | string): QueryVarScaffold[] => {
  let idStr

  if (typeof id === 'number') {
    idStr = String(id)
  } else {
    idStr = id
  }

  const queryVarScaffold = []

  if (idStr) queryVarScaffold.push({ name: 'id', val: idStr })

  Object.keys(data).forEach(key => {
    if (keyFilter.indexOf(key) > -1) {
      if (!idStr && key === 'id' && data[key]) {
        queryVarScaffold.unshift({ name: key, val: data[key] })
      } else if (data[key] || data[key] === '' || data[key] === null) {
        queryVarScaffold.push({ name: key, val: data[key] })
      }
    }
  })

  return queryVarScaffold
}

export { todos }
