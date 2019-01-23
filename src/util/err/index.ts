/* eslint import/prefer-default-export: 0 */
import ServerErr from './ServerErr'

export const genErr = (status?: number, message?: string): ServerErr => {
  let m = message
  if (!m) {
    switch (status) {
      case 404:
        m = 'Not found'
        break
      default:
        m = 'Error'
    }
  }

  return new ServerErr(m, status)
}
