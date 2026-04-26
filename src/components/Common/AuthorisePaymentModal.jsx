import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";

function AuthorisePaymentTable({ userId }) {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchFinances = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/finances/?user_id=${userId}&validated=true&pending=true&order=true`
        );

        if (!res.ok) throw new Error("Failed to fetch finances");

        const data = await res.json();
        setFinances(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinances();
  }, [userId]);

  const handleAction = async (paymentId, action) => {
    if (!user?.user_id) return;

    try {
      const res = await fetch(`/finances/${paymentId}/${action}`,
        {
          method: action === "authorize" ? "PATCH" : "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: user.user_id }),
        }
      );

      if (!res.ok) throw new Error(`${action} failed`);

      setFinances((prev) =>
        prev.filter((f) => String(f.id) !== String(paymentId))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-full w-full">
      {/* Loading / Error */}
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* TABLE */}
      <div className="overflow-auto max-h-[90vh] border border-gray-200 rounded-lg">
        {!loading && finances.length === 0 ? (
          <p className="p-4 text-gray-500">No pending finances.</p>
        ) : (
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Work Date</th>
                <th className="p-2">Name</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Approve</th>
                <th className="p-2">Reject</th>
              </tr>
            </thead>

            <tbody>
              {finances.map((f) => (
                <tr key={f.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{f.id}</td>
                  <td className="p-2">
                    {new Date(f.work_date).toLocaleString()}
                  </td>
                  <td className="p-2">{f.name}</td>
                  <td className="p-2">{f.amount}</td>

                  <td className="p-2">
                    <button
                      onClick={() => handleAction(f.id, "authorize")}
                      className="w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600"
                    >
                      ✓
                    </button>
                  </td>

                  <td className="p-2">
                    <button
                      onClick={() => handleAction(f.id, "reject")}
                      className="w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AuthorisePaymentTable;