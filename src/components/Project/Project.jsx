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
          const res = await fetch(`/project/getID/${user.user_id}`, {
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
        const res = await fetch(`/project/${projectId}?user_id=${user.user_id}`,
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
  }, [user?.user_id]);

  return (
    <div className="h-[85vh] w-full flex justify-center bg-gray-50 overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col p-6 md:p-8 h-full">
        <header className="flex-shrink-0 mb-6 flex flex-col md:flex-row md:items-end justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Project</h1>
            <p className="text-gray-500 mt-1 text-base font-medium">View details of your assigned project</p>
          </div>
        </header>

        {error && (
          <div className="flex-shrink-0 p-3 mb-6 border-l-4 rounded-r shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 bg-red-50 border-red-500 text-red-700">
            <div className="flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <span className="font-medium text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-black text-white rounded-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Project Details</h2>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading project details...</p>
                </div>
              ) : project ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                      <div className="w-full border rounded-md px-3 py-2 bg-gray-100 font-semibold">
                        {project.project_name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
                      <div className="w-full border rounded-md px-3 py-2 bg-gray-100 font-semibold">
                        {project.project_id}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Manager</label>
                      <div className="w-full border rounded-md px-3 py-2 bg-gray-100">
                        {project.project_manager}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div className="w-full border rounded-md px-3 py-2 bg-gray-100 flex items-center">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No project assigned.</p>
                </div>
              )}
            </div>

            {/* Team Members Card */}
            {user.project_id && project && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden flex flex-col">
                <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                  <div className="p-2 bg-black text-white rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
                </div>
                <div className="flex-1 overflow-auto">
                  <WorkerList projectId={user.project_id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;