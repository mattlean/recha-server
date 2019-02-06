import moment from 'moment'
import { IDatabase } from 'pg-promise'

import Todo from '../../types/Todo'
import { genErr } from '../err'

export const TABLE = 'todos'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTodo = (db: IDatabase<any>, data: Partial<Todo>): Promise<Todo> =>
  db.oneOrNone(`INSERT INTO ${TABLE} (date, name, details) VALUES ($1, $2, $3) RETURNING *`, [
    data.date,
    data.name,
    data.details
  ])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteTodo = (db: IDatabase<any>, id: number): Promise<Todo> =>
  db.oneOrNone(`DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`, [id]).then(result => {
    if (!result) throw genErr(404)
    return result
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTodoById = (db: IDatabase<any>, id: number): Promise<Todo> =>
  db.oneOrNone(`SELECT * FROM ${TABLE} WHERE id = $1`, [id]).then(result => {
    if (!result) throw genErr(404)
    return result
  })

export const getTodos = (
  db: IDatabase<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  date?: string,
  orderCol: 'id' | 'order_num' = 'id',
  orderDir: 'ASC' | 'DESC' = 'DESC'
): Promise<Todo[]> => {
  let text = `SELECT * FROM ${TABLE} `

  let whereText
  if (date) {
    const momentDate = moment(date)
    if (!momentDate.isValid()) throw new Error('Invalid date')
    whereText = `WHERE date = '${momentDate.format('YYYY-MM-DD')}' `
  }
  if (whereText) text += whereText

  text += 'ORDER BY $1:raw $2:raw'

  return db.any(text, [orderCol, orderDir])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const patchTodo = (db: IDatabase<any>, id: number, data: Partial<Todo>): Promise<Todo> => {
  const { completed_at, date, order_num, name, details } = data

  if (
    !date &&
    !name &&
    (!completed_at && completed_at !== null) &&
    (!details && details !== null) &&
    (!order_num && order_num !== null)
  ) {
    throw new Error('No accepted data passed')
  }

  const nameVals = []
  const vals: (number | string)[] = [id]
  Object.keys(data).forEach(key => {
    if (key === 'completed_at' || key === 'date' || key === 'details' || key === 'order_num' || key === 'name') {
      if (data[key] || data[key] === null) {
        nameVals.push({ name: key, val: data[key] })
        vals.push(data[key])
      }
    }
  })

  let text = `UPDATE ${TABLE} SET`
  nameVals.forEach((ele, i) => {
    let str = ` ${ele.name}=$${i + 2}`
    if (i !== nameVals.length - 1) {
      str += ','
    }
    text += str
  })
  text += ' WHERE id = $1 RETURNING *'

  return db.oneOrNone(text, vals).then(result => {
    if (!result) throw genErr(404)
    return result
  })
}
