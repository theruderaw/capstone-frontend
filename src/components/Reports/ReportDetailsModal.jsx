import React from "react";

function ReportDetailsModal({ report, username, supervisor, onClose }) {
  if (!report) return null;

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
          <div className="flex items-center justify-between bg-gray-900 text-white px-6 py-4">
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
          <div className="p-5 space-y-3 text-sm max-h-[70vh] overflow-y-auto">
            <p><span className="font-semibold">Worker:</span> {report.name || username}</p>
            <p><span className="font-semibold">Supervisor:</span> {report.supervisor_name || supervisor}</p>
            <p><span className="font-semibold">Date:</span> {report.report_date || report.submission_date}</p>
            <p><span className="font-semibold">Reason:</span> {report.reason}</p>
            <p><span className="font-semibold">Content:</span> {report.description || report.report_content}</p>
            {report.remarks && (
              <p><span className="font-semibold">Remarks:</span> {report.remarks}</p>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportDetailsModal;
