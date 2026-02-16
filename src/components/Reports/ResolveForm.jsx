import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import Toast from "../Common/Toast";

function ResolveForm({ report, show, onClose }) {
  const { user } = useAuth();
  const [remarks, setRemarks] = useState(report.remarks || "");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!report || !show) return null;

  const handleSubmit = async () => {
    if (!remarks) {
      // Show toast instead of alert
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const resDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const response = await fetch(
        `http://localhost:8000/report/${report.id}/resolve`,
        {
          method: "PUT",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supervisor_id: user.user_id,
            res_date: resDate,
            remarks: remarks,
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Report resolved:", data);
      onClose(); // close the modal
    } catch (err) {
      console.error("Failed to resolve report:", err);
      alert("Failed to resolve report. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal */}
      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "transparent" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">Report #{report.id}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-2"><strong>Worker:</strong> {report.worker_name}</div>
              <div className="mb-2"><strong>Supervisor:</strong> {report.supervisor_name}</div>
              <div className="mb-2"><strong>Date:</strong> {report.report_date}</div>
              <div className="mb-2"><strong>Reason:</strong> {report.reason}</div>
              <div className="mb-2"><strong>Report Content:</strong> {report.report_content}</div>

              {/* Remarks input */}
              <div className="mb-3">
                <label htmlFor="remarks" className="form-label"><strong>Remarks:</strong></label>
                <input
                  type="text"
                  id="remarks"
                  className="form-control"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={!!report.remarks} // disabled if already resolved
                  placeholder={report.remarks ? "" : "Enter remarks..."}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
              {!report.remarks && (
                <button
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Toast notification */}
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