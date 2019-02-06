/* eslint import/prefer-default-export: 0 */
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

export const formatAPIRes = <T>(data: T | T[], type: Types): APIRes<T> => ({
  data,
  type
})

const genApiData = (ver?: number): ApiData => {
  const data: ApiData = {
    API: API.NAME,
    ENV: process.env.NODE_ENV
  }

  if (ver) {
    data.VER = ver
  }

  return data
}

export { db, err, genApiData, logger }
