import request from 'supertest'
import initApp from '../app'

test('"hello" is equal to "hello2"', () => {
  const app = initApp()
  request(app)
    .get('/hello-world')
    .expect(200)
    .then((res) => expect(res.text).toBe('Hello World!'))
})
