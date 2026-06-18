export type UserRole = 'ADMIN' | 'MIJOZ'

export interface User {
  id: string
  fullName: string
  phone: string
  email?: string
  role: UserRole
  avatarUrl?: string
  apartment?: {
    block: string
    floor: number
    number: string
  }
  contractNumber?: string
  contractDate?: string
  clientOrderNumber?: number
  registeredAt: string
}

export interface ApartmentInfo {
  block: string
  floor: number
  number: string
  rooms: 1 | 2 | 3 | 4
  area: number
  view: 'street' | 'garden' | 'mountain'
  address: string
  constructionProgress: number
  estimatedDelivery: string
  objectName: string
}

// === Construction extras ===
export interface ConstructionMaterial {
  id: string
  name: string
  brand: string
  quantity: string
  purchasedAt: string
  certificateUrl?: string
  category: 'cement' | 'metal' | 'window' | 'insulation' | 'paint' | 'other'
}

export interface QualityCertificate {
  id: string
  title: string
  issuer: string
  issuedAt: string
  expiresAt?: string
  fileUrl: string
  thumbnailUrl?: string
  type: 'ISO' | 'GOST' | 'FSC' | 'EN' | 'TR'
}

export interface DailyResources {
  date: string
  workerCount: number
  cementTons: number
  craneCount: number
  weatherNote?: string
}

// === Per-apartment construction stages ===
export type StageStatus = 'done' | 'in_progress' | 'not_started'
export interface ApartmentStage {
  key: string
  label: string
  progress: number
  status: StageStatus
  startedAt?: string
  completedAt?: string
  note?: string
}

// === Activity / events feed ===
export type ActivityKind =
  | 'payment'
  | 'construction'
  | 'lottery'
  | 'booking'
  | 'document'
  | 'announcement'

export interface ActivityItem {
  id: string
  kind: ActivityKind
  title: string
  description: string
  occurredAt: string
  meta?: string
}

// === Community announcements ===
export type AnnouncementTone = 'info' | 'warning' | 'celebration' | 'event'
export interface Announcement {
  id: string
  tone: AnnouncementTone
  title: string
  body: string
  publishedAt: string
  authorName: string
}

// === Weather forecast for delivery zone ===
export interface DailyForecast {
  date: string
  tempMin: number
  tempMax: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  worksAffected: boolean
}

// === Upcoming events ===
export type UpcomingEventKind = 'payment' | 'lottery' | 'booking' | 'milestone' | 'announcement'
export interface UpcomingEvent {
  id: string
  kind: UpcomingEventKind
  title: string
  subtitle?: string
  date: string
  priority: 'high' | 'medium' | 'low'
}

export interface FinancialSummary {
  totalPrice: number
  initialPayment: number
  initialPaymentDate: string
  monthlyPayment: number
  totalMonths: number
  remainingMonths: number
  paidTotal: number
  remainingTotal: number
  nextPaymentDate: string
  nextPaymentAmount: number
  debt: number
  debtDays: number
  penaltyAmount: number
  currency: 'UZS'
}

export interface ActiveDevice {
  id: string
  deviceName: string
  platform: 'ios' | 'android' | 'web'
  location: string
  lastActive: string
  current: boolean
}

export interface ProfileNotificationConfig {
  channels: {
    sms: boolean
    push: boolean
    email: boolean
  }
  events: {
    paymentReminder: 1 | 3 | 7
    debtWarning: boolean
    constructionUpdate: boolean
    lotteryResult: boolean
    newDocument: boolean
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface ApiError {
  success: false
  message: string
  code: number
}

export interface ApiSuccess<T> {
  success: true
  data: T
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// === Construction ===
export type BlockStatus = 'active' | 'planned' | 'completed'
export type FloorStatus = 'done' | 'in_progress' | 'not_started'

export interface Floor {
  id: string
  number: number
  status: FloorStatus
  completionDate?: string
  note?: string
}

export interface Block {
  id: string
  name: string
  totalFloors: number
  completedFloors: number
  percentage: number
  deliveryDate: string
  status: BlockStatus
  floors: Floor[]
  weeklyRate: number
}

export interface ConstructionReport {
  id: string
  blockId: string
  date: string
  title: string
  description: string
  mediaUrls: string[]
  uploadedBy: string
}

// === Payments ===
export type PaymentStatus = 'paid' | 'pending' | 'overdue'

export interface PaymentScheduleItem {
  id: string
  month: string
  dueDate: string
  amount: number
  status: PaymentStatus
  paidDate?: string
  receiptUrl?: string
}

export interface PaymentSummary {
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  currency: 'UZS' | 'USD'
  contractDate: string
  contractNumber: string
}

export interface NotificationSettings {
  sms: boolean
  email: boolean
  push: boolean
  daysBefore: 1 | 3 | 7
  phone: string
  email_addr: string
}

export type CardBrand = 'visa' | 'mastercard' | 'humo' | 'uzcard'

export interface SavedCard {
  id: string
  brand: CardBrand
  last4: string
  holderName: string
  expiresAt: string
  isDefault: boolean
}

// === Lottery ===
export type LotteryState = 'idle' | 'live' | 'revealing' | 'winner'

export interface Lottery {
  id: string
  name: string
  date: string
  prize: string
  state: LotteryState
  ticketCount: number
  winnerName?: string
  winnerTicket?: string
}

export interface LotteryTicket {
  id: string
  number: string
  lotteryDate: string
  lotteryName: string
  isWinner: boolean
}

export interface LotteryWinner {
  id: string
  date: string
  winnerName: string
  ticketNumber: string
  prize: string
  lotteryName: string
}

// === Bookings ===
export type FacilityType =
  | 'billiard'
  | 'table_tennis'
  | 'gym'
  | 'bbq'
  | 'swimming_pool'
  | 'sauna'
  | 'cinema'
  | 'kids_playground'
  | 'conference'
  | 'coworking'
export type SlotStatus = 'free' | 'taken' | 'mine'

export interface FacilityMeta {
  type: FacilityType
  label: string
  description: string
  hoursFrom: number
  hoursTo: number
  capacity: number
  isFree: boolean
  pricePerHour?: number
}

export interface BookingSlot {
  time: string
  status: SlotStatus
  bookingId?: string
}

export interface Booking {
  id: string
  facility: FacilityType
  date: string
  startTime: string
  endTime: string
  status: 'confirmed' | 'cancelled'
}

// === Documents ===
export type DocumentType = 'contract' | 'receipt' | 'act' | 'passport' | 'other'

export interface AppDocument {
  id: string
  type: DocumentType
  title: string
  fileSize: number
  uploadedAt: string
  downloadUrl: string
}

// === Support ===
export type TicketStatus = 'open' | 'in_review' | 'resolved' | 'closed'
export type TicketCategory = 'technical' | 'payment' | 'apartment' | 'other'

export interface SupportTicket {
  id: string
  category: TicketCategory
  subject: string
  description: string
  status: TicketStatus
  createdAt: string
  updatedAt: string
}

// === Referral ===
export interface ReferralInfo {
  code: string
  totalBonus: number
  referredUsers: Array<{
    id: string
    name: string
    joinedAt: string
    bonus: number
  }>
}
