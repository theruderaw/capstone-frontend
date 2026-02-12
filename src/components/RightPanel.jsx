import React from 'react'
import Login from './Login'


function RightPanel({setIsLoggedIn}) {
  return (
    <div className='right'>
        <div className='landing-text-dark'>Welcome back, user</div>
        <Login setIsLoggedIn={setIsLoggedIn}/>
    </div>
  )
}

export default RightPanel
