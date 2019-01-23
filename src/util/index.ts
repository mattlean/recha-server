/* eslint import/prefer-default-export: 0 */
import * as db from './db'
import * as err from './err'
import logger from './logger'
import { API } from '../config'

interface ApiData {
  API: string
  ENV: string
  VER?: number
}

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
