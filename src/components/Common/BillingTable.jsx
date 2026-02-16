import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BillingTable({ dashboard, userId, self }) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:8000/finances/${userId}?dashboard=${dashboard}`
      );
      const result = await res.json();

      if (result.status === "OK") {
        setRows(result.data);
      }
    };

    fetchData();
  }, [userId, dashboard]);

  const handleNavigate = () => {
    if (!self) navigate("/finances/self");
    else navigate(`/summary/${userId}`);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <h4 className="mb-3">Income Breakdown</h4>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Hours Worked</th>
                  <th>Penalties</th>
                  <th>Total Earned (₹)</th>
                  <th>Total Penalty (₹)</th>
                  <th>Net Income (₹)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => {
                  const totalEarned = item.base_wage * item.hours_worked;
                  const totalPenalty = item.penalty_per_unit * item.penalties_observed;
                  const netIncome = totalEarned - totalPenalty;

                  return (
                    <tr key={item.id}>
                      <td>{new Date(item.work_date).toLocaleDateString()}</td>
                      <td>{item.hours_worked}</td>
                      <td>{item.penalties_observed}</td>
                      <td className="text-success">{totalEarned.toFixed(2)}</td>
                      <td className="text-danger">- {totalPenalty.toFixed(2)}</td>
                      <td className="fw-bold text-success">{netIncome.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>

              {dashboard && rows.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan="6" className="text-center">
                      <button
                        className="btn btn-dark w-100"
                        onClick={handleNavigate}
                      >
                        View Full Finance History →
                      </button>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingTable;