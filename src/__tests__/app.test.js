const request = require('supertest')

const app = require('../app').default
const { API } = require('../config')

describe('Hello world!', () => {
  it('should respond to GET request with 200 and API data', () =>
    request(app)
      .get('/')
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.text).toBe(
          JSON.stringify({
            API: API.NAME,
            ENV: process.env.NODE_ENV
          })
        )
      }))
})
