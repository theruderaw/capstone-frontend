import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
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
        // STEP 1: get project IDs
        const res = await fetch(
          `http://localhost:8000/project/getID/${user.user_id}`,
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
          setProjectInfo([]);
          setError("No project found for user");
          return;
        }

        const projectIds = data.data;

        // STEP 2: fetch full project details
        const detailedProjects = await Promise.all(
          projectIds.map(async (proj) => {
            console.log(proj)
            const id = proj.project_id;

            const detailRes = await fetch(
              `http://localhost:8000/project/${id}?user_id=${user.user_id}`,
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
        setProjectInfo(cleaned);

      } catch (err) {
        console.error(err);
        setError("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (projectInfo.length === 0) return <p>No projects available.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">

      <h3 className="text-2xl font-semibold mb-4">
        My Projects
      </h3>

      <div className="overflow-x-auto rounded-lg border border-gray-200">

        <table className="w-full text-sm text-center">

          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3">Project ID</th>
              <th className="p-3">Project Name</th>
              <th className="p-3">Manager</th>
              <th className="p-3">Description</th>
              <th className="p-3">Expand</th>
            </tr>
          </thead>

          <tbody>
            {projectInfo.map((proj) => {
              console.log(proj)
              return (
              <tr
                key={proj.project_id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{proj.project_id}</td>
                <td className="p-3">{proj.project_name}</td>
                <td className="p-3">{proj.project_manager}</td>
                <td className="p-3">{proj.description}</td>

                <td className="p-3">
                  <button
                    onClick={() => {
                      setSelectedProjectId(proj.project_id);
                      setSelectedProjectData(proj);
                      setShowModal(true);
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Expand
                  </button>
                </td>
              </tr>
            )
})}
          </tbody>

        </table>

      </div>

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