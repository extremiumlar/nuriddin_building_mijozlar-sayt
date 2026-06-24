import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { appConfig } from '@/config/app'

const sections = [
  {
    title: 'Loyiha',
    links: [
      { label: 'Nurli Diyor Residence', href: '#projects' },
      { label: 'Qulayliklar', href: '#features' },
      { label: 'Manzil', href: '#projects' },
    ],
  },
  {
    title: 'Mijozlar uchun',
    links: [
      { label: 'Mijoz kabineti', href: '/login' },
      { label: "To'lov grafigi", href: '#' },
      { label: 'Loterеya', href: '#' },
      { label: 'Bron qilish', href: '#' },
    ],
  },
  {
    title: 'Kompaniya',
    links: [
      { label: 'Biz haqimizda', href: '#' },
      { label: 'Yangiliklar', href: '#' },
      { label: 'Aloqa', href: '#' },
    ],
  },
]

const languages = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted/50 dark:bg-surface-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Logo size={44} background="dark" />
              <div>
                <p className="text-base font-extrabold tracking-tight text-ink leading-tight">NURIDDIN BUILDINGS</p>
                <p className="text-xs text-gold-700 font-medium italic mt-0.5">"{appConfig.slogan}"</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-muted max-w-md text-pretty">
              Birinchi loyihamiz — Nurli Diyor Residence. {appConfig.tagline}.
            </p>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-ink-muted">
                <Phone className="h-4 w-4 text-brand shrink-0" />
                <a href={`tel:${appConfig.supportPhone.replace(/\s/g, '')}`} className="hover:text-ink">
                  {appConfig.supportPhone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-ink-muted">
                <Mail className="h-4 w-4 text-brand shrink-0" />
                <a href="mailto:info@buildco.uz" className="hover:text-ink">
                  info@buildco.uz
                </a>
              </div>
              <div className="flex items-center gap-2 text-ink-muted">
                <MapPin className="h-4 w-4 text-brand shrink-0" />
                <span>Mirobod ko'chasi 12, Toshkent</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                className="h-9 w-9 rounded-pill bg-surface border border-border hover:border-brand-200 hover:text-brand transition-colors inline-flex items-center justify-center text-ink-muted"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold text-ink mb-4">{section.title}</p>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-ink-muted hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-ink-muted">
            © 2026 {appConfig.companyName}. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-1 bg-surface border border-border rounded-pill p-0.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className="px-2.5 py-1 text-xs font-medium rounded-pill text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors"
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
