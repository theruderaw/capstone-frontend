import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../../AuthContext";
import WorkerList from "../Common/WorkerList";

function ProjectModal({ projectInfo, projectId, show, onHide }) {
  const {user} = useAuth();
  const [workerList, setWorkerList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(projectInfo)
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

  if (!show || !projectInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onHide}
      />

      {/* modal box */}
      <div className="relative w-[92%] max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden">

        {/* header */}
        <div className="flex justify-between items-center px-5 py-3 bg-gray-900 text-white">
          <h2 className="text-lg font-semibold">
            Project Details
          </h2>

          <button
            onClick={onHide}
            className="text-white text-xl hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="p-5 space-y-3 text-sm max-h-[70vh] overflow-y-auto">

          {loading && (
            <p className="text-gray-500">Loading...</p>
          )}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {projectInfo && (
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Project ID:</span>{" "}
                {projectInfo.project_id}
              </p>

              <p>
                <span className="font-semibold">Project Name:</span>{" "}
                {projectInfo.project_name}
              </p>

              <p>
                <span className="font-semibold">Manager:</span>{" "}
                {projectInfo.manager}
              </p>

              <p>
                <span className="font-semibold">Description:</span>{" "}
                {projectInfo.description}
              </p>
            </div>
          )}

          {/* Worker list */}
          {projectInfo?.project_id && (
            <div className="mt-4">
              <WorkerList projectId={projectInfo.project_id} />
            </div>
          )}

        </div>

        {/* footer */}
        <div className="flex justify-end px-5 py-3 border-t bg-gray-50">
          <button
            onClick={onHide}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProjectModal;