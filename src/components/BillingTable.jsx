import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BillingTable({ user_id , showMoreButton, onMoreClick}) {
  const [finances, setFinances] = useState([]);   // ✅ array
  const [error, setError] = useState(null);       // ✅ defined

  // Wage calculation interim = row.hours_worked*row.base_wage - row.penalties_observed*row.penalty_per_unit


  
  useEffect(() => {
    const URL = `http://localhost:8000/finances/${user_id}`
    const fetchFinances = async () => {
      try {
        const response = await fetch(
          URL,
          {
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        setFinances(showMoreButton?result.data.slice(0,5):result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (user_id) {
      fetchFinances();
    }
  }, [user_id,showMoreButton]);

  if (error) return <p>Error: {error}</p>;
  if (!finances.length) return <p>No records found</p>;

  return (
    <table className="work-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Hours</th>
          <th>Penalties</th>
          <th>Total Earning</th>
          <th>Total Penalty</th>
          <th>Net Income</th>
        </tr>
      </thead>
      <tbody>
        {finances.map(row => (
          <tr key={row.user_financeid}>
            <td>{row.work_date.slice(0,10)}</td>
            <td>{row.hours_worked}</td>
            <td>{row.penalties_observed}</td>
            <td>{row.hours_worked*row.base_wage}</td>
            <td>{row.penalties_observed*row.penalty_per_unit}</td>
            <td>{row.hours_worked*row.base_wage - row.penalties_observed*row.penalty_per_unit}</td>
          </tr>
        ))}
        {showMoreButton && (
        <tr className="extendbutton" key="extend-row">
          <td colSpan={6}>
            <button
              className="route-button"
              onClick={onMoreClick ?? (() => {})}
            >
              Check other information
            </button>
          </td>
        </tr>
      )}
      </tbody>
    </table>
  );
}

export default BillingTable;
