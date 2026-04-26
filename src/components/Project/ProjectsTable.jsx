import React from "react";

function ProjectsTable({ projects, onExpand }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-center">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="p-3">Project ID</th>
            <th className="p-3">Project Name</th>
            <th className="p-3">Manager</th>
            <th className="p-3">Description</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj) => (
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
                  onClick={() => onExpand(proj)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Expand
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectsTable;