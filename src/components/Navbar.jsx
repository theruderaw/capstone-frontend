import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {
  const navigate = useNavigate()

  return (
    <div className="navbar">
      <ul className="nav-list">
        <li><button onClick={() => navigate('/dashboard')}>Home</button></li>
        <li><button onClick={() => navigate('/reports')}>Month Report</button></li>
        <li><button onClick={() => navigate('/submit')}>Submit a report</button></li>

        <li className="logout">
          <button
            className="icon-btn"
            onClick={() => {
              localStorage.removeItem('isLoggedIn')
              navigate('/')
            }}
            aria-label="Logout"
          >
            <img src="../assets/switch.jpg" alt="Logout" width={18} height={18} />
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
