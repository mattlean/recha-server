export const TYPE = 'Todo'

export default interface Todo {
  id: number
  date: string
  name: string
  details?: string
  completed_at?: string
  created_at: string
  updated_at: string
  type: typeof TYPE
}
