import React, { useState, useEffect, useRef } from "react";

function ToggleOnSite({ disabled, userId }) {
  const [isOnSite, setisOnSite] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    if (disabled) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/info?user_id=${userId}`,
          { headers: { Accept: "application/json" } }
        );

        if (!res.ok) throw new Error("Failed to fetch info");

        const data = await res.json();
        setisOnSite(data.data.onsite);
      } catch (err) {
        alert(err);
      }
    };

    fetchData();
  }, [disabled, userId]);

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.user_id === userId && data.type === "onsite_update") {
        setisOnSite(data.onsite);
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [disabled, userId]);

  const handleClick = async () => {
    if (disabled) return;

    const newState = !isOnSite;
    setisOnSite(newState);

    const endpoint = newState ? "/onsite" : "/offsite";

    try {
      const res = await fetch(
        `http://localhost:8000/info${endpoint}?user_id=${userId}`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) throw new Error("Req failed");

      await res.json();
    } catch (err) {
      console.error(err);
      setisOnSite(!newState);
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