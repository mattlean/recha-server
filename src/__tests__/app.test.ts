import request from 'supertest'

import app from '../app'
import { genApiData } from '../util'
import { genErr, genErrRes } from '../util/err'

describe('General app endpoints', () => {
  it('should respond to GET request with 200 and API data', () =>
    request(app)
      .get('/')
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.text).toBe(JSON.stringify(genApiData()))
      }))

  it('should handle not found endpoints with 404 and error data', () =>
    request(app)
      .get('/anakin')
      .then(res => {
        expect(res.statusCode).toBe(404)
        expect(res.text).toBe(JSON.stringify(genErrRes(genErr(404))))
      }))
})
