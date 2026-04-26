import React from "react";

function ReportTable({ reports, visibleCount, onExpand, onShowMore }) {
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.slice(0, visibleCount).map((report) => (
              <tr
                key={report.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{report.id}</td>
                <td className="p-3">{report.name}</td>
                <td className="p-3">{report.reason || "-"}</td>
                <td className="p-3">{report.report_date}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${report.remarks ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {report.remarks ? "Resolved" : "Pending"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onExpand(report.id)}
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

      <div className="flex justify-center mt-4">
        <button
          onClick={onShowMore}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
        >
          {visibleCount === 5 ? "Show More" : "Show Less"}
        </button>
      </div>
    </>
  );
}

export default ReportTable;