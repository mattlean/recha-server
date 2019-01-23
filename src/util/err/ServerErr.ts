class ServerErr extends Error {
  public message: string

  public status: number

  public constructor(message, status) {
    super(message)

    if (message) this.message = message
    if (status) this.status = status
  }
}

export default ServerErr
