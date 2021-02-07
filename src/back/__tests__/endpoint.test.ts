import request from 'supertest'
import { initApp } from 'back/app'

describe('/hello-world endpoint', () => {
  it('returns "Hello World!"', async () => {
    expect.assertions(1)
    const app = initApp()

    const res = await request(app).get('/hello-world')

    expect(res.text).toBe('Hello World!')
  })
})
