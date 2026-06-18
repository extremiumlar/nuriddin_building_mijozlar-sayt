import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlay?: boolean
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
      />
      <div
        className={cn(
          'relative bg-surface rounded-t-2xl sm:rounded-card shadow-xl w-full max-h-[95vh] flex flex-col',
          'animate-slide-up',
          sizes[size],
        )}
      >
        {(title || description) && (
          <div className="p-5 border-b border-border flex items-start justify-between gap-4">
            <div className="min-w-0">
              {title && <h2 className="text-lg font-semibold text-ink truncate">{title}</h2>}
              {description && <p className="text-sm text-ink-muted mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-surface-subtle text-ink-muted"
              aria-label="Yopish"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto scrollbar-thin flex-1">{children}</div>
        {footer && <div className="p-5 border-t border-border flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
