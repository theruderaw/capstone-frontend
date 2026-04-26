import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import WorkerList from "../Common/WorkerList";

function ProjectDetailsModal({ project, show, onClose }) {
  const { user } = useAuth();
  const [workerList, setWorkerList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!project?.project_id || !show) return;

    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/project/${project.project_id}/details?user_id=${user.user_id}`, {
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

    fetchProjectDetails();
  }, [project?.project_id, show, user.user_id]);

  if (!show || !project) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        <div className="relative w-[92%] max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between bg-gray-900 text-white px-6 py-4 flex-none">
            <h5 className="text-xl font-semibold">Project Details</h5>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4">
            {loading && (
              <p className="text-gray-500">Loading project details...</p>
            )}

            {error && (
              <p className="text-red-500">{error}</p>
            )}

            {project && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
                    <div className="w-full border rounded-md px-3 py-2 bg-gray-100">
                      {project.project_id}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <div className="w-full border rounded-md px-3 py-2 bg-gray-100">
                      {project.project_name}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                    <div className="w-full border rounded-md px-3 py-2 bg-gray-100">
                      {project.project_manager}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <div className="w-full border rounded-md px-3 py-2 bg-gray-100">
                      {project.description || "No description available"}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Team Members</h3>
                  {project.project_id && (
                    <WorkerList projectId={project.project_id} />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50 flex-none">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectDetailsModal;