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
    <div className="fixed top-4 right-4 z-[9999]">

      <div className="min-w-[300px] max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-semibold text-gray-800">
            {title}
          </span>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 text-gray-700">
          {message}
        </div>

      </div>

    </div>
  )
}

export default Toast