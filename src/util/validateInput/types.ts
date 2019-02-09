interface Constraint {
  allowNull?: boolean
  isRequired?: boolean
  strRules?: StrRules
  type?: string
}

export interface Constraints {
  [key: string]: Constraint
}

export interface Options {
  exitASAP?: boolean
  requireMode?: requireMode
}

export type outputType = 'array' | 'object'

type requireMode = 'all' | 'atLeastOne' | 'default'

interface StrRules {
  isDate?: boolean
  isIn?: string[]
  isLength?: {
    max?: number
    min?: number
  }
}

interface ValidationResult {
  isValid: boolean
  reasons: string[]
}

interface ValidationResults {
  [key: string]: ValidationResult
}

export interface ValidateInputResult {
  constraints: Constraints
  input: object
  missing: string[]
  options: Options
  pass: boolean
  results: ValidationResults
  showInvalidResults: (outputType: outputType) => ValidationResult[] | ValidationResults
  showValidResults: (outputType: outputType) => ValidationResult[] | ValidationResults
}
