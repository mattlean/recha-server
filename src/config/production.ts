import { CONFIG } from '../types'

if (process.env.NODE_ENV === 'production') {
  if (!process.env.DB_HOST) throw new Error('DB_HOST must be explicitly defined when running in production mode')
  if (!process.env.DB_NAME) throw new Error('DB_NAME must be explicitly defined when running in production mode')
  if (!process.env.DB_USER) throw new Error('DB_USER must be explicitly defined when running in production mode')
  if (!process.env.DB_PASS) throw new Error('DB_PASS must be explicitly defined when running in production mode')
  if (!process.env.DB_PORT) throw new Error('DB_PORT must be explicitly defined when running in production mode')
  if (!process.env.PORT) throw new Error('PORT must be explicitly defined when running in production mode')
}

export const DB: CONFIG['DB'] = {
  HOST: process.env.DB_HOST,
  NAME: process.env.DB_NAME,
  USER: process.env.DB_USER,
  PASS: process.env.DB_PASS,
  PORT: Number(process.env.DB_PORT)
}

export const PORT: CONFIG['APP']['PORT'] = Number(process.env.PORT)
