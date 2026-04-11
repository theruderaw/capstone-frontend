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
    <div className="mt-6 flex justify-center">
      <div className="w-[90vw] max-w-6xl bg-white shadow-lg rounded-xl p-6">

        {/* <h4 className="text-2xl font-semibold mb-4 text-gray-800">
          Income Breakdown
        </h4> */}

        <div className="overflow-x-auto">
          <table className="w-full border border-black rounded-lg border-separate overflow-hidden">

            {/* Header */}
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Hours Worked</th>
                <th className="p-3 text-left">Penalties</th>
                <th className="p-3 text-left">Total Earned (₹)</th>
                <th className="p-3 text-left">Total Penalty (₹)</th>
                <th className="p-3 text-left">Net Income (₹)</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="bg-white">
              {rows.map((item) => {
                const totalEarned = item.base_wage * item.hours_worked;
                const totalPenalty = item.penalty_per_unit * item.penalties_observed;
                const netIncome = totalEarned - totalPenalty;

                return (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{new Date(item.work_date).toLocaleDateString()}</td>
                    <td className="p-3">{item.hours_worked}</td>
                    <td className="p-3">{item.penalties_observed}</td>
                    <td className="p-3 text-green-600">{totalEarned.toFixed(2)}</td>
                    <td className="p-3 text-red-500">- {totalPenalty.toFixed(2)}</td>
                    <td className="p-3 font-semibold text-green-700">{netIncome.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>

            {/* Footer Button */}
            {dashboard && rows.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="6" className="p-3">
                    <button
                      onClick={handleNavigate}
                      className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
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
  );
}

export default BillingTable;