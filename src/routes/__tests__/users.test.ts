import request from 'supertest'

import app from '../../app'
import { API, DB } from '../../config'
import { clearDBTable } from '../../util/test'
import { createPool } from '../../util/db'
import { UserData } from '../../types/User' // eslint-disable-line no-unused-vars

const p = createPool(DB)

beforeAll(() => clearDBTable(p, 'users'))

afterAll(() => p.end())

describe('User endpoints', () => {
  const ENDPOINT = `${API.VERS.V1.PATH}users`
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

  it('should list all users', () =>
    request(app)
      .get(ENDPOINT)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body[0].email).toBe(user.email)
        expect(res.body[0].name).toBe(user.name)
      }))

  it('should read a specific user', () =>
    request(app)
      .get(`${ENDPOINT}/${user.id}`)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.email).toBe(userData.email)
        expect(res.body.name).toBe(userData.name)
      }))
})
