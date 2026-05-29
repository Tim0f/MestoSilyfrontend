// App constants
export const APP_NAME = 'Баскетбольный клуб'
export const APP_DESCRIPTION = 'Баскетбольный клуб в Москве для детей и взрослых'

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    ACHIEVEMENTS: '/users/me/achievements',
    ENROLLMENTS: '/users/me/enrollments',
    SESSIONS: '/users/me/sessions',
  },
  NEWS: '/news',
  PRODUCTS: '/products',
  SECTIONS: '/sections',
  SESSIONS: '/sessions',
  CHAT: '/chat',
  GRAINS: {
    TRANSFER: '/grains/transfer',
  },
  ORDERS: '/orders',
}

// Chat types
export const CHAT_TYPES = {
  MARKETPLACE: 'MARKETPLACE',
  SECTIONS: 'SECTIONS',
  SUPPORT: 'SUPPORT',
} as const

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SHOP: '/shop',
  SCHEDULE: '/schedule',
  NEWS: '/news',
  CHATS: '/chats',
  SECTIONS: '/sections',
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
}

// Colors
export const COLORS = {
  PRIMARY: '#f99f16',
  SECONDARY: '#3fa3c4',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
}

// Contact information
export const CONTACT = {
  PHONE: '+7 (495) 123-45-67',
  EMAIL: 'info@basketclub.ru',
  ADDRESS: {
    CITY: 'Москва',
    STREET: 'ул. Спортивная, д. 15',
    BUILDING: 'Спортивный комплекс "Олимп"',
  },
}

