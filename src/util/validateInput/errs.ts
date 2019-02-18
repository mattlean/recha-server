const ERRS = {
  0: () => '"input" argument must be an object',
  1: (key: string) => `"${key}" property is required`,
  2: (key: string, type: string, valType: string) =>
    `"${key}" property only allows "${type}" type. Received "${valType}" type.`,
  3: (key: string) => `"${key}" property does not allow null`,
  4: () => '"atLeastOne" require mode requires at least one property to be validated',
  5: (key: string) => `"${key}" property must be a date`,
  6: (key: string, min: number, length: number) =>
    `"${key}" property must be greater than or equal to ${min} characters long. Received ${length} characters.`,
  7: (key: string, max: number, length: number) =>
    `"${key}" property must be less than or equal to ${max} characters long. Received ${length} characters.`,
  8: (key: string, isIn: string[]) => `"${key}" property only allows the following values: ${isIn.join(', ')}`
}

export default ERRS
