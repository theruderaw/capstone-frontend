import React from 'react'
import { useNavigate } from 'react-router-dom'
import switchImg from "../assets/switch.jpg"

function SupervisorNavbar() {
  const navigate = useNavigate()

  return (
    <div className="navbar">
      <ul className="nav-list">
        <li><button onClick={() => navigate('/supervisordashboard')}>Home</button></li>
        <li><button onClick={() => navigate(`/reports/${localStorage.user_id}`)}>Month Report</button></li>
        <li><button onClick={() => navigate('/checkticket')}>Check Ticket</button></li>
        <li><button onClick={() => navigate('/project')}>Project</button></li>

        <li className="logout">
          <button
            className="icon-btn"
            onClick={() => {
              localStorage.removeItem('isLoggedIn')
              localStorage.removeItem('project_id')
              localStorage.removeItem('user_id')
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

export default SupervisorNavbar
