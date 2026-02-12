import React from 'react'
import Navbar from './WorkerNavbar'
import BillingTable from './BillingTable'

function Reports() {
  return (
    <div>
       {/* <Navbar/> */}
       <BillingTable showMoreButton={false}/>
    </div>
  )
}

export default Reports
