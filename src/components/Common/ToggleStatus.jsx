import React from "react";

function ToggleStatus({ disabled, userId, isOn }) {



  const handleClick = async () => {
    if (disabled) return;

    // Determine what we WANT to change it to
    const newState = !isOn;
    const endpoint = newState ? "/working" : "/break";

    try {
      // Using relative path for the Vite proxy
      const res = await fetch(`/info${endpoint}?user_id=${userId}`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) throw new Error("Req failed");
      // We don't update state here; we wait for the WebSocket broadcast!
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex items-center w-14 h-7 rounded-full transition-colors duration-300
        ${isOn ? "bg-green-500" : "bg-red-500"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* knob */}
      <div
        className={`absolute top-0.5 left-0.5 h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${isOn ? "translate-x-6.75" : "translate-x-0.25"}
        `}
      />
    </div>
  );
}

export default ToggleStatus;