import { useState, type ButtonHTMLAttributes, type PointerEvent } from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  ...rest
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    setIsPressed(true)
    onPointerDown?.(event)
  }

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    setIsPressed(false)
    onPointerUp?.(event)
  }

  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    setIsPressed(false)
    onPointerLeave?.(event)
  }

  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        isPressed && styles['button--pressed'],
        isLoading && styles['button--loading'],
        fullWidth && styles['button--full-width'],
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {isLoading && <span className={styles.button__spinner} aria-hidden="true" />}
      <span className={styles.button__label}>{children}</span>
    </button>
  )
}
