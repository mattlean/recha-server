/**
 * Custom error class that extends Error. Sets name property to constructor name.
 * @extends Error
 * @member message A human-readable description of the error
 * @member name Name of Error
 */
export default class CustomErr extends Error {
  public name: string

  /**
   * Create CustomErr instance
   * @param message (Optional) Standard Error parameter. A human-readable description of the error.
   */
  public constructor(message?) {
    super(message)
    this.name = this.constructor.name
  }
}
