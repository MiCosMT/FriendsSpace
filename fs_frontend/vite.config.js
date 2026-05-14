import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Configuración principal de Vite, define plugins de React, alias de rutas y qué variables de entorno exponer
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'API_'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
