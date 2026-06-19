import { cn } from '@/lib/utils'

interface LogoProps {
  size?: number
  className?: string
  /** Background tone: 'auto' = transparent (inherits), 'dark' = forest green, 'light' = surface */
  background?: 'auto' | 'dark' | 'light' | 'gold'
  /** Forces gold color even on light bg */
  forceGold?: boolean
}

/**
 * NURIDDIN BUILDINGS — stylized "N" silhouette built from two tower forms.
 * Left tower: skewed gold N stem with thin verticals.
 * Right tower: bold gold pillar with vertical lines (windows).
 * The diagonal beam of "N" connects them — also gold.
 */
export function Logo({ size = 40, className, background = 'auto', forceGold = false }: LogoProps) {
  const bg =
    background === 'dark'
      ? 'bg-brand-700'
      : background === 'light'
        ? 'bg-surface'
        : background === 'gold'
          ? 'bg-gold'
          : ''

  const goldColor = '#C9A961'
  const goldLight = '#EAD292'

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-element overflow-hidden shrink-0',
        bg,
        className,
      )}
      style={{ width: size, height: size }}
      aria-label="Nuriddin Buildings"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'block',
          background === 'gold'
            ? 'text-brand-700'
            : background === 'light' && !forceGold
              ? 'text-brand'
              : 'text-gold',
        )}
      >
        <defs>
          <linearGradient id="logoGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={goldLight} />
            <stop offset="100%" stopColor={goldColor} />
          </linearGradient>
        </defs>
        {/* Left tower — slanted N stem */}
        <g fill={forceGold ? 'url(#logoGold)' : 'currentColor'}>
          {/* Main slanted left bar (N's left stroke) */}
          <path d="M 22 18 L 32 18 L 32 82 L 22 82 Z" />
          {/* Diagonal connecting beam (N's diagonal) */}
          <path d="M 32 18 L 42 18 L 78 82 L 68 82 Z" />
          {/* Right tower outline */}
          <path d="M 68 18 L 78 18 L 78 82 L 68 82 Z" />
        </g>

        {/* Window slits on left tower (small) */}
        <g fill={background === 'gold' ? '#0E3D2E' : '#0E3D2E'} opacity="0.85">
          <rect x="25" y="32" width="4" height="6" rx="0.5" />
          <rect x="25" y="42" width="4" height="6" rx="0.5" />
          <rect x="25" y="52" width="4" height="6" rx="0.5" />
          <rect x="25" y="62" width="4" height="6" rx="0.5" />
        </g>

        {/* Window slits on right tower (bigger, 3 columns) */}
        <g fill={background === 'gold' ? '#0E3D2E' : '#0E3D2E'} opacity="0.85">
          {/* Left column on right tower */}
          <rect x="69.5" y="28" width="1.6" height="44" rx="0.5" />
          {/* Middle column */}
          <rect x="73" y="28" width="1.6" height="44" rx="0.5" />
          {/* Right column */}
          <rect x="76.4" y="28" width="1.6" height="44" rx="0.5" />
        </g>
      </svg>
    </div>
  )
}

/** Word-mark: NURIDDIN BUILDINGS with small logo */
export function LogoWordmark({
  size = 36,
  vertical = false,
  className,
  background = 'auto',
}: LogoProps & { vertical?: boolean }) {
  const onDark = background === 'dark'
  return (
    <div className={cn('inline-flex items-center', vertical ? 'flex-col gap-1' : 'gap-2.5', className)}>
      <Logo size={size} background={background} />
      <div className={cn(vertical && 'text-center')}>
        <p className={cn('font-extrabold tracking-tight leading-none', onDark ? 'text-white' : 'text-ink', size > 40 ? 'text-base' : 'text-sm')}>
          NURIDDIN
        </p>
        <p className={cn('font-medium tracking-[0.18em] leading-none mt-0.5', onDark ? 'text-gold-300' : 'text-ink-muted', size > 40 ? 'text-[10px]' : 'text-[9px]')}>
          BUILDINGS
        </p>
      </div>
    </div>
  )
}
