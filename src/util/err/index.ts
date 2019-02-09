import ServerErr from './ServerErr'
import { formatAPIRes } from '../index'
import { APIRes, ERR_TYPE } from '../../types'

interface ErrData {
  code?: number
  message?: string
  statusCode?: number
}

/**
 * Generate ServerErr instance
 * @param statusCode (Optional) HTTP status code. Defaults to 500.
 * @param message (Optional) Error message. Has some default values if left unset depending on status code.
 * @returns ServerErr
 */
export const genErr = (statusCode: number = 500, message?: string): ServerErr => {
  let m = message
  if (!m) {
    switch (statusCode) {
      case 400:
        m = 'Bad request'
        break
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

  return new ServerErr(m, statusCode)
}

/**
 * Generate API error response. Handles some error codes set by PostgreSQL.
 * @param err ServerError instance
 * @returns API error response
 */
export const genErrRes = (err: ServerErr): APIRes<ErrData> => {
  let { statusCode } = err
  const code = String(err.code)

  if (code && !statusCode) {
    if (code === '0') {
      statusCode = 404
    } else if (code === '22007' || code === '22P02' || code === '23502' || code === '42703') {
      statusCode = 400
    }
  }

  return formatAPIRes<ErrData>(
    {
      statusCode: statusCode || 500,
      message: err.message || 'Something broke!'
    },
    ERR_TYPE
  )
}
