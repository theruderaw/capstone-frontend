import React from 'react'
import Login from './Login'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import '../styles/Landing.css'

function Landing() {
  return (
    <div className='container'>
        <LeftPanel/>
        <RightPanel/>
    </div>
  )
}

export default Landing
