export const TYPE = 'Todo'

export default interface Todo {
  id: number
  date: string
  name: string
  order_num?: number
  completed_at?: string
  details?: string
  created_at: string
  updated_at: string
  type: typeof TYPE
}
