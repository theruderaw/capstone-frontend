import React from 'react'
import CardData from './CardData'
import ToggleButton from './ToggleButton'

function SupervisorDashboard() {
  return (
    <div>
      <CardData imageUrl={null} user_id={localStorage.user_id}/>
      <ToggleButton userId = {localStorage.user_id} disabled={false}/>
    </div>
  )
}

export default SupervisorDashboard
