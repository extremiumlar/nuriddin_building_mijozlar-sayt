import type {
  ActiveDevice,
  ActivityItem,
  Announcement,
  ApartmentInfo,
  ApartmentStage,
  AppDocument,
  Block,
  Booking,
  ConstructionMaterial,
  ConstructionReport,
  DailyForecast,
  DailyResources,
  QualityCertificate,
  FinancialSummary,
  Lottery,
  LotteryTicket,
  LotteryWinner,
  PaymentScheduleItem,
  PaymentSummary,
  ProfileNotificationConfig,
  SavedCard,
  ReferralInfo,
  SupportTicket,
  UpcomingEvent,
  User,
} from '@/types'

export const mockUser: User = {
  id: 'u-1',
  fullName: 'Akbar Aliyev',
  phone: '+998901234567',
  email: 'akbar@example.uz',
  role: 'MIJOZ',
  apartment: { block: '1-blok', floor: 3, number: '304' },
  contractNumber: 'SH-2024-0047',
  contractDate: '2024-11-15T00:00:00Z',
  clientOrderNumber: 47,
  registeredAt: '2024-11-15T08:00:00Z',
}

export const mockApartmentInfo: ApartmentInfo = {
  block: '1-blok',
  floor: 3,
  number: '304',
  rooms: 2,
  area: 65,
  view: 'street',
  address: 'Lakatsiya, Toshkent shahri',
  constructionProgress: 72,
  estimatedDelivery: '2027-12-31T00:00:00Z',
  objectName: 'Nurli Diyor Residence',
}

export const mockFinancialSummary: FinancialSummary = {
  totalPrice: 200_000_000,
  initialPayment: 40_000_000,
  initialPaymentDate: '2024-11-20T00:00:00Z',
  monthlyPayment: 13_333_333,
  totalMonths: 12,
  remainingMonths: 7,
  paidTotal: 120_000_000,
  remainingTotal: 80_000_000,
  nextPaymentDate: '2026-07-01T00:00:00Z',
  nextPaymentAmount: 13_333_333,
  debt: 13_333_333,
  debtDays: 5,
  penaltyAmount: 3_333_333,
  currency: 'UZS',
}

export const mockActiveDevices: ActiveDevice[] = [
  {
    id: 'dev-1',
    deviceName: 'iPhone 15 Pro · Safari',
    platform: 'ios',
    location: 'Toshkent, O\'zbekiston',
    lastActive: '2026-06-11T08:00:00Z',
    current: true,
  },
  {
    id: 'dev-2',
    deviceName: 'Chrome · Windows 11',
    platform: 'web',
    location: 'Toshkent, O\'zbekiston',
    lastActive: '2026-06-10T19:30:00Z',
    current: false,
  },
  {
    id: 'dev-3',
    deviceName: 'Samsung Galaxy S24',
    platform: 'android',
    location: 'Samarqand, O\'zbekiston',
    lastActive: '2026-06-05T11:15:00Z',
    current: false,
  },
]

export const mockProfileNotifications: ProfileNotificationConfig = {
  channels: { sms: true, push: true, email: false },
  events: {
    paymentReminder: 3,
    debtWarning: true,
    constructionUpdate: true,
    lotteryResult: true,
    newDocument: false,
  },
}

export const mockBlocks: Block[] = [
  {
    id: 'b-1',
    name: '1-blok',
    totalFloors: 5,
    completedFloors: 3,
    percentage: 72,
    deliveryDate: '2027-12-31T00:00:00Z',
    status: 'active',
    weeklyRate: 2.4,
    floors: [
      { id: 'f-1-1', number: 1, status: 'done', completionDate: '2025-08-10T00:00:00Z' },
      { id: 'f-1-2', number: 2, status: 'done', completionDate: '2025-11-05T00:00:00Z' },
      { id: 'f-1-3', number: 3, status: 'done', completionDate: '2026-02-12T00:00:00Z' },
      { id: 'f-1-4', number: 4, status: 'in_progress', note: 'Devor terish bosqichida' },
      { id: 'f-1-5', number: 5, status: 'not_started' },
    ],
  },
  {
    id: 'b-2',
    name: '2-blok',
    totalFloors: 2,
    completedFloors: 1,
    percentage: 58,
    deliveryDate: '2028-01-15T00:00:00Z',
    status: 'active',
    weeklyRate: 3.1,
    floors: [
      { id: 'f-2-1', number: 1, status: 'done', completionDate: '2025-12-20T00:00:00Z' },
      { id: 'f-2-2', number: 2, status: 'in_progress', note: 'Tomop pardozlash' },
    ],
  },
]

export const mockReports: ConstructionReport[] = [
  {
    id: 'r-1',
    blockId: 'b-1',
    date: '2026-06-02T10:00:00Z',
    title: 'Haftalik hisobot: 4-qavat',
    description: 'Devorlar 80% tugadi, derazalar o\'rnatildi. Keyingi hafta — gips ishlari.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800',
    ],
    uploadedBy: 'Bosh injener',
  },
  {
    id: 'r-2',
    blockId: 'b-1',
    date: '2026-05-26T10:00:00Z',
    title: 'Liftshax montaj',
    description: 'Lift shaxtasi to\'liq tayyorlandi. Lift mexanizmi keyingi oyda keladi.',
    mediaUrls: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800'],
    uploadedBy: 'Bosh injener',
  },
  {
    id: 'r-3',
    blockId: 'b-2',
    date: '2026-06-01T10:00:00Z',
    title: '2-qavat tom pardozi',
    description: 'Tom plitkalar yotqizildi. Suv izolyatsiyasi 100% bajarildi.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
      'https://images.unsplash.com/photo-1503594384566-461fe158e797?w=800',
    ],
    uploadedBy: 'Texnik nazoratchi',
  },
]

export const mockPaymentSummary: PaymentSummary = {
  totalAmount: 480_000_000,
  paidAmount: 195_000_000,
  remainingAmount: 285_000_000,
  currency: 'UZS',
  contractDate: '2025-01-15T00:00:00Z',
  contractNumber: 'SH-2025-304',
}

const makeSchedule = (): PaymentScheduleItem[] => {
  const items: PaymentScheduleItem[] = []
  const start = new Date('2025-02-01')
  for (let i = 0; i < 24; i++) {
    const due = new Date(start)
    due.setMonth(start.getMonth() + i)
    const today = new Date('2026-06-09')
    let status: PaymentScheduleItem['status']
    let paidDate: string | undefined
    if (due < today && i < 13) {
      status = 'paid'
      paidDate = due.toISOString()
    } else if (due < today) {
      status = 'overdue'
    } else {
      status = 'pending'
    }
    items.push({
      id: `pay-${i}`,
      month: due.toISOString(),
      dueDate: due.toISOString(),
      amount: 20_000_000,
      status,
      paidDate,
      receiptUrl: status === 'paid' ? `/api/payments/receipt/pay-${i}` : undefined,
    })
  }
  return items
}

export const mockSchedule: PaymentScheduleItem[] = makeSchedule()

export const mockSavedCards: SavedCard[] = [
  {
    id: 'card-1',
    brand: 'visa',
    last4: '4242',
    holderName: 'AKBAR ALIYEV',
    expiresAt: '12/28',
    isDefault: true,
  },
  {
    id: 'card-2',
    brand: 'humo',
    last4: '8801',
    holderName: 'AKBAR ALIYEV',
    expiresAt: '06/27',
    isDefault: false,
  },
  {
    id: 'card-3',
    brand: 'uzcard',
    last4: '5511',
    holderName: 'AKBAR ALIYEV',
    expiresAt: '03/29',
    isDefault: false,
  },
]

export const mockLotteries: Lottery[] = [
  {
    id: 'lot-1',
    name: 'Iyun oylik omadli mijoz',
    date: '2026-06-30T18:00:00Z',
    prize: 'iPhone 16 Pro',
    state: 'idle',
    ticketCount: 1247,
  },
  {
    id: 'lot-2',
    name: 'Yarim yillik bosh omadli mijoz',
    date: '2026-07-15T18:00:00Z',
    prize: 'Yangi Chevrolet Cobalt',
    state: 'idle',
    ticketCount: 892,
  },
]

export const mockTickets: LotteryTicket[] = [
  { id: 't-1', number: '#1042', lotteryDate: '2026-06-30T18:00:00Z', lotteryName: 'Iyun oylik omadli mijoz', isWinner: false },
  { id: 't-2', number: '#1043', lotteryDate: '2026-06-30T18:00:00Z', lotteryName: 'Iyun oylik omadli mijoz', isWinner: false },
  { id: 't-3', number: '#0341', lotteryDate: '2026-05-30T18:00:00Z', lotteryName: 'May oylik omadli mijoz', isWinner: true },
]

export const mockWinners: LotteryWinner[] = [
  {
    id: 'w-1',
    date: '2026-05-30T18:00:00Z',
    winnerName: 'Akbar A.',
    ticketNumber: '#0341',
    prize: 'Samsung Galaxy S24',
    lotteryName: 'May oylik omadli mijoz',
  },
  {
    id: 'w-2',
    date: '2026-04-30T18:00:00Z',
    winnerName: 'Dilshod K.',
    ticketNumber: '#0218',
    prize: '50,000,000 so\'m',
    lotteryName: 'Aprel oylik omadli mijoz',
  },
  {
    id: 'w-3',
    date: '2026-03-30T18:00:00Z',
    winnerName: 'Marjona Y.',
    ticketNumber: '#0179',
    prize: 'MacBook Air M3',
    lotteryName: 'Mart oylik omadli mijoz',
  },
]

export const mockBookings: Booking[] = [
  {
    id: 'bk-1',
    facility: 'billiard',
    date: '2026-06-12',
    startTime: '14:00',
    endTime: '15:00',
    status: 'confirmed',
  },
]

export const mockDocuments: AppDocument[] = [
  { id: 'd-1', type: 'contract', title: 'Shartnoma #SH-2025-304', fileSize: 248_000, uploadedAt: '2025-01-15T08:00:00Z', downloadUrl: '#' },
  { id: 'd-2', type: 'receipt', title: 'Kvitansiya — 2026 may', fileSize: 84_000, uploadedAt: '2026-05-05T08:00:00Z', downloadUrl: '#' },
  { id: 'd-3', type: 'passport', title: 'Texnik pasport', fileSize: 512_000, uploadedAt: '2025-02-10T08:00:00Z', downloadUrl: '#' },
]

export const mockReferral: ReferralInfo = {
  code: 'AKBAR-2025',
  totalBonus: 2_000_000,
  referredUsers: [
    { id: 'rf-1', name: 'Sherzod M.', joinedAt: '2026-02-15T08:00:00Z', bonus: 1_000_000 },
    { id: 'rf-2', name: 'Nodira F.', joinedAt: '2026-04-22T08:00:00Z', bonus: 1_000_000 },
  ],
}

export const mockMaterials: ConstructionMaterial[] = [
  {
    id: 'mat-1',
    name: 'Portland sement M-500',
    brand: 'Kuvasoy',
    quantity: '120 tonna',
    purchasedAt: '2026-03-15T00:00:00Z',
    certificateUrl: '#',
    category: 'cement',
  },
  {
    id: 'mat-2',
    name: 'Armaturali metall',
    brand: 'Uzmetkombinat',
    quantity: '18 tonna',
    purchasedAt: '2026-02-10T00:00:00Z',
    certificateUrl: '#',
    category: 'metal',
  },
  {
    id: 'mat-3',
    name: 'PVC deraza ramkasi',
    brand: 'Schüco',
    quantity: '124 dona',
    purchasedAt: '2026-05-08T00:00:00Z',
    certificateUrl: '#',
    category: 'window',
  },
  {
    id: 'mat-4',
    name: 'Mineral pasht (120mm)',
    brand: 'Rockwool',
    quantity: '480 m²',
    purchasedAt: '2026-04-02T00:00:00Z',
    certificateUrl: '#',
    category: 'insulation',
  },
  {
    id: 'mat-5',
    name: 'Vodoemulsion bo\'yoq',
    brand: 'Tikkurila',
    quantity: '60 chelak',
    purchasedAt: '2026-05-22T00:00:00Z',
    certificateUrl: '#',
    category: 'paint',
  },
  {
    id: 'mat-6',
    name: 'Termoblok',
    brand: 'Cemexol',
    quantity: '8400 dona',
    purchasedAt: '2026-04-02T00:00:00Z',
    certificateUrl: '#',
    category: 'other',
  },
]

export const mockCertificates: QualityCertificate[] = [
  {
    id: 'cert-1',
    title: 'ISO 9001:2015',
    issuer: "Sifat boshqaruv tizimi",
    issuedAt: '2024-03-12T00:00:00Z',
    expiresAt: '2027-03-12T00:00:00Z',
    fileUrl: '#',
    type: 'ISO',
  },
  {
    id: 'cert-2',
    title: 'GOST 31108-2016',
    issuer: "Portland sement sertifikati",
    issuedAt: '2026-03-15T00:00:00Z',
    fileUrl: '#',
    type: 'GOST',
  },
  {
    id: 'cert-3',
    title: 'EN 771-1',
    issuer: "Termoblok yevroreglamenti",
    issuedAt: '2026-04-02T00:00:00Z',
    fileUrl: '#',
    type: 'EN',
  },
  {
    id: 'cert-4',
    title: 'FSC Mix Credit',
    issuer: 'O\'rmon boshqaruv kengashi',
    issuedAt: '2025-12-01T00:00:00Z',
    fileUrl: '#',
    type: 'FSC',
  },
  {
    id: 'cert-5',
    title: 'TR CU 010/2011',
    issuer: 'Bolqon Bojxona Ittifoqi',
    issuedAt: '2026-05-08T00:00:00Z',
    fileUrl: '#',
    type: 'TR',
  },
]

export const mockDailyResources: DailyResources = {
  date: '2026-06-11T00:00:00Z',
  workerCount: 12,
  cementTons: 4.2,
  craneCount: 3,
  weatherNote: 'Ochiq havo · 27°C — ish jadval bo\'yicha',
}

export const mockApartmentStages: ApartmentStage[] = [
  {
    key: 'frame',
    label: 'Karkas va devor',
    progress: 100,
    status: 'done',
    startedAt: '2025-04-10T00:00:00Z',
    completedAt: '2026-01-20T00:00:00Z',
  },
  {
    key: 'plaster',
    label: 'Gips va shtukaturka',
    progress: 100,
    status: 'done',
    startedAt: '2026-01-25T00:00:00Z',
    completedAt: '2026-03-10T00:00:00Z',
  },
  {
    key: 'electric',
    label: 'Elektr provodkasi',
    progress: 60,
    status: 'in_progress',
    startedAt: '2026-04-01T00:00:00Z',
    note: 'Yotoq xona va oshxona tugadi, mehmonxona qoldi',
  },
  {
    key: 'plumbing',
    label: 'Santehnika',
    progress: 45,
    status: 'in_progress',
    startedAt: '2026-04-15T00:00:00Z',
    note: 'Hammom asosiy konstruksiyasi tayyor',
  },
  {
    key: 'floor',
    label: 'Pol qoplama',
    progress: 0,
    status: 'not_started',
    note: 'Iyul oyida boshlanishi rejalashtirilgan',
  },
  {
    key: 'finish',
    label: 'Yakuniy pardoz',
    progress: 0,
    status: 'not_started',
  },
]

export const mockActivity: ActivityItem[] = [
  {
    id: 'a-1',
    kind: 'construction',
    title: '4-qavat devor terish 80% tugadi',
    description: 'Bosh injener Akmal Yusupov tomonidan tasdiqlangan',
    occurredAt: '2026-06-10T15:00:00Z',
  },
  {
    id: 'a-2',
    kind: 'payment',
    title: 'May oyi to\'lovi qabul qilindi',
    description: '20,000,000 so\'m · PDF chek tayyor',
    occurredAt: '2026-06-05T10:30:00Z',
    meta: 'pay-13',
  },
  {
    id: 'a-3',
    kind: 'lottery',
    title: 'Iyun loterеyasiga 2 ta chipta qo\'shildi',
    description: 'Chipta #1042, #1043',
    occurredAt: '2026-06-05T10:31:00Z',
  },
  {
    id: 'a-4',
    kind: 'announcement',
    title: 'Basseyn ishga tushdi!',
    description: 'Bugundan boshlab mijozlar uchun ochiq',
    occurredAt: '2026-06-08T09:00:00Z',
  },
  {
    id: 'a-5',
    kind: 'booking',
    title: 'Bilyard zalini bron qildingiz',
    description: '12-iyun · 14:00 – 15:00',
    occurredAt: '2026-06-03T18:20:00Z',
  },
  {
    id: 'a-6',
    kind: 'document',
    title: 'Yangi hujjat qo\'shildi',
    description: 'Texnik pasport · 500 KB',
    occurredAt: '2026-05-28T11:00:00Z',
  },
]

export const mockAnnouncements: Announcement[] = [
  {
    id: 'an-1',
    tone: 'celebration',
    title: '🎉 Basseyn ochildi!',
    body: '25 metrlik isitiladigan basseyn bugundan boshlab faol. Birinchi hafta bepul demo.',
    publishedAt: '2026-06-08T09:00:00Z',
    authorName: 'Boshqaruv guruhi',
  },
  {
    id: 'an-2',
    tone: 'event',
    title: 'Iyun loterеyasi 30-kun, 18:00',
    body: 'iPhone 16 Pro bosh sovrin. Jonli efir saytda tomosha qilish mumkin.',
    publishedAt: '2026-06-05T08:00:00Z',
    authorName: 'Marketing bo\'limi',
  },
  {
    id: 'an-3',
    tone: 'info',
    title: 'Hujjat topshirish eslatmasi',
    body: '15-iyungacha hujjat to\'plamini yangilab bering. Eslatma SMS orqali yuborildi.',
    publishedAt: '2026-06-01T08:00:00Z',
    authorName: 'Hujjatlar bo\'limi',
  },
  {
    id: 'an-4',
    tone: 'warning',
    title: 'Lift ishlamayapti — 12-iyun',
    body: 'Profilaktika ishlari sababli 12-iyun 9:00–13:00 oralig\'ida lift to\'xtatiladi.',
    publishedAt: '2026-06-09T12:00:00Z',
    authorName: 'Texnik xizmat',
  },
]

export const mockForecast: DailyForecast[] = [
  { date: '2026-06-11', tempMin: 21, tempMax: 29, condition: 'sunny', worksAffected: false },
  { date: '2026-06-12', tempMin: 20, tempMax: 28, condition: 'sunny', worksAffected: false },
  { date: '2026-06-13', tempMin: 18, tempMax: 25, condition: 'cloudy', worksAffected: false },
  { date: '2026-06-14', tempMin: 16, tempMax: 22, condition: 'rainy', worksAffected: true },
  { date: '2026-06-15', tempMin: 17, tempMax: 24, condition: 'cloudy', worksAffected: false },
]

export const mockUpcoming: UpcomingEvent[] = [
  {
    id: 'u-1',
    kind: 'payment',
    title: 'Iyun oyi to\'lovi',
    subtitle: '13,333,333 so\'m',
    date: '2026-07-01T00:00:00Z',
    priority: 'high',
  },
  {
    id: 'u-2',
    kind: 'lottery',
    title: 'Iyun oylik loterеya',
    subtitle: 'iPhone 16 Pro · jonli efir',
    date: '2026-06-30T18:00:00Z',
    priority: 'medium',
  },
  {
    id: 'u-3',
    kind: 'booking',
    title: 'Bilyard zali',
    subtitle: 'Sizning bron — 14:00',
    date: '2026-06-12T14:00:00Z',
    priority: 'medium',
  },
  {
    id: 'u-4',
    kind: 'milestone',
    title: '4-qavat tomi yopilishi',
    subtitle: '1-blok · ~7 kun ichida',
    date: '2026-06-18T00:00:00Z',
    priority: 'low',
  },
  {
    id: 'u-5',
    kind: 'announcement',
    title: 'Lift profilaktika',
    subtitle: '9:00–13:00 oralig\'ida',
    date: '2026-06-12T09:00:00Z',
    priority: 'low',
  },
]

export const mockTickets_support: SupportTicket[] = [
  {
    id: 'st-1',
    category: 'payment',
    subject: 'Mayda kechikishlar bo\'yicha savol',
    description: 'May to\'lov 2 kun kech tushdi, kechikish jarimasi qo\'llanildimi?',
    status: 'in_review',
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-06-02T08:00:00Z',
  },
  {
    id: 'st-2',
    category: 'apartment',
    subject: 'Eshik o\'rnatish sanasi',
    description: 'Kvartira 304 ga kirish eshigi qachon o\'rnatiladi?',
    status: 'resolved',
    createdAt: '2026-05-10T08:00:00Z',
    updatedAt: '2026-05-15T08:00:00Z',
  },
]
