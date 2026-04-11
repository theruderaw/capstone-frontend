import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import ResolveForm from "./ResolveForm";

function CheckTicket({endpointURL}) {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // initially show 5
  const [showForm,setShowForm] = useState(false)
  const [report,setReport] = useState(null)
  const handleClick = async (reportId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/report/report/?report_id=${reportId}&user_id=${user.user_id}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Report data:", data.data[0]);
      setReport(data.data[0])
      setShowForm(true)
      // You can do something with data here, like updating state
    } catch (err) {
      console.error("Failed to fetch report:", err);
    }
  };

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchReports = async () => {
      try {
        const res = await fetch(
          `${endpointURL}${user.user_id}`,
          { headers: { accept: "application/json" } }
        );
        const data = await res.json();
        if (res.ok) setReports(data.data);
        console.log(reports)
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };

    fetchReports();
  }, [user?.user_id]);

  const handleShowMore = () => {
    console.log(report)
    setVisibleCount(visibleCount==5?reports.length:5); // show all
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
  <h4 className="text-xl font-semibold mb-4">Reports</h4>

  {/* table wrapper */}
  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-3">ID</th>
          <th className="p-3">Name</th>
          <th className="p-3">Reason</th>
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

            <td className="p-3">
              <button
                onClick={() => handleClick(report.id)}
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

  {/* show more / less */}
  <div className="flex justify-center mt-4">
    <button
      onClick={handleShowMore}
      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
    >
      {visibleCount === 5 ? "Show More" : "Show Less"}
    </button>
  </div>

  {/* modal/form */}
  {showForm && (
    <ResolveForm
      report={report}
      show={showForm}
      onClose={() => setShowForm(false)}
    />
  )}
</div>
  );
}

export default CheckTicket;