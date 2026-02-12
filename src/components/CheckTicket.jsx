import React, { useEffect, useState } from "react";
import ReportModal from "./ReportModal";

function CheckTicket() {
  const [summary, setSummary] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReportById = async (reportId) => {
    try {
        const res = await fetch(`http://localhost:8000/report/${reportId}?user_id=${localStorage.user_id}`);
        if (!res.ok) throw new Error("Failed to fetch report");

        const data = await res.json();
        return data; // assuming backend returns the report object
    } catch (error) {
        console.error("Error fetching report:", error);
        alert("Failed to load report");
        return null;
    }
  };
    const handleSubmit = async (remarks) => {
    try {
        if (!remarks.trim()) return;

        const supervisor_id = localStorage.getItem("user_id");
        const today = new Date();

        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
        const dd = String(today.getDate()).padStart(2, "0");

        const res_date = `${yyyy}-${mm}-${dd}`; // "2026-02-12"
        console.log(selectedReport)
        const res = await fetch(
        `http://localhost:8000/report/${selectedReport.id}/resolve`,
        {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            },
            body: JSON.stringify({
            supervisor_id,
            res_date,
            remarks: remarks.trim(),
            }),
        }
        );

        if (!res.ok) throw new Error("Failed to submit resolution");

        const data = await res.json();
        console.log("Report resolved:", data);

        setSelectedReport(null); // close modal
    } catch (error) {
        alert("Already Resolved.")
    }
    };
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const userId = localStorage.getItem("user_id");

        const res = await fetch(
          `http://localhost:8000/report/summary?user_id=${userId}`
        );

        const data = await res.json();
        setSummary(data.data || []);
        console.log(summary)
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, []);
  console.log(summary)
  summary.map((item) => {
    console.log(item)
  })
  return (
    <div className="container">
      <h2 className="title">Report Summary</h2>

      <div className="table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Worker</th>
            <th>Supervisor</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {summary.length > 0 ? (
            summary.map((item) => (
                
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.worker_name}</td>
                <td>{item.supervisor_name}</td>
                <td>{item.report_date}</td>
                <td>{item.reason}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={async () => {
                        const fullReport = await fetchReportById(item.id);
                        if (fullReport) setSelectedReport(fullReport.data[0]);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No reports found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {console.log("selected report",selectedReport)}
      {selectedReport && 
        <ReportModal
            report={selectedReport}
            onSubmit = {handleSubmit}
            onClose={() => setSelectedReport(null)}
        />
      }
    </div>
  );
}

export default CheckTicket;