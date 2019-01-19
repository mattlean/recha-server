/* eslint import/prefer-default-export: 0 */
import ServerErr from './ServerErr'

export const genErr = (status?: number, message?: string) => {
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

  return new ServerErr({ message: m, status })
}
