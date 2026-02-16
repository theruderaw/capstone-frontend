import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

function WorkerList({ projectId }) {
  const { user,setUser } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchWorkers = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/project/${projectId}/details?user_id=${user.user_id}`,
          { headers: { Accept: "application/json" } }
        );
        const data = await res.json();

        if (res.ok && data.status === "OK") {
          setWorkers(data.data);
        } else {
          setError("Failed to fetch project members");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching project members");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [projectId, user?.user_id]);

  const handleClick = (user) => {
    setUser("currentWorkerId",user)
    navigate(`/profile/${user}`)
  }

  if (loading) return <div className="text-center mt-4">Loading members...</div>;
  if (error) return <div className="text-center mt-4 text-danger">{error}</div>;
  if (workers.length === 0) return <div className="text-center mt-4">No members found</div>;

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Project Members</h4>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker.user_id}>
                <td>{worker.user_id}</td>
                <td>{worker.name}</td>
                <td>{worker.role}</td>
                <td><button className="btn btn-dark" disabled={worker.role == "Manager"} onClick={() => handleClick(worker.user_id)}> + </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkerList;