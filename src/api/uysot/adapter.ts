import type {
  ApartmentInfo,
  FinancialSummary,
  PaymentScheduleItem,
  PaymentStatus,
  PaymentSummary,
  User,
} from '@/types'
import type {
  UysotContract,
  UysotContractListItem,
  UysotMonthlyPayment,
} from './types'

/** Parse Uysot's "dd.MM.yyyy" date format to ISO. */
export const parseUysotDate = (s: string | undefined | null): string => {
  if (!s) return new Date().toISOString()
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (m) {
    const [, d, mo, y] = m
    return new Date(`${y}-${mo}-${d}T00:00:00Z`).toISOString()
  }
  return new Date(s).toISOString()
}

const daysBetween = (a: string, b: string): number =>
  Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000)

const monthlyToScheduleStatus = (p: UysotMonthlyPayment, todayIso: string): PaymentStatus => {
  if (p.paid) return 'paid'
  const due = parseUysotDate(p.date)
  return new Date(due) < new Date(todayIso) ? 'overdue' : 'pending'
}

/** Convert a Uysot Contract into PaymentSummary (header/hero stats). */
export function contractToPaymentSummary(c: UysotContract): PaymentSummary {
  return {
    totalAmount: c.amount,
    paidAmount: c.payed,
    remainingAmount: c.residue,
    currency: (c.currency?.ccy as 'UZS' | 'USD') ?? 'UZS',
    contractDate: new Date(c.createdTimestamp * 1000).toISOString(),
    contractNumber: c.number,
  }
}

export function contractToFinancialSummary(c: UysotContract): FinancialSummary {
  const monthly = c.monthlyPayments.filter((p) => !p.prepayment)
  const monthsTotal = Math.max(1, monthly.length)
  const monthlyAmount =
    monthly.find((p) => !p.paid)?.amount ??
    monthly[0]?.amount ??
    Math.round(c.amount / monthsTotal)

  const remainingMonths = monthly.filter((p) => !p.paid).length
  const nextPending = monthly.find((p) => !p.paid)

  // Overdue calculation
  const todayIso = new Date().toISOString()
  const overdueItems = monthly.filter(
    (p) => !p.paid && new Date(parseUysotDate(p.date)) < new Date(todayIso),
  )
  const debt = overdueItems.reduce((sum, p) => sum + p.amount, 0)
  const debtDays = overdueItems.length
    ? daysBetween(parseUysotDate(overdueItems[0].date), todayIso)
    : 0
  const penaltyAmount = Math.round(monthlyAmount * 0.05 * Math.min(debtDays, 30))

  return {
    totalPrice: c.amount,
    initialPayment: c.prepayment,
    initialPaymentDate: parseUysotDate(c.prepaymentDate),
    monthlyPayment: monthlyAmount,
    totalMonths: monthsTotal,
    remainingMonths,
    paidTotal: c.payed,
    remainingTotal: c.residue,
    nextPaymentDate: nextPending ? parseUysotDate(nextPending.date) : new Date().toISOString(),
    nextPaymentAmount: nextPending?.amount ?? monthlyAmount,
    debt,
    debtDays,
    penaltyAmount: debt > 0 ? penaltyAmount : 0,
    currency: 'UZS',
  }
}

/**
 * Build the PaymentSchedule from the monthlyPayments array inside the contract.
 * (We don't use /contract-payment/{id} — it's currently scope-blocked.)
 */
export function contractToSchedule(c: UysotContract): PaymentScheduleItem[] {
  const todayIso = new Date().toISOString()
  return [...c.monthlyPayments]
    .filter((p) => !p.prepayment)
    .sort((a, b) => {
      const ad = parseUysotDate(a.date)
      const bd = parseUysotDate(b.date)
      return new Date(ad).getTime() - new Date(bd).getTime()
    })
    .map<PaymentScheduleItem>((p) => ({
      id: String(p.id),
      month: parseUysotDate(p.date),
      dueDate: parseUysotDate(p.date),
      amount: p.amount,
      status: monthlyToScheduleStatus(p, todayIso),
      paidDate: p.paidDate ? parseUysotDate(p.paidDate) : undefined,
      receiptUrl: undefined,
    }))
}

export function contractToApartmentInfo(c: UysotContract): ApartmentInfo {
  return {
    block: '1-blok',
    floor: 1,
    number: c.flats?.[0] ? `#${c.flats[0]}` : '—',
    rooms: 2,
    area: 0,
    view: 'street',
    address: 'Lakatsiya, Toshkent shahri',
    constructionProgress: 0,
    estimatedDelivery: new Date().toISOString(),
    objectName: 'Nurli Diyor Residence',
  }
}

export function contractToUser(c: UysotContract | UysotContractListItem): Partial<User> {
  return {
    id: String(c.client?.id ?? c.id),
    fullName: c.client?.name ?? 'Mijoz',
    phone: '',
    role: 'MIJOZ',
    contractNumber: c.number,
    contractDate: new Date(c.createdTimestamp * 1000).toISOString(),
    registeredAt: new Date(c.createdTimestamp * 1000).toISOString(),
  }
}
