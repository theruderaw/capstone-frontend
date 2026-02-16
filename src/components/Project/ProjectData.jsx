import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { Button } from "react-bootstrap";
import ProjectModal from "./ProjectModal";

function ProjectData() {
  const [projectInfo, setProjectInfo] = useState([]);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectData, setSelectedProjectData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/project/getManagerProjects/${user.user_id}`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        if (res.ok && data.status === "OK" && data.data.length > 0) {
          setProjectInfo(data.data);
        } else {
          setProjectInfo([]);
          setError("No project found for user");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (projectInfo.length === 0) return <p>No projects available.</p>;

  return (
    <div className="container mt-3">
      <h3>My Projects</h3>
      <table className="table table-bordered table-striped text-center">
        <thead className="table-dark">
          <tr>
            <th>Project ID</th>
            <th>Project Name</th>
            <th>Manager</th>
            <th>Description</th>
            <th>Expand</th>
          </tr>
        </thead>
        <tbody>
          {projectInfo.map((proj) => (
            <tr key={proj.project_id}>
              <td>{proj.project_id}</td>
              <td>{proj.project_name}</td>
              <td>{proj.manager}</td>
              <td>{proj.description}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => {
                    setSelectedProjectId(proj.project_id);
                    setSelectedProjectData(proj);
                    setShowModal(true);
                  }}
                >
                  Expand
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Project Modal */}
      {selectedProjectId && (
        <ProjectModal
          projectInfo={selectedProjectData}
          projectId={selectedProjectId}
          show={showModal}
          onHide={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default ProjectData;