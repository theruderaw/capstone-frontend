import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProjectDetail({workerID,active}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${workerID}`)
  }

  return (
    <div>
      <button onClick={handleClick} disabled={active}>
        +
      </button>
    </div>
  )
}

export default ProjectDetail
