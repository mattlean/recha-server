import request from 'supertest'

import app from '../../app'
import { API, DB } from '../../config'
import { clearDBTable } from '../../util/test'
import { createPool } from '../../util/db'
import { UserData } from '../../types/User' // eslint-disable-line no-unused-vars

const p = createPool(DB)

beforeAll(() => clearDBTable(p, 'users'))

afterAll(() => {
  clearDBTable(p, 'users')
  p.end()
})

describe('User endpoints', () => {
  const ENDPOINT = `${API.VERS.V1.PATH}users`
  const TYPE = 'User'
  const NEW_USER_DATA: UserData = {
    email: 'foo@bar.com',
    name: 'Foo'
  }
  const UPDATED_USER_DATA: UserData = {
    email: 'baz@bar.com',
    name: 'Baz'
  }
  let user

  it('should create a user', () =>
    request(app)
      .post(ENDPOINT)
      .send(NEW_USER_DATA)
      .then(res => {
        expect(res.statusCode).toBe(201)
        expect(res.body.email).toBe(NEW_USER_DATA.email)
        expect(res.body.name).toBe(NEW_USER_DATA.name)
        expect(res.body.type).toBe(TYPE)
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
        expect(res.body[0].type).toBe(TYPE)
      }))

  it('should read a specific user', () =>
    request(app)
      .get(`${ENDPOINT}/${user.id}`)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.email).toBe(NEW_USER_DATA.email)
        expect(res.body.name).toBe(NEW_USER_DATA.name)
        expect(res.body.type).toBe(TYPE)
      }))

  it('should update a specific user', () =>
    request(app)
      .put(`${ENDPOINT}/${user.id}`)
      .send(UPDATED_USER_DATA)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.email).toBe(UPDATED_USER_DATA.email)
        expect(res.body.name).toBe(UPDATED_USER_DATA.name)
        expect(res.body.type).toBe(TYPE)
      }))

  it('should delete a specific user', () =>
    request(app)
      .del(`${ENDPOINT}/${user.id}`)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.email).toBe(UPDATED_USER_DATA.email)
        expect(res.body.name).toBe(UPDATED_USER_DATA.name)
        expect(res.body.type).toBe(TYPE)

        return request(app)
          .get(`${ENDPOINT}/${user.id}`)
          .then(res2 => {
            expect(res2.statusCode).toBe(404)
          })
      }))
})
