import request from 'supertest'

import app from '../../app'
import { clearDBTable } from '../../util/test'
import { createPool } from '../../util/db'
import { DB } from '../../config'
import { UserData } from '../../types/User' // eslint-disable-line no-unused-vars

const p = createPool(DB)

beforeAll(() => clearDBTable(p, 'users'))

afterAll(() => p.end())

describe('User endpoints', () => {
  const ENDPOINT = '/v1/users'
  let user
  const userData: UserData = {
    email: 'foo@bar.com',
    name: 'Foo'
  }

  it('should create a user', () =>
    request(app)
      .post(ENDPOINT)
      .send(userData)
      .then(res => {
        expect(res.statusCode).toBe(201)
        expect(res.body.email).toBe(userData.email)
        expect(res.body.name).toBe(userData.name)
        user = res.body
      }))
})
