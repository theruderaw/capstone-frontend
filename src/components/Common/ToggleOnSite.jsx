import React, { useState, useEffect, useRef } from "react";

function ToggleOnSite({ disabled, userId }) {
  const [isOnSite, setisOnSite] = useState(false);
  const wsRef = useRef(null); // 🔥 persistent socket

  // 🔹 HTTP fetch ONLY if interactive
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

  // 🔹 WebSocket ONLY if disabled (read-only mode)
  useEffect(() => {
  if (!userId) return;

  const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
  wsRef.current = ws;

  ws.onopen = () => console.log("WS OPENED");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.user_id == userId && data.type == "onsite_update") {
      setisOnSite(data.onsite);
    }
    
    console.log(data.working,userId)
    // console.log(data)
  };

  return () => {
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.close();
    }
    wsRef.current = null;
  };
}, [disabled, userId]);

  // 🔹 Toggle (only works if NOT disabled)
  const handleClick = async () => {
    if (disabled) return;
    console.log("CLICK FIRED", { disabled, isOnSite });
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

      const data = await res.json();
      console.log(data.data);
    } catch (err) {
      console.error(err);
      setisOnSite(!newState); // revert
    }
  };

  return (
  <div
    className="form-check form-switch"
    style={{
      position: "relative",
      display: "inline-block"
    }}
  >
    <input
      className={`form-check-input ${isOnSite ? "bg-dark" : "bg-warning"}`}
      type="checkbox"
      role="switch"
      checked={isOnSite}
      disabled={disabled}
      onChange={handleClick}
      style={{
        width: "60px",
        height: "30px",
        position: "relative",
        zIndex: 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    />

    {/* 🔥 ADD THIS */}
    <span
      style={{
        position: "absolute",
        left: !isOnSite ? "6px" : "36px",
        top: "8px",
        fontSize: "14px",
        zIndex: 2,
        pointerEvents: "none",
        transition: "all 0.2s ease"
      }}
    >
      {isOnSite ? "🚧":"🏢"}
    </span>
  </div>
)
}

export default ToggleOnSite;