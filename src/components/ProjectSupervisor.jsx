import React,{useEffect, useState} from 'react'
import ProjectDetail from './ProjectDetail';

function ProjectSupervisor() {
  const [projectID,setProjectID] = useState(0)
  const [projectData,setProjectData] = useState(null)
  const [projectMembers,setProjectMembers] = useState([])

  useEffect(() => {
    console.log("useEffect ran")
    const fetchProjectId = async () => {
        const userId = localStorage.user_id;

        if (!userId) {
          console.error("No user_id found in localStorage");
          return;
        }

        try {
          const response = await fetch(
            `http://localhost:8000/project/getID/${userId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch project_id");
          }

          const data = await response.json();
          console.log(data)
          const id = data.data[0].project_id
          console.log(projectID)
          setProjectID(id)
          // Assuming backend returns { project_id: 123 }
          localStorage.setItem("project_id", id);

          console.log("project_id stored:", id);

        } catch (error) {
          console.error("Error fetching project_id:", error);
        }
      };

    fetchProjectId();

    const fetchProjectData = async () => {
      const projectID = localStorage.getItem('project_id')
      
      try {
        const response = await fetch(
          `http://localhost:8000/project/${projectID}?user_id=${localStorage.user_id}`
        )

        if (!response.ok){
          throw new Error("Couldn't fetch project data")
        }
        const data = await response.json()
        const projectData = data.data[0];
        setProjectData(projectData)

        console.log(projectData)
      } catch (err) {
        console.log("error fetching project data",err)
      }
    }

    fetchProjectData()
    const fetchProjectMembers = async () => {
      const projectID = localStorage.getItem('project_id')
      
      try {
        const response = await fetch(
          `http://localhost:8000/project/${projectID}/details?user_id=${localStorage.user_id}`
        )

        if (!response.ok){
          throw new Error("Couldn't fetch project data")
        }
        const data = await response.json()
        const projectMembers = data.data;
        setProjectMembers(projectMembers)

        console.log(projectMembers)
      } catch (err) {
        console.log("error fetching project data",err)
      }
    }

    fetchProjectMembers()

    console.log(projectData)
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