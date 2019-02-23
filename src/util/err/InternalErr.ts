import CustomErr from './CustomErr'

/**
 * Internal error class that supports error codes
 * @extends CustomErr
 * @member code Error code
 * @member message A human-readable description of the error
 * @member name Name of Error
 */
export default class InternalErr extends CustomErr {
  public code: string

  /**
   * Create InternalErr instance
   * @param message (Optional) Standard Error parameter. A human-readable description of the error.
   * @param code (Optional) Error code
   */
  public constructor(message?: string, code?: string) {
    super(message)
    if (code) this.code = code
  }
}
