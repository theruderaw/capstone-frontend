import React, { useState, useEffect, useRef } from "react";

function ToggleStatus({ disabled, userId }) {
  const [isOn, setIsOn] = useState(false);
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
        setIsOn(data.data.working);
      } catch (err) {
        alert(err);
      }
    };

    fetchData();
  }, [disabled, userId]);

  // 🔹 WebSocket ONLY if disabled (read-only mode)
  useEffect(() => {
  if (!disabled || !userId) return;

  const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
  wsRef.current = ws;

  ws.onopen = () => console.log("WS OPENED");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.user_id == userId && data.type == "working_update") {
      setIsOn(data.working);
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

    const newState = !isOn;
    setIsOn(newState);

    const endpoint = newState ? "/working" : "/break";
    console.log("status")
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
      setIsOn(!newState); // revert
    }
  };

  return (
    <div className="form-check form-switch">
      <input
        className={`form-check-input ${isOn ? "bg-success" : "bg-danger"}`}
        type="checkbox"
        role="switch"
        checked={isOn}
        disabled={disabled}
        onChange={handleClick}
        style={{
          width: "60px",
          height: "30px",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
    </div>
  );
}

export default ToggleStatus;