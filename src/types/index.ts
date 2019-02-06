/* eslint import/prefer-default-export: 0 */
import CONFIG from './CONFIG'
import * as Todo from './Todo'
import { TYPE as ERR_TYPE } from '../util/err'

export interface APIRes<T> {
  data: T | T[]
  type: string
}

export type Types = typeof Todo.TYPE | typeof ERR_TYPE

export { CONFIG, Todo }
