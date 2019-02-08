import validateInput, { ERRS } from '..'

describe('validateInput', () => {
  const exInput = { bar: 123, baz: null }
  const exConstraintsA = { foo: { isRequired: true }, bar: { type: 'string' }, baz: {} }
  const exConstraintsB = { foo: {}, bar: { isRequired: true, type: 'number' }, baz: { allowNull: true } }

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
    expect(result.pass).toBe(false)
  })

  it('should return passing result for having required input property', () => {
    const result = validateInput({ bar: 123 }, { bar: { isRequired: true } })
    expect(result.input['bar']).toBe(123) // eslint-disable-line dot-notation
    expect(result.results.bar.isValid).toBe(true)
    expect(result.results.bar.reasons.length).toBe(0)
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
    const result = validateInput({ foo: null }, { foo: { allowNull: true, type: 'null' } })
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

  it('should return failing result due to failing 3 different constraints', () => {
    const result = validateInput(exInput, exConstraintsA)
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
    const invalidResults = validateInput(exInput, exConstraintsA).showInvalidResults('array')
    expect(Array.isArray(invalidResults)).toBe(true)
    expect(invalidResults.length).toBe(3)
    expect(invalidResults[0]).toBe(ERRS[1]('foo'))
    expect(invalidResults[1]).toBe(ERRS[2]('bar', 'string', 'number'))
    expect(invalidResults[2]).toBe(ERRS[3]('baz'))
  })

  it('should show object of invalid results with showInvalidResults()', () => {
    const invalidResults = validateInput(exInput, exConstraintsA).showInvalidResults('object')
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
    const validResults = validateInput(exInput, exConstraintsB).showValidResults('array')
    expect(Array.isArray(validResults)).toBe(true)
    expect(validResults.length).toBe(3)
    expect(validResults[0]).toBe('foo')
    expect(validResults[1]).toBe('bar')
    expect(validResults[2]).toBe('baz')
  })

  it('should show object of valid results with showValidResults()', () => {
    const validResults = validateInput(exInput, exConstraintsB).showValidResults('object')
    expect(typeof validResults).toBe('object')
    /* eslint-disable dot-notation */
    expect(validResults['foo']).toBe(true)
    expect(validResults['bar']).toBe(true)
    expect(validResults['baz']).toBe(true)
    /* eslint-enable dot-notation */
  })

  // TODO: test multiple reasons on one key

  // TODO: test exitASAP

  // TODO: test requireModes
})
