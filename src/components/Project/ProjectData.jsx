import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import ProjectsTable from "./ProjectsTable";
import ProjectDetailsModal from "./ProjectDetailsModal";

function ProjectData() {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        // STEP 1: get project IDs
        const res = await fetch(`/project/getID/${user.user_id}`,
          {
            headers: { Accept: "application/json" },
          }
        );

        const data = await res.json();

        if (
          !res.ok ||
          data.status !== "OK" ||
          !Array.isArray(data.data)
        ) {
          setProjects([]);
          setError("No projects found for user");
          return;
        }

        const projectIds = data.data;

        // STEP 2: fetch full project details
        const detailedProjects = await Promise.all(
          projectIds.map(async (proj) => {
            const id = proj.project_id;

            const detailRes = await fetch(`/project/${id}?user_id=${user.user_id}`,
              {
                headers: { Accept: "application/json" },
              }
            );

            const detailData = await detailRes.json();

            if (detailRes.ok && detailData.status === "OK") {
              return detailData.data[0];
            }

            return null;
          })
        );

        const cleaned = detailedProjects.filter(Boolean);
        setProjects(cleaned);

      } catch (err) {
        console.error(err);
        setError("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleExpand = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <div className="h-[85vh] w-full flex justify-center bg-gray-50 overflow-hidden">
      <div className="w-full max-w-6xl flex flex-col p-6 md:p-8 h-full">
        <header className="flex-shrink-0 mb-6 flex flex-col md:flex-row md:items-end justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Projects</h1>
            <p className="text-gray-500 mt-1 text-base font-medium">View and manage your assigned projects</p>
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
          <div className="grid grid-cols-1 gap-6">
            {/* Projects Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black text-white rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">All Projects</h2>
                </div>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                  {projects.length} Total
                </span>
              </div>
              <div className="flex-1 overflow-auto">
                {loading ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Loading projects...</p>
                  </div>
                ) : projects.length > 0 ? (
                  <ProjectsTable
                    projects={projects}
                    onExpand={handleExpand}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>No projects available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ProjectDetailsModal
          project={selectedProject}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}

export default ProjectData;