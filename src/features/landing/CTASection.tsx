import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/motion'
import { appConfig } from '@/config/app'

export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-dialog bg-gradient-to-br from-brand via-brand-700 to-brand-900 p-8 lg:p-14 shadow-elevated">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.4) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(143, 174, 248, 0.4) 0%, transparent 40%)',
              }}
            />
            <div className="relative grid lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
                  Sizning uyingiz haqida bizning tarjimamizni eshiting
                </h2>
                <p className="mt-3 text-base text-brand-100 max-w-xl text-pretty">
                  Shartnoma imzolagandan so'ng login ma'lumotlari telefoningizga keladi.
                  Hisobni ochish — bepul, taklif sizdan.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link to="/login">
                    <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} className="bg-white text-brand hover:bg-brand-50">
                      Mijoz kabinetiga kirish
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:text-right">
                <p className="text-xs text-brand-100 uppercase tracking-wider">24/7 maslahat</p>
                <a href={`tel:${appConfig.supportPhone.replace(/\s/g, '')}`} className="mt-2 inline-flex items-center gap-2 text-xl lg:text-2xl font-bold text-white hover:underline">
                  <Phone className="h-5 w-5" />
                  {appConfig.supportPhone}
                </a>
                <p className="text-xs text-brand-100 mt-1">Telefon, Telegram, WhatsApp</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
