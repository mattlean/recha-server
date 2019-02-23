import request from 'supertest'

import app, { db } from '../../../app'
import Todo, { TYPE } from '../../../types/Todo'
import { API } from '../../../config'
import { clearDBTable } from '../../../util/test'
import { ERR_TYPE } from '../../../types'
import { TABLE } from '../../../util/db/todos'

const ENDPOINT = `${API.VERS.V1.PATH}${TABLE}`

beforeAll(() => clearDBTable(db, TABLE))

afterAll(() => clearDBTable(db, TABLE))

describe('Todo endpoints', () => {
  const NEW_TODO_DATA: Partial<Todo> = {
    date: '2019-02-03T08:00:00.000Z',
    name: 'Hello world!',
    details:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget odio eu nisi congue semper. Cras a ultrices sapien. Suspendisse non metus eu ex tempor facilisis. Pellentesque faucibus nunc vitae eleifend elementum. Nam tincidunt, ipsum quis vulputate blandit, odio velit sagittis ligula, in elementum elit risus a lacus. Vivamus eu tincidunt sapien, sit amet blandit sapien. Donec sollicitudin pellentesque augue, nec egestas elit volutpat ac. Nullam in arcu ac nulla tincidunt luctus et sed erat. Sed quis dapibus ante, quis consequat mauris. Vestibulum quis purus ac velit congue viverra et id dui. Nam a magna imperdiet, lobortis nunc nec, aliquet quam. Nam dapibus velit ac erat rhoncus cursus. Suspendisse tempus est massa, vitae lacinia dolor pellentesque sit amet. Nunc mattis eros quam, quis ornare lectus bibendum a. Donec porttitor, neque quis dapibus lacinia, turpis sapien tempor eros, eget semper nisl magna ut libero.',
    order_num: 1
  }
  const UPDATED_TODO_DATA: Partial<Todo> = {
    date: '1990-01-01T08:00:00.000Z',
    name: 'New Name',
    details: 'New details!'
  }

  let todo
  let todo2

  it('should list no todos when no todos are in the DB', () =>
    request(app)
      .get(ENDPOINT)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.type).toBe(TYPE)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.data.length).toBe(0)
      }))

  it('should create a todo', () =>
    request(app)
      .post(ENDPOINT)
      .send(NEW_TODO_DATA)
      .then(res => {
        expect(res.statusCode).toBe(201)
        expect(res.body.type).toBe(TYPE)
        expect(res.body.data.date).toBe(NEW_TODO_DATA.date)
        expect(res.body.data.name).toBe(NEW_TODO_DATA.name)
        expect(res.body.data.details).toBe(NEW_TODO_DATA.details)
        todo = res.body.data
      }))

  it('should fail to create a todo when name is null', () =>
    request(app)
      .post(ENDPOINT)
      .send({
        ...NEW_TODO_DATA,
        name: null
      })
      .then(res => {
        expect(res.statusCode).toBe(400)
        expect(res.body.type).toBe(ERR_TYPE)
      }))

  it('should list all todos', () =>
    request(app)
      .get(ENDPOINT)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.type).toBe(TYPE)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.data.length).toBe(1)
        expect(res.body.data[0].date).toBe(todo.date)
        expect(res.body.data[0].name).toBe(todo.name)
        expect(res.body.data[0].details).toBe(todo.details)
      }))

  it('should read a specific todo', () =>
    request(app)
      .get(`${ENDPOINT}/${todo.id}`)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.type).toBe(TYPE)
        expect(res.body.data.date).toBe(NEW_TODO_DATA.date)
        expect(res.body.data.name).toBe(NEW_TODO_DATA.name)
        expect(res.body.data.details).toBe(NEW_TODO_DATA.details)
      }))

  it("should update a specific todo's date, name & details", () =>
    request(app)
      .patch(`${ENDPOINT}/${todo.id}`)
      .send(UPDATED_TODO_DATA)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.type).toBe(TYPE)
        expect(res.body.data.date).toBe(UPDATED_TODO_DATA.date)
        expect(res.body.data.name).toBe(UPDATED_TODO_DATA.name)
        expect(res.body.data.details).toBe(UPDATED_TODO_DATA.details)
      }))

  it("should update a specific todo's completed datetime", () => {
    const completed_at = '2019-01-25T00:53:52.000Z'

    return request(app)
      .patch(`${ENDPOINT}/${todo.id}`)
      .send({ completed_at })
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.type).toBe(TYPE)
        expect(res.body.data.date).toBe(UPDATED_TODO_DATA.date)
        expect(res.body.data.name).toBe(UPDATED_TODO_DATA.name)
        expect(res.body.data.details).toBe(UPDATED_TODO_DATA.details)
        expect(res.body.data.completed_at).toBe(completed_at)
      })
  })

  it("should fail to update a specific todo's name to null", () =>
    request(app)
      .patch(`${ENDPOINT}/${todo.id}`)
      .send({ name: null })
      .then(res => {
        expect(res.statusCode).toBe(400)
        expect(res.body.type).toBe(ERR_TYPE)
      }))

  it('should delete a specific todo', () =>
    request(app)
      .del(`${ENDPOINT}/${todo.id}`)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.type).toBe(TYPE)
        expect(res.body.data.date).toBe(UPDATED_TODO_DATA.date)
        expect(res.body.data.name).toBe(UPDATED_TODO_DATA.name)
        expect(res.body.data.details).toBe(UPDATED_TODO_DATA.details)
      }))

  it("should fail to read a specific todo that doesn't exist", () =>
    request(app)
      .get(`${ENDPOINT}/${todo.id}`)
      .then(res => {
        expect(res.statusCode).toBe(404)
        expect(res.body.type).toBe(ERR_TYPE)
      }))

  it("should fail to update a specific todo that doesn't exist", () =>
    request(app)
      .patch(`${ENDPOINT}/${todo.id}`)
      .send(UPDATED_TODO_DATA)
      .then(res => {
        expect(res.statusCode).toBe(404)
        expect(res.body.type).toBe(ERR_TYPE)
      }))

  it("should fail to delete a specific todo that doesn't exist", () =>
    request(app)
      .del(`${ENDPOINT}/${todo.id}`)
      .then(res => {
        expect(res.statusCode).toBe(404)
        expect(res.body.type).toBe(ERR_TYPE)
      }))

  it('should list all todos by date ascending', () => {
    /* eslint-disable jest/valid-expect-in-promise */
    const firstTodo = request(app)
      .post(ENDPOINT)
      .send({
        date: '1970-01-01T08:00:00.000Z',
        name: 'Earliest Todo'
      })
      .then(res => {
        expect(res.statusCode).toBe(201)
        return res
      })

    const secondTodo = request(app)
      .post(ENDPOINT)
      .send({
        date: '2038-12-30T08:00:00.000Z',
        name: 'Latest Todo'
      })
      .then(res => {
        expect(res.statusCode).toBe(201)
        return res
      })

    const thirdTodo = request(app)
      .post(ENDPOINT)
      .send(NEW_TODO_DATA)
      .then(res => {
        todo = res.body.data
        expect(res.statusCode).toBe(201)
        return res
      })
    /* eslint-enable jest/valid-expect-in-promise */

    return Promise.all([firstTodo, secondTodo, thirdTodo]).then(todos =>
      request(app)
        .get(ENDPOINT)
        .query({
          col: 'date',
          dir: 'ASC'
        })
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body.type).toBe(TYPE)
          expect(res.body.data).toBeInstanceOf(Array)
          expect(res.body.data.length).toBe(3)
          expect(res.body.data[0].date).toBe(todos[0].body.data.date)
          expect(res.body.data[1].date).toBe(todos[2].body.data.date)
          expect(res.body.data[2].date).toBe(todos[1].body.data.date)
        })
    )
  })

  it('should list all todos for specific date by order number descending', () => {
    const anotherTodo = {
      date: NEW_TODO_DATA.date,
      name: 'Yet another todo...',
      order_num: 2
    }

    return request(app)
      .post(ENDPOINT)
      .send(anotherTodo)
      .then(res => {
        todo2 = res.body.data
        expect(res.statusCode).toBe(201)
      })
      .then(() =>
        request(app)
          .get(ENDPOINT)
          .query({
            date: NEW_TODO_DATA.date,
            col: 'order_num',
            dir: 'DESC'
          })
          .then(res => {
            expect(res.statusCode).toBe(200)
            expect(res.body.type).toBe(TYPE)
            expect(res.body.data).toBeInstanceOf(Array)
            expect(res.body.data.length).toBe(2)
            expect(res.body.data[0].date).toBe(res.body.data[1].date)
            expect(res.body.data[0].order_num).toBeGreaterThan(res.body.data[1].order_num)
            expect(res.body.data[0].name).not.toBe(res.body.data[1].name)
          })
      )
  })

  it('should list dates where todo lists exist', () => {
    return request(app)
      .get(`${ENDPOINT}/lists`)
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.type).toBe(TYPE)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.data.length).toBe(3)
        expect(res.body.data[0]).toBe('2038-12-30T08:00:00.000Z')
        expect(res.body.data[1]).toBe('2019-02-03T08:00:00.000Z')
        expect(res.body.data[2]).toBe('1970-01-01T08:00:00.000Z')
      })
  })

  it('should update todo orders', () =>
    request(app)
      .patch(`${ENDPOINT}/reorder`)
      .send([todo2.id, todo.id])
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.type).toBe(TYPE)
        expect(res.body.data[0].id).toBe(todo2.id)
        expect(res.body.data[0].order_num).not.toEqual(todo2.order_num)
        expect(res.body.data[0].order_num).toBe(1)
        expect(res.body.data[1].id).toBe(todo.id)
        expect(res.body.data[1].order_num).not.toEqual(todo.order_num)
        expect(res.body.data[1].order_num).toBe(2)
      }))
})
