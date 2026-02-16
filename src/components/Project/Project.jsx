import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import WorkerList from "../Common/WorkerList";

function Project() {
  const { user, setUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchProjectDetails = async () => {
      let projectId = user.project_id;

      // Fetch project ID if not already in context
      if (!projectId) {
        try {
          const res = await fetch(`http://localhost:8000/project/getID/${user.user_id}`, {
            headers: { Accept: "application/json" },
          });
          const data = await res.json();
          if (res.ok && data.status === "OK" && data.data.length > 0) {
            projectId = data.data[0].project_id;
            setUser("project_id", projectId); // update global state
          } else {
            throw new Error("No project found for user");
          }
        } catch (err) {
          console.error(err);
          setError("Failed to fetch project ID");
          setLoading(false);
          return;
        }
      }

      // Fetch project details
      try {
        const res = await fetch(
          `http://localhost:8000/project/${projectId}?user_id=${user.user_id}`,
          { headers: { Accept: "application/json" } }
        );
        const data = await res.json();
        if (res.ok && data.status === "OK" && data.data.length > 0) {
          setProject(data.data[0]);
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

    fetchProjectDetails();
  }, [user?.user_id]); // fetch once per user_id

  if (loading) return <div className="text-center mt-4">Loading project...</div>;
  if (error) return <div className="text-center mt-4 text-danger">{error}</div>;
  if (!project) return <div className="text-center mt-4">No project found</div>;

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Project Details</h4>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="card-title text-dark fw-bold">{project.project_name}</h2>
          <p className="card-text"><strong>Project ID:</strong> {project.project_id}</p>
          <p className="card-text"><strong>Project Manager:</strong> {project.project_manager}</p>
        </div>
      </div>

      {/* Worker list table */}
      {user.project_id && <WorkerList projectId={user.project_id} />}
    </div>
  );
}

export default Project;