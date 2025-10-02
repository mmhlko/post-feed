export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  APP_NAME: 'Social Profile',
} as const;

export const CONSTANTS = {
  POSTS_PER_PAGE: 10,
  MAX_IMAGES_PER_POST: 5,
  MAX_BIO_LENGTH: 500,
} as const;