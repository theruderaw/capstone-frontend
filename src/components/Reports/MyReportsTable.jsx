import React from "react";
import ReportDetailsModal from "./ReportDetailsModal";

function MyReportsTable({ reports, onExpand, expandedReport, onCloseExpanded }) {
  return (
    <>
      <div className="h-full overflow-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 sticky top-0">
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Reason</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{report.id}</td>
                <td className="px-4 py-2">{report.reason}</td>
                <td className="px-4 py-2">{report.report_date || report.submission_date}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${report.remarks ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {report.remarks ? "Resolved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onExpand(report)}
                    className="px-3 py-1 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition"
                  >
                    Expand
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReportDetailsModal
        report={expandedReport}
        username=""
        supervisor=""
        onClose={onCloseExpanded}
      />
    </>
  );
}

export default MyReportsTable;