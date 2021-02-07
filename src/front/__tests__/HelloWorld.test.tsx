import { render, screen } from '@testing-library/react'
import HelloWorld from 'front/components/HelloWorld'

describe('HelloWorld', () => {
  test('renders heading with "Hello World"', () => {
    render(<HelloWorld />)
    expect(screen.getByRole('heading', { name: /hello world/i })).not.toBe(null)
  })
})
