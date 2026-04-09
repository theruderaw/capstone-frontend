import React from 'react'
import { useAuth } from '../../AuthContext'
import SelfText from './SelfText'
import CardData from './CardData'
import ProjectData from '../Project/ProjectData'
import CheckTicket from '../Reports/CheckTicket'

function Dashboard({userId = null,self=false,statuscheck=false}) {
  const {user} = useAuth()
  const user_id = userId || user?.user_id
  if(statuscheck){
    return (
      <div>
        <SelfText userId={user_id} profile={!self}/>
        <CardData userId={user_id} self={self} statuscheck={false}/>
      </div>
    )
  }
  return (
    <div>
        <SelfText userId = {user_id} profile={Boolean(userId)}/>
        {(user.status_id == 2 || user.status_id == 1) && <CardData userId = {user_id} self={true}/>}
        {(user.status_id == 3) && <ProjectData userId = {user_id} self={true}/>}
        {(user.status_id == 5) && <CheckTicket endpointURL = {"http://localhost:8000/report/all?user_id="}/>}
    </div>
  )
}

export default Dashboard
