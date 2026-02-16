import React from 'react'
import { useAuth } from '../../AuthContext'
import SelfText from './SelfText'
import CardData from './CardData'

function Dashboard({userId = null,self=false}) {
  const {user} = useAuth()
  const user_id = userId || user?.user_id
  return (
    <div>
        <SelfText userId = {user_id} profile={Boolean(userId)}/>
        <CardData userId = {user_id} self={true}/>
    </div>
  )
}

export default Dashboard
