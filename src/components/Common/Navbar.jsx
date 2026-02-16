import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { useAuth } from '../../AuthContext'

function Navbar() {
  const {user,setUser,logout} = useAuth();
  const navigate = useNavigate()
  if(!user?.user_id){
    return null
  }
  return (
    <div>
      <nav className= "navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className= "container-fluid">
            <a className= "navbar-brand" href="#">Dashboard</a>
            <button className= "navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className= "navbar-toggler-icon"></span>
            </button>
            <div className= "collapse navbar-collapse" id="navbarSupportedContent">
            <ul className= "navbar-nav me-auto mb-2 mb-lg-0">
                {(user.status_id == 1)?
                <>
                    <li className= "nav-item">
                    <Link className= "nav-link active" to="/dashboard">Home</Link>
                    </li>
                    <li className= "nav-item">
                    <Link className="nav-link active" to="/finances/self">Month Report</Link>
                    </li>
                    <li className= "nav-item">
                    <Link className= "nav-link active" to="/report/submit">Submit a Report</Link>
                    </li>
                </>:(user.status_id == 2)?
                <>
                    <li className='nav-item'>
                    <Link className='nav-link active' to="/dashboard">Home</Link>
                    </li>
                    <li className='nav-item'>
                    <Link className='nav-link active' to="/finances/self">Month Report</Link>
                    </li>
                    <li className='nav-item'>
                    <Link className='nav-link active' to="/report/resolve">Check Tickets</Link>
                    </li>
                    <li className='nav-item'>
                    <Link className='nav-link active' to="/project/self">Projects</Link>
                    </li>
                </>:<></>}
            </ul>
            <button className='btn btn-dark' onClick={() => {
                logout();
                navigate('/')
            }}>Logout</button>
            </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
