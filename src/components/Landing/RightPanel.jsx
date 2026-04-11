import React from 'react'
import Login from '../Auth/Login'

function RightPanel() {
  return (
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 bg-white">
      
      <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
        Welcome back, User
      </h3>

      <div className="w-full max-w-md">
        <Login />
      </div>

    </div>
  )
}

export default RightPanel