export interface UserData {
  name: string
  email: string
}

export default interface User extends UserData {
  id: number
  type: 'User'
}
