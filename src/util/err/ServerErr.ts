import InternalErr from './InternalErr'

/**
 * Server error class that supports HTTP status codes
 * @extends InternalErr
 * @member code Error code
 * @member message A human-readable description of the error
 * @member name Name of Error
 * @member statusCode HTTP status code
 */
class ServerErr extends InternalErr {
  public statusCode: number

  /**
   * Create ServerErr instance
   * @param message (Optional) Standard Error parameter. A human-readable description of the error.
   * @param statusCode (Optional) HTTP status code
   * @param code (Optional) Error code
   */
  public constructor(message?, statusCode?, code?) {
    super(message, code)
    if (statusCode) this.statusCode = statusCode
  }
}

export default ServerErr
