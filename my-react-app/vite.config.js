import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// В dev-режиме фронт и бэк работают на разных портах, поэтому проксируем
// /api и /media на Django (по умолчанию http://127.0.0.1:8000). Это повторяет
// поведение прод-сервера, где nginx отдаёт оба пути с одного домена, и
// полностью исключает CORS-проблемы во время разработки.
//
// Адрес бэка для dev можно переопределить переменной окружения VITE_DEV_API_TARGET.
const API_TARGET = process.env.VITE_DEV_API_TARGET || 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['powerfully-nationwide-leopard.cloudpub.ru'],
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/media': {
        target: API_TARGET,
        changeOrigin: true,
      },
      // Django admin и статика админки (на случай разработки).
      '/django-admin': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
})
