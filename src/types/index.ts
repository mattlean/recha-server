import { TYPE as TODO_TYPE } from './Todo'

/**
 * Constant API response type for errors
 */
export const ERR_TYPE = 'Error'

/**
 * Interface for API response
 */
export interface APIRes<T> {
  data: T
  type: APITypes
}

/**
 * Interface for CONFIG settings which determines application and database settings
 */
export interface CONFIG {
  APP: {
    PORT: number
  }
  DB: {
    HOST: string
    NAME: string
    USER: string
    PASS: string
    PORT: number
  }
}

/**
 * All API response types
 */
export type APITypes = typeof ERR_TYPE | typeof TODO_TYPE
