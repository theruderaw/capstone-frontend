import React, { useEffect } from 'react'
import LeftPanel from './LeftPanel.jsx'
import RightPanel from './RightPanel.jsx'

function Landing({ setIsLoggedIn }) {
  useEffect(() => {
    localStorage.setItem('isLoggedIn', 'false')
    setIsLoggedIn(false)
  }, [setIsLoggedIn])

  return (
    <div className='container'>
      <LeftPanel />
      <RightPanel setIsLoggedIn={setIsLoggedIn}/>
    </div>
  )
}

export default Landing
