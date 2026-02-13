import React,{useEffect, useState} from 'react'
import ProjectDetail from './ProjectDetail';

function ProjectSupervisor() {
  const [projectID,setProjectID] = useState(0)
  const [projectData,setProjectData] = useState(null)
  const [projectMembers,setProjectMembers] = useState([])

  useEffect(() => {
    const fetchAllProjectData = async () => {
      const userId = localStorage.user_id;
      if (!userId) return console.error("No user_id found in localStorage");

      try {
        // 1️⃣ Fetch project ID
        const responseId = await fetch(`http://localhost:8000/project/getID/${userId}`);
        if (!responseId.ok) throw new Error("Failed to fetch project_id");

        const dataId = await responseId.json();
        const id = dataId.data[0].project_id;
        setProjectID(id);
        localStorage.setItem("project_id", id);

        // 2️⃣ Fetch project data
        const responseData = await fetch(`http://localhost:8000/project/${id}?user_id=${userId}`);
        if (!responseData.ok) throw new Error("Couldn't fetch project data");
        const data = await responseData.json();
        setProjectData(data.data[0]);

        // 3️⃣ Fetch project members
        const responseMembers = await fetch(`http://localhost:8000/project/${id}/details?user_id=${userId}`);
        if (!responseMembers.ok) throw new Error("Couldn't fetch project members");
        const members = await responseMembers.json();
        setProjectMembers(members.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchAllProjectData();
  }, []);

  return (
  <div style={{ padding: "20px" }}>
    <h2>Project Supervisor</h2>

    <p><strong>Project ID:</strong> {projectID}</p>

    {projectData && (
      <div style={{ marginTop: "20px" }}>
        <h3>Project Details</h3>
        <p><strong>Name:</strong> {projectData.project_name}</p>
        <p><strong>Manager:</strong> {projectData.project_manager}</p>
      </div>
    )}

    <div style={{ marginTop: "30px" }}>
      <h3>Project Members</h3>

      {projectMembers.length > 0 ? (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {projectMembers.map((member) => (
              <tr key={member.user_id}>
                <td>{member.user_id}</td>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td><ProjectDetail workerID = {member.user_id} active = {member.role == 'Manager'}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No members found.</p>
      )}
    </div>
  </div>
);
}
export default ProjectSupervisor