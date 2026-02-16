import React, { useState,useEffect } from "react";

function ToggleButton({disabled,userId}) {
  const [isOn, setIsOn] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/info?user_id=${userId}`, {
          headers: { 'Accept': 'application/json' }
        })

        if (!res.ok) throw new Error('Failed to fetch info')

        const data = await res.json()
        setIsOn(data.data) // set the button text as the fetched info
      } catch (err) {
        alert(err)
      }
    }

    fetchData()
  }, [])
  const handleClick = async () => {
    const newState = !isOn;
    setIsOn(newState)
    const endpoint = newState? `/working` : '/break'

    try{
      const res = await fetch(`http://localhost:8000/info${endpoint}?user_id=${userId}`,{
        method:'POST',
        headers: {"Accept":'application/json'}
      })
      if(!res.ok) throw new Error("Req failed")
      const data = await res.json();
      console.log(res.data)
    } catch(err){
      setError(err.message)
      console.error(err)
      // Optionally revert toggle on failure
      setIsOn(!newState)
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="form-check form-switch">
      <input
        className={`form-check-input ${isOn ? "bg-success" : "bg-danger"}`}
        type="checkbox"
        role="switch"
        checked={isOn}
        disabled={disabled}
        onChange={handleClick}
        style={{ width: "60px", height: "30px" ,cursor: "pointer"}}
      />
    </div>
  );
}

export default ToggleButton;