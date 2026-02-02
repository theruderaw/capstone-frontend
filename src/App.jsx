import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import Reports from './components/Reports'
import SubmitReport from './components/SubmitReport'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  return (
    <BrowserRouter>
      {/* Show navbar only if logged in */}
      {isLoggedIn && <Navbar />}

      <Routes>
        {/* Login always accessible */}
        <Route path="/" element={<Landing />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <SubmitReport />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect unknown routes to login */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
