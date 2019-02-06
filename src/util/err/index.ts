/* eslint import/prefer-default-export: 0 */
import ServerErr from './ServerErr'
import { formatAPIRes } from '../index'
import { APIRes } from '../../types'

interface ErrRes {
  status: number
  message: string
}

export const TYPE = 'Error'

export const genErr = (status?: number, message?: string): ServerErr => {
  let m = message
  if (!m) {
    switch (status) {
      case 404:
        m = 'Not found'
        break
      case 500:
        m = 'Internal server error'
        break
      default:
        m = 'Something broke!'
    }
  }

  return new ServerErr(m, status)
}

export const genErrRes = (err: ServerErr): APIRes<ErrRes> =>
  formatAPIRes<ErrRes>(
    {
      status: err.status || 500,
      message: err.message || 'Something broke!'
    },
    TYPE
  )
