import CONFIG from './CONFIG'
import * as Todo from './Todo'

/**
 * Interface for API response
 */
export interface APIRes<T> {
  data: T
  type: Types
}

/**
 * Constant API response type for errors
 */
export const ERR_TYPE = 'Error'

/**
 * All API response types
 */
export type Types = typeof Todo.TYPE | typeof ERR_TYPE

export { CONFIG, Todo }
