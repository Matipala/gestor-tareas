import React from 'react'
import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from './context/AuthContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
)
