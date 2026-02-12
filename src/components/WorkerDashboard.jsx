import React from 'react'
import Navbar from './WorkerNavbar';
import CardData from './CardData';

function WorkerDashboard() {
  // const response = await fetch('http://localhost:8000/finances_me/?user_id')
  return (
    <div>
        {/* <Navbar/> */}
        <CardData imageUrl = {null} user_id={localStorage.user_id}/>
    </div>
  )
}

export default WorkerDashboard;