import request from 'supertest'

import app from '../app'
import { genApiData } from '../util'

describe('Root endpoint', () => {
  it('should respond to GET request with 200 and API data', () =>
    request(app)
      .get('/')
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.text).toBe(JSON.stringify(genApiData()))
      }))
})
