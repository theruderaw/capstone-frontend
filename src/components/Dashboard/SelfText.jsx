import React, { useEffect, useState } from 'react'
import { useAuth } from '../../AuthContext'
import workerImg from '../../assets/workerimg.png'
import ToggleStatus from '../Common/ToggleStatus'
import ToggleOnSite from '../Common/ToggleOnSite'

function SelfText({ userId, profile, workingStatus, onsiteStatus }) {
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchUserInfo = async () => {
      try {
        setLoading(true)
        // Using relative path to trigger Vite proxy
        const response = await fetch(`/info/user?user_id=${userId}`,
          { headers: { accept: "application/json" } }
        )

        if (!response.ok) throw new Error("Failed to fetch user info")
        const data = await response.json()
        setUserInfo(data.data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [userId])

  // 🧠 STATES
  if (!userId) return <div className="p-6 text-gray-500">No user logged in</div>

  if (loading) {
    return (
      <div className="p-6 animate-pulse text-gray-500">
        Loading profile...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
        ⚠️ {error}
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-2">
      
      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 border-b pb-2 gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Profile Overview
            </h2>
            <p className="text-gray-500 text-xs">
              Personal and operational details
            </p>
          </div>

          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            {userInfo.role}
          </span>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
          
          {/* LEFT: IMAGE + TOGGLES */}
          <div className="flex flex-col md:flex-row items-center gap-2 justify-center">
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {['Worker', 'Supervisor'].includes(userInfo.role) && (
                <ToggleStatus disabled={profile} userId={userId} isOn={workingStatus} />
              )}

              {['Supervisor', 'Manager'].includes(userInfo.role) && (
                <ToggleOnSite disabled={profile} userId={userId} isOnSite={onsiteStatus} />
              )}
            </div>
            <div className="flex-shrink-0">
              <img
                src={workerImg}
                alt="Worker"
                className="w-[110px] h-[140px] object-cover rounded-xl shadow-md"
              />
            </div>
          </div>

          {/* RIGHT: INFO */}
          <div className="space-y-2">
            <InfoRow label="Name" value={userInfo.name} />
            <InfoRow label="Date of Birth" value={userInfo.dob} />
            <InfoRow label="Aadhar No." value={userInfo.aadhar_no} />
            <InfoRow label="Role" value={userInfo.role} />

          </div>
        </div>
      </div>
    </div>
  )
}

// 🔹 Reusable Row Component
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg">
    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </span>
    <span className="text-xs font-semibold text-gray-800">
      {value}
    </span>
  </div>
)

export default SelfText