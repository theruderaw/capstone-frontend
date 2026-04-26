import React from "react";

function ToggleOnSite({ disabled, userId, isOnSite }) {



  const handleClick = async () => {
    if (disabled) return;

    const newState = !isOnSite;
    const endpoint = newState ? "/onsite" : "/offsite";

    try {
      const res = await fetch(`/info${endpoint}?user_id=${userId}`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) throw new Error("Req failed");
      // UI updates automatically via WebSocket response
    } catch (err) {
      console.error("Failed to toggle onsite:", err);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex items-center w-14 h-7 rounded-full transition-colors duration-300
        ${isOnSite ? "bg-gray-900" : "bg-yellow-400"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* knob */}
      <div
        className={`absolute top-0.5 left-0.5 h-6 w-6 bg-white rounded-full shadow-md
          flex items-center justify-center text-sm
          transform transition-transform duration-300
          ${isOnSite ? "translate-x-6.75" : "translate-x-0.25"}
        `}
      >
        {/* icon INSIDE knob */}
        {isOnSite ? "🚧" : "🏢"}
      </div>
    </div>
  );
}

export default ToggleOnSite;