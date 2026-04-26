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
        const res = await fetch(`/project/${projectId}/details?user_id=${user.user_id}`,
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
    <div className="max-w-6xl mx-auto mt-6 px-4">
  
  <h4 className="text-xl font-semibold mb-4">
    Project Members
  </h4>

  {/* scrollable wrapper */}
  <div className="max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">

    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        
        <thead className="bg-gray-900 text-white sticky top-0 z-10">
          <tr>
            <th className="p-3">User ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Role</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {workers.map((worker) => (
            <tr
              key={worker.user_id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="p-3">{worker.user_id}</td>
              <td className="p-3">{worker.name}</td>
              <td className="p-3">{worker.role}</td>

              <td className="p-3">
                <button
                  onClick={() => handleClick(worker.user_id)}
                  disabled={worker.role === "Manager"}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition
                    ${
                      worker.role === "Manager"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-900 hover:bg-gray-700"
                    }`}
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>

  </div>
</div>
  );
}

export default WorkerList;