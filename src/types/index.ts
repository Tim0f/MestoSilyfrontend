// User types
export interface User {
  id: number
  email: string
  name: string
  role: string
  avatarUrl?: string
  dateOfBirth?: string
  grainBalance: number
}

// News types
export interface News {
  id: number
  title: string
  content: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  mediaUrls?: string[]
}

// Product types
export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  stock: number
  createdAt: string
}

// Section types
export interface Section {
  id: number
  name: string
  description: string
  ageGroup: string
  teacherId: number
  teacher?: Teacher
}

// Teacher types
export interface Teacher {
  id: number
  name: string
  bio?: string
  photoUrl?: string
  specialization?: string
}

// Session types
export interface Session {
  id: number
  sectionId: number
  teacherId: number
  startTime: string
  endTime: string
  capacity: number
  currentEnrollment: number
  location?: string
  section: Section
  teacher: Teacher
}

// Chat types
export type ChatType = 'MARKETPLACE' | 'SECTIONS' | 'SUPPORT'

export interface ChatMessage {
  id: number
  content: string
  userId: number
  chatType: ChatType
  createdAt: string
  user: {
    name: string
    avatarUrl?: string
  }
}

// Achievement types
export type AchievementType = 'GENERAL' | 'SECTION'

export interface Achievement {
  id: number
  title: string
  description: string
  imageUrl?: string
  type: AchievementType
  sectionId?: number
  section?: Section
}

// Order types
export interface Order {
  id: number
  userId: number
  productId: number
  quantity: number
  totalPrice: number
  status: OrderStatus
  createdAt: string
  product: Product
}

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED'

// Enrollment types
export interface Enrollment {
  id: number
  userId: number
  sessionId: number
  status: EnrollmentStatus
  createdAt: string
  session?: Session
}

export type EnrollmentStatus = 'PENDING' | 'PAID' | 'ATTENDED' | 'CANCELLED'

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
}

export interface TransferGrainsForm {
  recipientEmail: string
  amount: number
}

