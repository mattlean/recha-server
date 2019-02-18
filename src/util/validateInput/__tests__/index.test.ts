import validateInput from '..'
import ERRS from '../errs'

// TODO: separate tests into groups

describe('validateInput', () => {
  it('should throw error if input or constraint is an array', () => {
    expect(() => validateInput([], {})).toThrow(ERRS[0]())
  })

  it('should return passing result if passing in empty input & constraints', () => {
    expect(validateInput({}, {}).pass).toBe(true)
  })

  it('should return failing result due to missing required input property', () => {
    const result = validateInput({ bar: 123 }, { foo: { isRequired: true } })
    expect(result.input['foo']).toBe(undefined) // eslint-disable-line dot-notation
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons[0]).toBe(ERRS[1]('foo'))
    expect(result.missing.length).toBe(1)
    expect(result.missing[0]).toBe('foo')
    expect(result.pass).toBe(false)
  })

  it('should return passing result for having required input property', () => {
    const result = validateInput({ bar: 123 }, { bar: { isRequired: true } })
    expect(result.input['bar']).toBe(123) // eslint-disable-line dot-notation
    expect(result.results.bar.isValid).toBe(true)
    expect(result.results.bar.reasons.length).toBe(0)
    expect(result.missing.length).toBe(0)
    expect(result.pass).toBe(true)
  })

  it('should return failing result due to input property type mismatch', () => {
    const result = validateInput({ foo: 123 }, { foo: { type: 'string' } })
    expect(typeof result.input['foo']).not.toBe('string') // eslint-disable-line dot-notation
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons[0]).toBe(ERRS[2]('foo', 'string', 'number'))
    expect(result.pass).toBe(false)
  })

  it('should return passing result for having matching type', () => {
    const result = validateInput({ foo: 123 }, { foo: { type: 'number' } })
    expect(result.input['foo']).toBe(123) // eslint-disable-line dot-notation
    expect(result.results.foo.isValid).toBe(true)
    expect(result.results.foo.reasons.length).toBe(0)
    expect(result.pass).toBe(true)
  })

  it('should return failing result due to input property type mismatch for null', () => {
    const result = validateInput({ foo: 123 }, { foo: { type: 'null' } })
    expect(result.input['foo']).not.toBe(null) // eslint-disable-line dot-notation
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons[0]).toBe(ERRS[2]('foo', 'null', 'number'))
    expect(result.pass).toBe(false)
  })

  it('should return passing result for having matching null type', () => {
    const result = validateInput({ foo: null }, { foo: { type: 'null' } })
    expect(result.input['foo']).toBe(null) // eslint-disable-line dot-notation
    expect(result.results.foo.isValid).toBe(true)
    expect(result.results.foo.reasons.length).toBe(0)
    expect(result.pass).toBe(true)
  })

  it('should return failing result due to forbidden null input property value', () => {
    const result = validateInput({ foo: null }, { foo: {} })
    expect(result.input['foo']).toBe(null) // eslint-disable-line dot-notation
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons[0]).toBe(ERRS[3]('foo'))
    expect(result.pass).toBe(false)
  })

  it('should return passing result for having null input property value', () => {
    const result = validateInput({ foo: null }, { foo: { allowNull: true } })
    expect(result.input['foo']).toBe(null) // eslint-disable-line dot-notation
    expect(result.results.foo.isValid).toBe(true)
    expect(result.results.foo.reasons.length).toBe(0)
    expect(result.pass).toBe(true)
  })

  it('should return passing result for having null input property value when type matching for string but also allowing null', () => {
    const result = validateInput({ foo: null }, { foo: { allowNull: true, type: 'string' } })
    expect(result.input['foo']).toBe(null) // eslint-disable-line dot-notation
    expect(result.results.foo.isValid).toBe(true)
    expect(result.results.foo.reasons.length).toBe(0)
    expect(result.pass).toBe(true)
  })

  it('should return failing result due to failing 3 different constraints', () => {
    const result = validateInput(
      { bar: 123, baz: null },
      { foo: { isRequired: true }, bar: { type: 'string' }, baz: {} }
    )
    /* eslint-disable dot-notation */
    expect(result.input['foo']).toBe(undefined)
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons[0]).toBe(ERRS[1]('foo'))
    expect(typeof result.input['bar']).not.toBe('string')
    expect(result.results.bar.isValid).toBe(false)
    expect(result.results.bar.reasons[0]).toBe(ERRS[2]('bar', 'string', 'number'))
    expect(result.input['baz']).toBe(null)
    /* eslint-enable dot-notation */
    expect(result.results.baz.isValid).toBe(false)
    expect(result.results.baz.reasons[0]).toBe(ERRS[3]('baz'))
    expect(result.pass).toBe(false)
  })

  it('should show array of invalid results with showInvalidResults()', () => {
    const invalidResults = validateInput(
      { bar: 123, baz: null },
      { foo: { isRequired: true }, bar: { type: 'string' }, baz: {} }
    ).showInvalidResults('array')
    expect(Array.isArray(invalidResults)).toBe(true)
    expect(invalidResults.length).toBe(3)
    expect(invalidResults[0]).toBe(ERRS[1]('foo'))
    expect(invalidResults[1]).toBe(ERRS[2]('bar', 'string', 'number'))
    expect(invalidResults[2]).toBe(ERRS[3]('baz'))
  })

  it('should show object of invalid results with showInvalidResults()', () => {
    const invalidResults = validateInput(
      { bar: 123, baz: null },
      { foo: { isRequired: true }, bar: { type: 'string' }, baz: {} }
    ).showInvalidResults('object')
    expect(typeof invalidResults).toBe('object')
    /* eslint-disable dot-notation */
    expect(Array.isArray(invalidResults['foo'])).toBe(true)
    expect(invalidResults['foo'].length).toBe(1)
    expect(invalidResults['foo'][0]).toBe(ERRS[1]('foo'))
    expect(Array.isArray(invalidResults['bar'])).toBe(true)
    expect(invalidResults['bar'].length).toBe(1)
    expect(invalidResults['bar'][0]).toBe(ERRS[2]('bar', 'string', 'number'))
    expect(Array.isArray(invalidResults['baz'])).toBe(true)
    expect(invalidResults['baz'].length).toBe(1)
    expect(invalidResults['baz'][0]).toBe(ERRS[3]('baz'))
    /* eslint-enable dot-notation */
  })

  it('should show array of valid results with showValidResults()', () => {
    const validResults = validateInput(
      { bar: 123, baz: null },
      { foo: {}, bar: { isRequired: true, type: 'number' }, baz: { allowNull: true } }
    ).showValidResults('array')
    expect(Array.isArray(validResults)).toBe(true)
    expect(validResults.length).toBe(3)
    expect(validResults[0]).toBe('foo')
    expect(validResults[1]).toBe('bar')
    expect(validResults[2]).toBe('baz')
  })

  it('should show object of valid results with showValidResults()', () => {
    const validResults = validateInput(
      { bar: 123, baz: null },
      { foo: {}, bar: { isRequired: true, type: 'number' }, baz: { allowNull: true } }
    ).showValidResults('object')
    expect(typeof validResults).toBe('object')
    /* eslint-disable dot-notation */
    expect(validResults['foo']).toBe(true)
    expect(validResults['bar']).toBe(true)
    expect(validResults['baz']).toBe(true)
    /* eslint-enable dot-notation */
  })

  it('should return multiple failed results on one key', () => {
    const result = validateInput(
      { foo: null },
      { foo: { allowNull: false, type: 'string' }, bar: { isRequired: true } }
    )
    expect(result.input['foo']).toBe(null) // eslint-disable-line dot-notation
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons.length).toBe(2)
    expect(result.results.foo.reasons[0]).toBe(ERRS[3]('foo'))
    expect(result.results.foo.reasons[1]).toBe(ERRS[2]('foo', 'string', 'null'))
    expect(result.input['bar']).toBe(undefined) // eslint-disable-line dot-notation
    expect(result.results.bar.isValid).toBe(false)
    expect(result.results.bar.reasons.length).toBe(1)
    expect(result.results.bar.reasons[0]).toBe(ERRS[1]('bar'))
    expect(result.missing.length).toBe(1)
    expect(result.missing[0]).toBe('bar')
    expect(result.pass).toBe(false)
  })

  it('should return only one result when exitASAP option is set', () => {
    const result = validateInput(
      { foo: null },
      { foo: { type: 'string' }, bar: { isRequired: true } },
      { exitASAP: true }
    )
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons.length).toBe(1)
    expect(Object.keys(result.results.foo.reasons).length).toBe(1)
    expect(result.results.foo.reasons[0]).toBe(ERRS[3]('foo'))
    expect(result.missing.length).toBe(0)
    expect(result.pass).toBe(false)
  })

  it('should return failing result when requireMode is set to "all" and an input property in constraints is missing', () => {
    const result = validateInput(
      { foo: null, bar: 'world' },
      { foo: { allowNull: true, type: 'string' }, bar: { type: 'string' }, baz: {} },
      { requireMode: 'all' }
    )
    expect(result.results.foo.isValid).toBe(true)
    expect(result.results.bar.isValid).toBe(true)
    expect(result.results.baz.isValid).toBe(false)
    expect(Object.keys(result.results.baz.reasons).length).toBe(1)
    expect(result.results.baz.reasons[0]).toBe(ERRS[1]('baz'))
    expect(result.missing.length).toBe(1)
    expect(result.missing[0]).toBe('baz')
    expect(result.pass).toBe(false)
  })

  it('should return passing result when requireMode is set to "all" and an input property in constraints is missing', () => {
    const result = validateInput(
      { foo: null, bar: 'world', baz: 'hello' },
      { foo: { allowNull: true, type: 'string' }, bar: { type: 'string' }, baz: {} },
      { requireMode: 'all' }
    )
    expect(result.results.foo.isValid).toBe(true)
    expect(result.results.bar.isValid).toBe(true)
    expect(result.results.baz.isValid).toBe(true)
    expect(result.missing.length).toBe(0)
    expect(result.pass).toBe(true)
  })

  it('should return failing result when requireMode is set to "atLeastOne" and all input properties in constraints are missing', () => {
    const result = validateInput({ foo: 'hello' }, { bar: { allowNull: true }, baz: {} }, { requireMode: 'atLeastOne' })
    expect(result.results.requireMode.reasons[0]).toBe(ERRS[4]())
    expect(result.pass).toBe(false)
  })

  it('should return passing result when requireMode is set to "atLeastOne" and at least one input property in constraints is set', () => {
    const result = validateInput(
      { foo: 'hello' },
      { foo: {}, bar: { allowNull: true }, baz: {} },
      { requireMode: 'atLeastOne' }
    )
    expect(result.pass).toBe(true)
  })

  it('should return failing result due to using non-date string when date is required', () => {
    const result = validateInput({ foo: 'hello' }, { foo: { strRules: { isDate: true } } })
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons[0]).toBe(ERRS[5]('foo'))
    expect(result.pass).toBe(false)
  })

  it('should return passing result due to using date string when date is required', () => {
    const result = validateInput({ foo: '2000-01-01' }, { foo: { strRules: { isDate: true } } })
    expect(result.results.foo.isValid).toBe(true)
    expect(result.pass).toBe(true)
  })

  it('should return failing result due to using string shorter than min length', () => {
    const result = validateInput({ foo: '123' }, { foo: { strRules: { isLength: { min: 4 } } } })
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons[0]).toBe(ERRS[6]('foo', 4, 3))
    expect(result.pass).toBe(false)
  })

  it('should return passing result due to using string longer than or equal to min length', () => {
    const result = validateInput({ foo: '123' }, { foo: { strRules: { isLength: { min: 3 } } } })
    expect(result.results.foo.isValid).toBe(true)
    expect(result.pass).toBe(true)
  })

  it('should return failing result due to using string longer than max length', () => {
    const result = validateInput({ foo: '123' }, { foo: { strRules: { isLength: { max: 2 } } } })
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons[0]).toBe(ERRS[7]('foo', 2, 3))
    expect(result.pass).toBe(false)
  })

  it('should return passing result due to using string less than or equal to max length', () => {
    const result = validateInput({ foo: '123' }, { foo: { strRules: { isLength: { max: 3 } } } })
    expect(result.results.foo.isValid).toBe(true)
    expect(result.pass).toBe(true)
  })

  it('should return failing result with 2 results due to failing both min and max length constraints', () => {
    const result = validateInput({ foo: '123' }, { foo: { strRules: { isLength: { min: 4, max: 2 } } } })
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons.length).toBe(2)
    expect(result.results.foo.reasons[0]).toBe(ERRS[6]('foo', 4, 3))
    expect(result.results.foo.reasons[1]).toBe(ERRS[7]('foo', 2, 3))
    expect(result.pass).toBe(false)
  })

  it('should return passing result due to passing both min and max length constraints', () => {
    const result = validateInput({ foo: '123' }, { foo: { strRules: { isLength: { min: 2, max: 4 } } } })
    expect(result.results.foo.isValid).toBe(true)
    expect(result.pass).toBe(true)
  })

  it('should return failing result due to failing isIn string rule', () => {
    const result = validateInput({ foo: '123' }, { foo: { strRules: { isIn: ['ABC'] } } })
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons[0]).toBe(ERRS[8]('foo', ['ABC']))
    expect(result.pass).toBe(false)
  })

  it('should return failing result due to failing isIn string rule with empty array', () => {
    const result = validateInput({ foo: '123' }, { foo: { strRules: { isIn: [] } } })
    expect(result.results.foo.isValid).toBe(false)
    expect(result.results.foo.reasons[0]).toBe(ERRS[8]('foo', []))
    expect(result.pass).toBe(false)
  })

  it('should return passing result due to passing isIn string rule', () => {
    const result = validateInput({ foo: 'ABC' }, { foo: { strRules: { isIn: ['ABC'] } } })
    expect(result.results.foo.isValid).toBe(true)
    expect(result.pass).toBe(true)
  })
})
