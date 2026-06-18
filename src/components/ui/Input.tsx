import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? `in-${Math.random().toString(36).slice(2, 9)}`
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-11 rounded-[8px] border bg-surface text-sm text-ink',
              'px-3.5 placeholder:text-ink-subtle',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-brand/25',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error ? 'border-danger focus:border-danger' : 'border-border focus:border-brand',
              'disabled:bg-surface-subtle disabled:cursor-not-allowed',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
        {!error && hint && <p className="text-xs text-ink-muted mt-1.5">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
