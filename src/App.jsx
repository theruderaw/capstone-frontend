import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Landing from './components/Landing'
import WorkerDashboard from './components/WorkerDashboard'
import Reports from './components/Reports'
import SubmitReport from './components/SubmitReport'
import ProtectedRoute from './components/ProtectedRoute'
import WorkerNavbar from './components/WorkerNavbar'
import SupervisorDashboard from './components/SupervisorDashboard'
import SupervisorNavbar from './components/SupervisorNavbar'
import CheckTicket from './components/CheckTicket'
import ProjectSupervisor from './components/ProjectSupervisor'
import Profile from './components/Profile'

function App() {
  // React state is the source of truth
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  )

  return (
    <BrowserRouter>
      {/* Global UI lives here, once */}
      {isLoggedIn && (localStorage.status_id == 1) && <WorkerNavbar/>}
      {isLoggedIn && (localStorage.status_id == 2) && <SupervisorNavbar/>}

      <Routes>
        {/* Login / Landing */}
        <Route
          path="/"
          element={<Landing setIsLoggedIn={setIsLoggedIn}/>}
        />

        {/* Protected routes */}
        <Route
          path="/workerdashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <WorkerDashboard fromsupervisor = {false} workerId={localStorage.user_id}/>
            </ProtectedRoute>
          }
        />
        <Route
          path = "/supervisordashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SupervisorDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:userId"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path='/checkticket'
          element = {
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CheckTicket/>
            </ProtectedRoute>
          }
        />
        <Route
          path='/project'
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProjectSupervisor/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SubmitReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:workerID"
          element={
            <Profile/>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Landing setIsLoggedIn={setIsLoggedIn}/>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
