import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InputBlock } from './InputBlock'

describe('InputBlock', () => {
  it('отображает значение и валюту', () => {
    render(
      <InputBlock
        direction="left"
        currency="RUB"
        min={10000}
        max={70000000}
        step={100}
        value={12300}
        onChange={() => {}}
        isActive={false}
        otherIsEditing={false}
        onFocus={() => {}}
        onBlur={() => {}}
      />
    )

    expect(screen.getByRole('spinbutton')).toHaveValue(12300)
    expect(screen.getByText('RUB')).toBeInTheDocument()
  })

  it('вызывает onChange при blur и валидном значении', () => {
    const handleChange = vi.fn()

    render(
      <InputBlock
        direction="left"
        currency="RUB"
        min={10000}
        max={70000000}
        step={100}
        value={10000}
        onChange={handleChange}
        isActive={true}
        otherIsEditing={false}
        onFocus={() => {}}
        onBlur={() => {}}
      />
    )

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '10500' } })
    fireEvent.blur(input)

    expect(handleChange).toHaveBeenCalledWith(10500)
  })

  it('откатывает к min при значении меньше допустимого', () => {
    const handleChange = vi.fn()

    render(
      <InputBlock
        direction="left"
        currency="RUB"
        min={10000}
        max={70000000}
        step={100}
        value={10000}
        onChange={handleChange}
        isActive={true}
        otherIsEditing={false}
        onFocus={() => {}}
        onBlur={() => {}}
      />
    )

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '5000' } })
    fireEvent.blur(input)

    expect(handleChange).toHaveBeenCalledWith(10000)
  })
})
