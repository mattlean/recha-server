import * as db from './db'
import * as err from './err'
import logger from './logger'
import { API } from '../config'
import { APIRes, Types } from '../types'

interface ApiData {
  API: string
  ENV: string
  VER?: number
}

/**
 * Normalizes API responses
 * @param data Database query results
 * @param type API resource data types
 * @returns Normalized API response
 */
export const formatAPIRes = <T>(data: T, type: Types): APIRes<T> => ({
  data,
  type
})

/**
 * Generate API metadata
 * @param ver API version number
 * @returns API metadata
 */
export const genApiData = (ver?: number): ApiData => {
  const data: ApiData = {
    API: API.NAME,
    ENV: process.env.NODE_ENV
  }

  if (ver) {
    data.VER = ver
  }

  return data
}

export { db, err, logger }
