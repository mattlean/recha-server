import ServerErr from './ServerErr'
import { formatAPIRes } from '../index'
import { APIRes, ERR_TYPE } from '../../types'

interface ErrData {
  code?: number
  message?: string
  status?: number
}

/**
 * Generate ServerErr instance
 * @param status (Optional) HTTP status code. Defaults to 500.
 * @param message (Optional) Error message. Has some default values if left unset depending on status.
 * @returns ServerErr
 */
export const genErr = (status: number = 500, message?: string): ServerErr => {
  let m = message
  if (!m) {
    switch (status) {
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

  return new ServerErr(m, status)
}

/**
 * Generate API error response. Handles some error codes set by PostgreSQL.
 * @param err ServerError instance
 * @returns API error response
 */
export const genErrRes = (err: ServerErr): APIRes<ErrData> => {
  let { status } = err
  const code = String(err.code)

  if (code && !status) {
    if (code === '0') {
      status = 404
    } else if (code === '22007' || code === '22P02' || code === '23502') {
      status = 400
    }
  }

  return formatAPIRes<ErrData>(
    {
      status: status || 500,
      message: err.message || 'Something broke!'
    },
    ERR_TYPE
  )
}
