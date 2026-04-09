import React from 'react'

function SupervisorDropdown() {
  const handleChange = () => {}

  return (
    <select
      name="status_id"
      onChange={handleChange}
      className="form-control"
    >
      <option>Hello</option>
      <option>World</option>
    </select>
  )
}

export default SupervisorDropdown