import React from 'react'
import { useNavigate } from 'react-router-dom'
import switchImg from "../assets/switch.jpg"

function WorkerNavbar() {
  const navigate = useNavigate()

  return (
    <div className="navbar">
      <ul className="nav-list">
        <li><button onClick={() => navigate('/workerdashboard')}>Home</button></li>
        <li><button onClick={() => navigate(`/reports/${localStorage.user_id}`)}>Month Report</button></li>
        <li><button onClick={() => navigate('/submit')}>Submit a report</button></li>

        <li className="logout">
          <button
            className="icon-btn"
            onClick={() => {
              localStorage.removeItem('isLoggedIn')
              localStorage.removeItem('user_id')
              localStorage.removeItem('project_id')
              navigate('/')
            }}
            aria-label="Logout"
          >
            <img src= {switchImg} alt="Logout" width={18} height={18} />
          </button>
        </li>
      </ul>
    </div>
  )
}

export default WorkerNavbar
