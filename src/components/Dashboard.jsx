import React from 'react'
import Navbar from './Navbar';
import CardData from './CardData';

function Dashboard() {
  // const response = await fetch('http://localhost:8000/finances_me/?user_id')
  return (
    <div>
        {localStorage.isLoggedIn && <Navbar/>}
        <CardData imageUrl = {null}/>
    </div>
  )
}

export default Dashboard;