/* eslint import/prefer-default-export: 0 */
import ServerErr from './ServerErr'

export const TYPE = 'ERROR'

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

export const genErrRes = (err: ServerErr): { status: number; message: string; type: typeof TYPE } => ({
  status: err.status || 500,
  message: err.message || 'Something broke!',
  type: TYPE
})
