// Uysot CRM Open API — response types
// Real javobdagi field nomlariga moslangan (api.service.app.uysot.uz)

/** Standart Uysot envelope */
export interface UysotEnvelope<T> {
  data: T
  message: string
  error: null | { messageCode: number; args: Record<string, unknown> }
  accept: boolean
  errors: unknown[]
  requestId: string | null
}

/** Pagination wrapper for list endpoints */
export interface UysotPaging<T> {
  totalPages: number
  currentPage: number
  totalElements: number
  data: T[]
}

export interface UysotCurrency {
  ccy: 'UZS' | 'USD' | string
  value: number
  basic: boolean
  updateTimestamp: number | null
  id: number | null
}

export interface UysotClient {
  id: number
  name: string
  inn?: string
  status: 'ACTIVE' | 'INACTIVE' | string
}

export interface UysotResponsibleBy {
  id: number
  fullName: string
  avatar?: string | null
}

export type UysotMonthlyPaymentType =
  | 'MONTHLY_PAYMENT'
  | 'PREPAYMENT'
  | 'MORTGAGE'
  | string

export interface UysotMonthlyPayment {
  id: number
  amount: number
  /** Format: "dd.MM.yyyy" — e.g. "24.07.2026" */
  date: string
  /** How much of this scheduled installment is already paid */
  payment: number
  /** True if this row is a prepayment line, not a monthly installment */
  prepayment: boolean
  /** Full installment cleared */
  paid: boolean
  type: UysotMonthlyPaymentType
  /** ISO/string when the payment was settled, null if still open */
  paidDate: string | null
}

export type UysotContractStatus =
  | 'STARTED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'CANCELLED'
  | 'CLOSED'
  | string

/** Full contract — what GET /contract/{id} returns inside `data` */
export interface UysotContract {
  id: number
  number: string                     // "NUR-4"
  payNumber: string                  // "264010284"
  delay: number
  amount: number                     // total contract price
  prepayment: number                 // upfront payment
  prepaymentDate: string             // "24.06.2026"
  payed: number                      // amount paid so far
  residue: number                    // remaining
  discount: number
  discountDescription: string
  surcharge: number
  createdTimestamp: number
  createdBy: string
  cancelledTimestamp: number | null
  cancelledBy: string | null
  cancelText: string | null
  deletedTimestamp: number | null
  deletedBy: string | null
  baseId: number | null
  baseNumber: string | null
  client: UysotClient
  flats: number[]                    // apartment IDs
  status: UysotContractStatus
  comment: string | null
  fields: UysotFieldValue[]
  responsibleBy: string              // string in detail, object in filter
  responsibleById: number
  broker: string
  brokerId: number
  currency: UysotCurrency
  mortgage: number
  mortgagePayed: number
  mortgageDate: string | null
  prepaymentParts: UysotMonthlyPayment[]
  monthlyPayments: UysotMonthlyPayment[]
}

/** Lightweight contract shape returned by POST /contract/filter `data.data[]` */
export interface UysotContractListItem {
  id: number
  number: string
  payNumber: string
  createdTimestamp: number
  status: UysotContractStatus
  responsibleBy: UysotResponsibleBy
  client: UysotClient
  amount: number
  prepayment: number
  discount: number
  dealPrice: number
  paidAmount: number
  currency: UysotCurrency
  flatIds: number[]
  signatureStatus: string | null
  fields: UysotFieldValue[] | null
  canceledBy: string | null
  canceledTimestamp: number | null
}

export interface UysotContractFilter {
  page: number
  size: number
  search?: string
  contractNumber?: string
  startDate?: string                // "01.01.2025"
  finishDate?: string
  responsibleByIds?: number[]
  currencies?: number[]
  statuses?: UysotContractStatus[]
}

// ===== FIELDS (custom) =====
export interface UysotFieldValue {
  fieldId: number
  value: string | number | boolean | null
}

export type UysotFieldKind = 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'SELECT' | string

export interface UysotField {
  id: number
  name: string
  code?: string
  kind: UysotFieldKind
  options?: Array<{ id: number; value: string }>
  required?: boolean
}

// ===== Address =====
export interface UysotCountry {
  id: number
  uz: string
  ru: string
  en: string
  zone: string
}

// ===== LEAD (currently 403 — endpoint blocked by scopes) =====
export interface UysotLead {
  id: number
  name: string
  contacts: Array<{ name: string; phones: string[] }>
  createdAt?: string
}

export interface UysotLeadFilter {
  page: number
  size: number
  search?: string
}
