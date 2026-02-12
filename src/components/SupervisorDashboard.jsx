import React from 'react'
import CardData from './CardData'

function SupervisorDashboard() {
  return (
    <div>
      <CardData imageUrl={null} user_id={localStorage.user_id}/>
    </div>
  )
}

export default SupervisorDashboard
