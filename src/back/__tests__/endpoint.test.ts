import request from 'supertest'
import initApp from '../app'

test('"hello" is equal to "hello2"', async () => {
  expect.assertions(1)
  const app = initApp()

  const res = await request(app).get('/hello-world')

  expect(res.text).toBe('Hello World!')
})
