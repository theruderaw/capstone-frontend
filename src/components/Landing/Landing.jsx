import React,{useEffect} from 'react'
import RightPanel from './RightPanel'
import LeftPanel from './LeftPanel'
import { useAuth } from '../../AuthContext'

function Landing() {
  const {logout} = useAuth()
  useEffect(() => {
    // logout immediately on landing page
    logout()
  }, [])
  return (
    <div>
        <LeftPanel/>
        <RightPanel/>
    </div>
  )
}

export default Landing
