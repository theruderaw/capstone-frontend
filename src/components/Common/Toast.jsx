import React, { useEffect } from "react"

function Toast({ show, onClose, message, title = "Notification", delay = 3000 }) {
  // Auto-hide after `delay` milliseconds
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => {
      onClose()
    }, delay)

    return () => clearTimeout(timer)
  }, [show, delay, onClose])

  if (!show) return null

  return (
    <div
      className="toast show position-fixed top-0 end-0 m-3 shadow"
      style={{ zIndex: 9999 }}
    >
      <div className="toast-header">
        <strong className="me-auto">{title}</strong>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  )
}

export default Toast