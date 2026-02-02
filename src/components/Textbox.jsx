import React from 'react'

function Textbox({ text, setText, type = 'text', placeholder = '', className = '' }) {
  return (
    <input
      type={type}
      value={text}
      placeholder={placeholder}
      onChange={(e) => setText(e.target.value)}
      className={`textbox ${className}`}
    />
  )
}

export default Textbox
