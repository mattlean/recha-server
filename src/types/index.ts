/* eslint import/prefer-default-export: 0 */
import CONFIG from './CONFIG'
import * as Todo from './Todo'

export interface APIRes<T> {
  data: T
  type: Types
}

export const ERR_TYPE = 'Error'

export type Types = typeof Todo.TYPE | typeof ERR_TYPE

export { CONFIG, Todo }
