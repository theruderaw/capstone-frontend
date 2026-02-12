import React, { useState, useEffect } from "react";
import Textbox from "./Textbox";
import Button from "./Button";

function ReportModal({ report,onSubmit, onClose }) {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (report) setRemarks(report.remarks || "");
  }, [report]);

  if (!report) return null;

  const handleSubmit = () => {
    console.log("Submitting remarks:", remarks);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h3>Report Details</h3>

        <div className="modal-content-grid">
          <p><strong>ID:</strong> {report.id}</p>
          <p><strong>Worker:</strong> {report.worker_name}</p>
          <p><strong>Supervisor:</strong> {report.supervisor_name}</p>
          <p><strong>Date:</strong> {report.report_date}</p>
          <p><strong>Reason:</strong> {report.reason}</p>
          <p><strong>Content:</strong> {report.report_content}</p>
          <Textbox
            text={remarks}
            setText={setRemarks}
            placeholder="Enter resolution remarks..."
          />
        </div>

        <div className="modal-actions">
            {console.log(remarks)}
          <Button onClick={() => onSubmit(remarks)} className="submit-btn" disabled={!remarks.trim()}>
            Submit
          </Button>
          <Button onClick={onClose} className="close-btn">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;