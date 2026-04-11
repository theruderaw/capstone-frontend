import React from 'react'
import workerImage from '../../assets/image.png'

function LeftPanel() {
  return (
<div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 md:px-16 bg-gray-100">      
      {/* Text Section */}
      <div className="max-w-xl text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
          Safety and Health Monitoring Helmet for Industrial Workers
        </h1>
      </div>

      {/* Image Section */}
      <div className="mt-6 md:mt-0">
        <img
          src={workerImage}
          alt="Worker Helmet"
          className="w-72 md:w-96 object-contain"
        />
      </div>

    </div>
  )
}

export default LeftPanel