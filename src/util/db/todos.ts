import moment from 'moment'
import { IDatabase } from 'pg-promise'

import Todo from '../../types/Todo'
import { genQueryVarScaffold } from '.'

export const TABLE = 'todos'
const COLS = ['completed_at', 'date', 'details', 'order_num', 'name']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTodo = (db: IDatabase<any>, data: Partial<Todo>): Promise<Todo> => {
  const queryVarScaffold = genQueryVarScaffold(data, COLS)
  const indexVars = []
  let cols = ''
  let vals = ''

  let text = `INSERT INTO ${TABLE} (`
  queryVarScaffold.forEach((ele, i) => {
    indexVars.push(ele.val)
    let newCol = ele.name
    let newVal = `$${i + 1}`
    if (i !== queryVarScaffold.length - 1) {
      newCol += ', '
      newVal += ', '
    }
    cols += newCol
    vals += newVal
  })
  text += `${cols}) VALUES (${vals}) RETURNING *`

  return db.one(text, indexVars)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteTodo = (db: IDatabase<any>, id: number): Promise<Todo> =>
  db.one(`DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`, [id])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTodoById = (db: IDatabase<any>, id: number): Promise<Todo> =>
  db.one(`SELECT * FROM ${TABLE} WHERE id = $1`, [id])

export const getTodos = (
  db: IDatabase<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  date?: string,
  orderCol: 'id' | 'date' | 'order_num' = 'id',
  orderDir: 'ASC' | 'DESC' = 'DESC'
): Promise<Todo[]> => {
  let text = `SELECT * FROM ${TABLE} `

  let whereText
  if (date) {
    whereText = `WHERE date = '${moment(date).format('YYYY-MM-DD')}' `
  }
  if (whereText) text += whereText

  text += 'ORDER BY $1# $2#'

  return db.any(text, [orderCol, orderDir])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTodoLists = (db: IDatabase<any>): ReturnType<typeof getTodoLists> =>
  db.any('SELECT MIN(date) AS date FROM todos GROUP BY date ORDER BY date DESC').then(result => {
    const newResult = result.map(item => item.date)
    return newResult
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const patchTodo = (db: IDatabase<any>, id: number, data: Partial<Todo>): Promise<Todo> => {
  const queryVarScaffold = genQueryVarScaffold(data, COLS, id)
  const indexVars = []

  let text = `UPDATE ${TABLE} SET`
  queryVarScaffold.forEach((ele, i) => {
    indexVars.push(ele.val)
    if (ele.name === 'id') return
    let str = ` ${ele.name}=$${i + 1}`
    if (i !== queryVarScaffold.length - 1) {
      str += ','
    }
    text += str
  })
  text += ' WHERE id = $1 RETURNING *'
  return db.one(text, indexVars)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reorderTodos = (db: IDatabase<any>, data: number[]): Promise<Todo[]> =>
  db.tx(t => {
    const batch = data.map((id, i) => t.one(`UPDATE ${TABLE} SET order_num=${i + 1} WHERE id = $1 RETURNING *`, id))
    return t.batch(batch)
  })
