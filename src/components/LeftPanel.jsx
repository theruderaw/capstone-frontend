import React from 'react'
import workersLanding from '../assets/workers-landing-page.png';

function LeftPanel() {
  return (
    <div className='left'>
      <div className='landing-text'>Safety and Health Monitoring Helmet for Industrial Workers</div>
      <img src={workersLanding} alt="Workers Landing Page" className='image'/>
    </div>
  )
}

export default LeftPanel
