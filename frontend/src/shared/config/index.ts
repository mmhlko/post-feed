export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
} as const;

export const CONSTANTS = {
  POSTS_PER_PAGE: 5,
  MAX_IMAGES_PER_POST: 5,
  MAX_BIO_LENGTH: 500,
  MAX_POST_LENGTH: 500,
} as const;
