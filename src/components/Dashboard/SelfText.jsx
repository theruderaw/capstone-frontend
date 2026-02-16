import React, { useEffect, useState } from 'react'
import { useAuth } from '../../AuthContext'
import workerImg from '../../assets/workerimg.png'
import ToggleButton from '../Common/ToggleButton'

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
    <div className="container mt-4 d-flex justify-content-center">
      <ToggleButton disabled = {profile} userId={userId}/>
      <div className="row align-items-center" style={{ width: "80vw" }}>
        {/* Left column: image */}
        <div
          className="col-md-4 d-flex align-items-center justify-content-center"
          style={{ height: "200px" }}
        >
          <img
            src={workerImg}
            alt="Worker"
            style={{ width: "150px", height: "200px", objectFit: "cover" }}
          />
        </div>

        {/* Right column: table */}
        <div className="col-md-8">
          <table className="table table-striped mb-0">
            <tbody>
              <tr>
                <td className="table-active">Name</td>
                <td>{userInfo.name}</td>
              </tr>
              <tr>
                <td className="table-active">Date of Birth</td>
                <td>{userInfo.dob}</td>
              </tr>
              <tr>
                <td className="table-active">Role</td>
                <td>{userInfo.role}</td>
              </tr>
              <tr>
                <td className="table-active">Aadhar No.</td>
                <td>{userInfo.aadhar_no}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SelfText