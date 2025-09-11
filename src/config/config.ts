// Frontend Environment Configuration
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  API_VERSION: 'v1',

  // App Configuration
  APP_NAME: 'ERP MIF Maroc',
  APP_VERSION: '1.0.0',

  // Development settings
  DEBUG: import.meta.env.DEV,

  // Feature flags
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DASHBOARD: true,
  ENABLE_REPORTS: true,

  // UI Configuration
  THEME: {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],

  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds
  FILE_UPLOAD_TIMEOUT: 120000, // 2 minutes
};
