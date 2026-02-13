import React from 'react'
import Navbar from './WorkerNavbar';
import CardData from './CardData';
import ToggleButton from './ToggleButton';

function WorkerDashboard({fromsupervisor,workerId}) {
  // const response = await fetch('http://localhost:8000/finances_me/?user_id')
  return (
    <div>
        {/* <Navbar/> */}
        <CardData imageUrl = {null} user_id={workerId}/>
        <ToggleButton initial={false} userId={workerId} disabled={fromsupervisor}/>
    </div>
  )
}

export default WorkerDashboard;