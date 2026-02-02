import React from 'react'

function Button({ onClick, children, className = '', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      type='button'
    >
      {children}
    </button>
  )
}


export default Button
