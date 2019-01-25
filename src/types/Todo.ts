export interface TodoData {
  completed_at?: string
  name: string
  text?: string
}

export default interface Todo {
  id: number
  completed_at?: string
  name: string
  text?: string
  type: 'Todo'
}
