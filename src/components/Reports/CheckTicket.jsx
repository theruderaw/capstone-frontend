import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import ResolveForm from "./ResolveForm";

function CheckTicket() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // initially show 5
  const [showForm,setShowForm] = useState(false)
  const [report,setReport] = useState(null)
  const handleClick = async (reportId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/report/${reportId}?user_id=${user.user_id}`,
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
          `http://localhost:8000/report/?user_id=${user.user_id}`,
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
    <div className="container mt-4">
      <h4 className="mb-3">Reports</h4>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {reports.slice(0, visibleCount).map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.name}</td>
                <td>{report.reason || "-"}</td>
                <td><button className="btn btn-dark" onClick={() => handleClick(report.id)}>Expand</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-dark" onClick={handleShowMore}>
            {(visibleCount==5)?"Show More":"Show Less"}
          </button>
      </div>
      {showForm && <ResolveForm report = {report} show={showForm} onClose={() => setShowForm(false)}/>}
    </div>
  );
}

export default CheckTicket;