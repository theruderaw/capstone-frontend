import React, { useState, useEffect } from "react";

const ToggleButton = ({ userId, disabled}) => {
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(true); // true while fetching initial state

  // Fetch current working/break state from server
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/info?user_id=${userId}`
        );
        if (!response.ok) {
          console.error("Failed to fetch initial state");
          return;
        }

        const data = await response.json();
        // data.data.working is true/false
        if (data && data.data) {
          console.log("Here")
          setIsOn(data.data);
        }
      } catch (err) {
        console.error("Error fetching initial state:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialState();
  }, [userId]);

  // Handle toggle click
  const handleClick = async () => {
    const newState = !isOn;
    setLoading(true); // prevent multiple clicks

    const endpoint = newState
      ? `http://localhost:8000/info/working?user_id=${userId}`
      : `http://localhost:8000/info/break?user_id=${userId}`;

    try {
      const response = await fetch(endpoint, { method: "POST" });
      if (!response.ok) {
        console.error("Failed to update state:", response.statusText);
        alert("Failed to update state on server");
        return;
      }

      // Optionally, verify server returned the expected new state
      const resData = await response.json();
      if (resData && resData.data && typeof resData.data.working === "boolean") {
        setIsOn(resData.data.working);
      } else {
        // fallback if server doesn't return data
        setIsOn(newState);
      }
    } catch (err) {
      console.error("Error hitting endpoint:", err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={disabled}>
      {isOn ? "✅ ON" : "❌ OFF"}
    </button>
  );
};

export default ToggleButton;