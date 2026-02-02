import React, { useState, useEffect } from "react";

function BillingTable({ user_id }) {
  const [finances, setFinances] = useState([]);   // ✅ array
  const [error, setError] = useState(null);       // ✅ defined

  useEffect(() => {
    if (user_id == null) return;

    const fetchFinances = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/finances/me?user_id=${user_id}`,
          { headers: { Accept: "application/json" } }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        setFinances(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFinances();
  }, [user_id]);

  if (error) return <p>Error: {error}</p>;
  if (!finances.length) return <p>No records found</p>;

  return (
    <table className="work-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Hours</th>
          <th>Penalties</th>
        </tr>
      </thead>
      <tbody>
        {finances.map(row => (
          <tr key={row.id}>
            <td>{new Date(row.work_date).toLocaleDateString()}</td>
            <td>{row.hours_worked}</td>
            <td>{row.penalties_observed}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BillingTable;
