export interface TodoData {
  name: string
  text: string
}

export default interface Todo extends TodoData {
  id: number
  type: 'Todo'
}
