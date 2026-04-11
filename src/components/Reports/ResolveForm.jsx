import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import Toast from "../Common/Toast";

function ResolveForm({ report, show, onClose }) {
  const { user } = useAuth();
  const [remarks, setRemarks] = useState(report?.remarks || "");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!report || !show) return null;

  const handleSubmit = async () => {
    if (!remarks) {
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      const resDate = new Date().toISOString().split("T")[0];

      const response = await fetch(
        `http://localhost:8000/report/${report.id}/resolve`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supervisor_id: user.user_id,
            res_date: resDate,
            remarks,
          }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      await response.json();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to resolve report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* MODAL */}
        <div className="relative w-[92%] max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
          
          {/* HEADER */}
          <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-3">
            <h5 className="text-lg font-semibold">
              Report #{report.id}
            </h5>

            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-xl"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-3 text-sm">
            <p><span className="font-semibold">Worker:</span> {report.worker_name}</p>
            <p><span className="font-semibold">Supervisor:</span> {report.supervisor_name}</p>
            <p><span className="font-semibold">Date:</span> {report.report_date}</p>
            <p><span className="font-semibold">Reason:</span> {report.reason}</p>
            <p><span className="font-semibold">Content:</span> {report.report_content}</p>

            {/* Remarks */}
            <div className="pt-2">
              <label className="block font-semibold mb-1">
                Remarks:
              </label>

              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={!!report.remarks}
                placeholder={report.remarks ? "" : "Enter remarks..."}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 px-5 py-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Close
            </button>

            {!report.remarks && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOAST (unchanged, assuming it's already styled) */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        title="Warning"
        message="Remarks cannot be empty!"
      />
    </>
  );
}

export default ResolveForm;