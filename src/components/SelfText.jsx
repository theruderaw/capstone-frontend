import React, { useEffect, useState } from "react";

function SelfText({ user_id }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user_id == null) return;

    const fetchUserBasic = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/info/${user_id}`,
          { headers: { Accept: "application/json" } }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        setUser(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserBasic();
  }, [user_id]);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>; // 👈 THIS PREVENTS CRASH

  return (
    <div>
      <h3>{user.name}</h3>
      <h3>DOB: {new Date(user.dob).toLocaleDateString()}</h3>
      <h3>Status: {user.status_name}</h3>
      <h3>Aadhar No: {user.aadhar_no}</h3>
    </div>
  );
}

export default SelfText;
