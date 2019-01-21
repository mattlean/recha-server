/* eslint import/prefer-default-export: 0 */
import { CONFIG } from '../types' // eslint-disable-line no-unused-vars

export const DB: CONFIG['DB'] = {
  HOST: 'localhost',
  NAME: 'recha_test',
  USER: 'me',
  PASS: 'password',
  PORT: 5432
}
