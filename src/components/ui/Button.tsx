import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'gold'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-700 active:bg-brand-800 shadow-xs hover:shadow-card-hover',
  secondary:
    'bg-brand-50 text-brand hover:bg-brand-100 active:bg-brand-200 dark:bg-brand/15 dark:text-brand-300 dark:hover:bg-brand/25',
  ghost:
    'bg-transparent text-ink-muted hover:bg-surface-subtle hover:text-ink',
  danger:
    'bg-danger text-white hover:bg-red-700 active:bg-red-800 shadow-xs hover:shadow-card-hover',
  success:
    'bg-success text-white hover:bg-green-700 active:bg-green-800 shadow-xs hover:shadow-card-hover',
  outline:
    'bg-surface text-ink border border-border hover:bg-surface-subtle hover:border-border-strong',
  gold:
    'bg-gold text-white hover:bg-gold-600 active:bg-gold-700 shadow-xs hover:shadow-glow-gold',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-10 w-10 p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-element font-medium select-none',
          'transition-all duration-200 ease-apple',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30',
          'active:scale-[0.97]',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  },
)
Button.displayName = 'Button'
