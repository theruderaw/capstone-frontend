import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../../AuthContext";
import WorkerList from "../Common/WorkerList";

function ProjectModal({ projectInfo, projectId, show, onHide }) {
  const {user} = useAuth();
  const [workerList, setWorkerList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId || !show) return; // only fetch when modal is shown

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/project/${projectId}/details?user_id=${user.user_id}`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        if (res.ok && data.status === "OK") {
          setWorkerList(data.data);
        } else {
          setError("Failed to fetch project details");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, show]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Project Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {projectInfo && (
          <div>
            <p><strong>Project ID:</strong> {projectInfo.project_id}</p>
            <p><strong>Project Name:</strong> {projectInfo.project_name}</p>
            <p><strong>Manager:</strong> {projectInfo.manager}</p>
            <p><strong>Description:</strong> {projectInfo.description}</p>
            {/* Add any other fields */}
          </div>
        )}
        <WorkerList projectId={projectInfo.project_id}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} value={null}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProjectModal;