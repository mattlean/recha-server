import { isIn as validatorIsIn, toDate } from 'validator'

import ERRS from './errs'
import { Constraints, Options, outputType, ValidateInputResult } from './types'

const createValidateInputResult = (input: object, constraints: Constraints, options: Options): ValidateInputResult => ({
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
})

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
    validationResult.isValid = false
    result.pass = false
    validationResult.reasons.push(reason)
  }

  return result
}

/**
 * Validate input
 * @param input Input object of key and value pairs
 * @param constraints Constraints that the input is validated with
 * @param options (Optional) Options to set different validation behaviors
 */
const validateInput = (input: object, constraints: Constraints, options: Options = {}): ValidateInputResult => {
  if (typeof input !== 'object' || Array.isArray(input)) {
    throw new Error(ERRS[0]())
  }

  const result = createValidateInputResult(input, constraints, options)

  let atLeastOne = false
  const constraintsKeys = Object.keys(constraints)
  const { requireMode } = options

  for (let i = 0; i < constraintsKeys.length; i += 1) {
    const currKey = constraintsKeys[i]
    const currVal = input[currKey]
    const { allowNull, isRequired, strRules, type } = constraints[currKey]
    const { exitASAP } = options

    if (requireMode === 'atLeastOne') {
      if (currVal !== undefined && !atLeastOne) atLeastOne = true
    } else if ((isRequired || requireMode === 'all') && currVal === undefined) {
      // Missing required property
      addValidationResult(result, currKey, false, ERRS[1](currKey))
      result.missing.push(currKey)
      if (exitASAP) return result
    }

    if (!allowNull && currVal === null && type !== 'null') {
      // Forbidden null
      addValidationResult(result, currKey, false, ERRS[3](currKey))
      if (exitASAP) return result
    }

    let currValType
    if (currVal === null) currValType = 'null'
    else currValType = typeof currVal

    if (
      type &&
      ((currVal === null && type !== 'null' && !allowNull) ||
        ((currVal || currVal === '' || currVal === false) && currValType !== type))
    ) {
      // Type mismatch
      addValidationResult(result, currKey, false, ERRS[2](currKey, type, currValType))
      if (exitASAP) return result
    }

    if (strRules && Object.keys(strRules).length > 0 && currValType === 'string' && (type === 'string' || !type)) {
      const { isDate, isIn, isLength } = strRules

      if (isDate) {
        if (toDate(currVal) === null) {
          addValidationResult(result, currKey, false, ERRS[5](currKey))
          if (exitASAP) return result
        }
      }

      if (Array.isArray(isIn)) {
        if (!validatorIsIn(currVal, isIn)) {
          addValidationResult(result, currKey, false, ERRS[8](currKey, isIn))
          if (exitASAP) return result
        }
      }

      if (isLength) {
        if (isLength.min && isLength.min > -1) {
          if (currVal.length < isLength.min) {
            addValidationResult(result, currKey, false, ERRS[6](currKey, isLength.min, currVal.length))
            if (exitASAP) return result
          }
        }

        if (isLength.max && isLength.max > -1) {
          if (currVal.length > isLength.max) {
            addValidationResult(result, currKey, false, ERRS[7](currKey, isLength.max, currVal.length))
            if (exitASAP) return result
          }
        }
      }
    }

    // Key value is valid
    if (!result.results[currKey]) addValidationResult(result, currKey, true)
  }

  if (requireMode === 'atLeastOne' && !atLeastOne) {
    result.pass = false
    addValidationResult(result, 'requireMode', false, ERRS[4]())
  }

  return result
}

export default validateInput
