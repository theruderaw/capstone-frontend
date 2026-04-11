import React, { useEffect, useState } from 'react'
import { useAuth } from '../../AuthContext'
import workerImg from '../../assets/workerimg.png'
import ToggleStatus from '../Common/ToggleStatus'
import ToggleOnSite from '../Common/ToggleOnSite'

function SelfText({userId,profile}) {
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/info/user?user_id=${userId}`,
          { headers: { accept: "application/json" } }
        )

        if (!response.ok) throw new Error("Failed to fetch user info")
        const data = await response.json()
        console.log(data.role)
        setUserInfo(data.data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      }
    }

    fetchUserInfo()
  }, [userId])

  if (!userId) return <div>No user logged in</div>
  if (error) return <div style={{ color: "red" }}>{error}</div>
  if (!userInfo) return <div>Loading...</div>

  return (
 <div className="mt-4 flex">
<div className="mt-4 flex w-full gap-4 items-center">
  
  {/* LEFT: Toggles (min width) */}
  <div className="flex flex-col items-center gap-2 flex-shrink-0">
    {["Worker", "Supervisor"].includes(userInfo.role) && (
      <ToggleStatus disabled={profile} userId={userId} />
    )}

    {["Supervisor", "Manager"].includes(userInfo.role) && (
      <ToggleOnSite disabled={profile} userId={userId} />
    )}
  </div>

  {/* MIDDLE: Image (min width) */}
  <div className="flex justify-center flex-shrink-0">
    <img
      src={workerImg}
      alt="Worker"
      className="w-[150px] h-[200px] object-cover rounded-lg"
    />
  </div>

  {/* RIGHT: Table (takes remaining space) */}
  <div className="flex-1 min-w-0 ">
    <table className="w-full border border-black rounded-lg border-separate overflow-hidden bg-gray-100">
      <tbody>
        <tr className="border-b border-gray-300">
          <td className="bg-gray-200 p-3 font-medium">Name</td>
          <td className="bg-white p-3">{userInfo.name}</td>
        </tr>

        <tr className="border-b border-gray-300">
          <td className="bg-gray-200 p-3 font-medium">Date of Birth</td>
          <td className="bg-white p-3">{userInfo.dob}</td>
        </tr>

        <tr className="border-b border-gray-300">
          <td className="bg-gray-200 p-3 font-medium">Role</td>
          <td className="bg-white p-3">{userInfo.role}</td>
        </tr>

        <tr>
          <td className="bg-gray-200 p-3 font-medium">Aadhar No.</td>
          <td className="bg-white p-3">{userInfo.aadhar_no}</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>
    </div>
  )
}

export default SelfText