import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage'
import SupportPage from './pages/SupportPage'
import AdminPage from './pages/AdminPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/admin"   element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
