/**
 * Interface for CONFIG settings which determines application and database settings
 */
export default interface CONFIG {
  APP: {
    PORT: number
  }
  DB: {
    HOST: string
    NAME: string
    USER: string
    PASS: string
    PORT: number
  }
}
