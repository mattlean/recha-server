/**
 * Server error class that extends Error with some nonstandard properties
 * @extends Error
 */
class ServerErr extends Error {
  public code: string

  public message: string

  public status: number

  /**
   * Create ServerErr instance
   * @param message (Optional) Error message. Same as the message parameter for a standard Error instance.
   * @param status (Optional) HTTP status code
   */
  public constructor(message?, status?) {
    super(message)

    if (message) this.message = message
    if (status) this.status = status
  }
}

export default ServerErr
