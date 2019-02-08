import { Constraints, Options, outputType, ValidateInputResult } from './types'

export const ERRS = {
  0: () => '"input" argument must be an object',
  1: (key: string) => `"${key}" property is required`,
  2: (key: string, type: string, valType: string) =>
    `"${key}" property only allows "${type}" type. Received "${valType}" type.`,
  3: (key: string) => `"${key}" property does not allow null`,
  4: () => '"atLeastOne" require mode requires at least one property to be validated.'
}

const addValidationResult = (
  validateInputResult: ValidateInputResult,
  key: string,
  isValid: boolean,
  reason?: string
): ValidateInputResult => {
  const result = validateInputResult

  if (!result.results[key]) result.results[key] = { isValid, reasons: [] }

  const validationResult = result.results[key]

  if (isValid === false) {
    if (validationResult.isValid) validationResult.isValid = false
    if (result.pass) result.pass = false
    result.results[key].reasons.push(reason)
  }

  return result
}

/**
 * Validate inputs
 * @param input Input object of key and value pairs
 * @param constraints Constraints that the input is validated with
 * @param options (Optional) Options to set different validation behaviors
 */
const validateInput = (input: object, constraints: Constraints, options: Options = {}): ValidateInputResult => {
  // TODO: implement strRules with validator.js

  if (typeof input !== 'object' || Array.isArray(input)) {
    throw new Error(ERRS[0]())
  }

  const result: ValidateInputResult = {
    constraints,
    input,
    missing: [],
    options,
    pass: true,
    results: {},
    showInvalidResults(type?: outputType) {
      const resultsKeys = Object.keys(this.results)

      let invalidResults

      if (type === 'object') {
        invalidResults = {}
      } else {
        invalidResults = []
      }

      resultsKeys.forEach(key => {
        const currResult = this.results[key]
        if (!currResult.isValid) {
          if (type === 'object') {
            invalidResults[key] = currResult.reasons
          } else {
            invalidResults.push(...this.results[key].reasons)
          }
        }
      })

      return invalidResults
    },
    showValidResults(type?: outputType) {
      const resultsKeys = Object.keys(this.results)

      let validResults

      if (type === 'object') {
        validResults = {}
      } else {
        validResults = []
      }

      resultsKeys.forEach(key => {
        const currResult = this.results[key]
        if (currResult.isValid) {
          if (type === 'object') {
            validResults[key] = true
          } else {
            validResults.push(key)
          }
        }
      })

      return validResults
    }
  }

  const { requireMode } = options
  const constraintsKeys = Object.keys(constraints)

  for (let i = 0; i < constraintsKeys.length; i += 1) {
    const currKey = constraintsKeys[i]
    const currVal = input[currKey]
    const { allowNull, isRequired, type } = constraints[currKey]
    const { exitASAP } = options

    if ((isRequired || requireMode === 'all') && currVal === undefined) {
      // Missing required property
      addValidationResult(result, currKey, false, ERRS[1](currKey))
      result.missing.push(currKey)
      if (exitASAP) return result
    }

    const currValType = typeof currVal
    if (
      (type || type === null) &&
      ((type === 'null' && currVal !== null) || (currValType !== type && currVal !== null))
    ) {
      // Type mismatch
      addValidationResult(result, currKey, false, ERRS[2](currKey, type, currValType))
      if (exitASAP) return result
    }

    if (!allowNull && currVal === null) {
      // Forbidden null
      addValidationResult(result, currKey, false, ERRS[3](currKey))
      if (exitASAP) return result
    }

    // Key value is valid
    if (!result.results[currKey]) addValidationResult(result, currKey, true)
  }

  if (requireMode === 'atLeastOne' && Object.keys(result.results).length === 0) {
    result.pass = false
    addValidationResult(result, 'requireMode', false, ERRS[4]())
  }

  return result
}

export default validateInput
