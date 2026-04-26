import React, { useState } from "react";
import { useAuth } from "../../AuthContext";

function ValidatePaymentsModal({ userId }) {
  const [showModal, setShowModal] = useState(false);
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/finances/?user_id=${userId}&validated=false&pending=true&order=true`
      );

      if (!res.ok) throw new Error("Failed to fetch finances");

      const data = await res.json();
      setFinances(data.data || []);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (paymentId, action) => {
    if (!user?.user_id) return;

    try {
      const res = await fetch(`/finances/${paymentId}/${action}`,
        {
          method: action === "validate" ? "PATCH" : "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: user.user_id }),
        }
      );

      if (!res.ok) throw new Error(`${action} failed`);

      // ✅ ensure correct type match
      setFinances((prev) =>
        prev.filter((f) => String(f.id) !== String(paymentId))
      );

    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Validate Payments
      </button>

      {/* Loading / Error outside modal */}
      {loading && <p className="mt-2 text-gray-600">Loading...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />

          {/* modal box */}
          <div className="relative bg-white w-[90%] max-w-5xl rounded-xl shadow-xl p-5">
            
            {/* header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Pending Finances</h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* body */}
            {finances.length === 0 ? (
              <p className="text-gray-500">No pending finances.</p>
            ) : (
              <div className="overflow-auto max-h-[70vh]">
                <table className="w-full text-sm text-center border border-gray-200">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2">ID</th>
                      <th className="p-2">Work Date</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Amount</th>
                      <th className="p-2">✓</th>
                      <th className="p-2">✕</th>
                    </tr>
                  </thead>

                  <tbody>
                    {finances.map((f) => (
                      <tr key={f.id} className="border-t">
                        <td className="p-2">{f.id}</td>
                        <td className="p-2">
                          {new Date(f.work_date).toLocaleString()}
                        </td>
                        <td className="p-2">{f.name}</td>
                        <td className="p-2">{f.amount}</td>

                        {/* approve */}
                        <td className="p-2">
                          <button
                            onClick={() => handleAction(f.id, "validate")}
                            className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition"
                          >
                            ✓
                          </button>
                        </td>

                        {/* reject */}
                        <td className="p-2">
                          <button
                            onClick={() => handleAction(f.id, "reject")}
                            className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* footer */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ValidatePaymentsModal;