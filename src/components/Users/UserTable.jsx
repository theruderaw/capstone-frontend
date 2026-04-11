import React, { useEffect, useState } from "react";
import UserForm from "./UserForm";
import CreateUserModal from "./CreateUserModal";



function UserTable({ userId }) {
  const [rows, setRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshUsers, setRefreshUsers] = useState(false);
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const res = await fetch(`http://localhost:8000/user/all/${userId}`);
      const result = await res.json();

      if (result.status === "OK") {
        setRows(result.data);
      }
    };

    fetchData();
  }, [userId,refreshUsers]);

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">
  <div className="bg-white shadow-lg rounded-2xl">
    <div className="p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold">User List</h4>

        <button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          onClick={() => setShowModal(!showModal)}
        >
          Create New User
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <CreateUserModal
          showModal={showModal}
          setShowModal={setShowModal}
          currUser={userId}
          refreshTable={() => setRefreshUsers(prev => !prev)}
        />
      )}

      {/* Scrollable Table */}
      <div className="border border-gray-200 rounded-lg">
        
        {/* Fixed height container */}
        <div className="max-h-[65vh] overflow-y-auto">
          <table className="min-w-full">
            
            {/* Sticky Header */}
            <thead className="bg-gray-100 text-left text-sm font-medium text-gray-600 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">DoB</th>
                <th className="px-4 py-3">Father's Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {rows.flatMap((item) => [
                
                <tr key={`row-${item.user_id}`} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{item.user_id}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.dob}</td>
                  <td className="px-4 py-3">{item.father_name}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.status_name}</td>
                  <td className="px-4 py-3">
                    <button
                      className="bg-black text-white text-sm px-3 py-1 rounded-md hover:bg-gray-800 transition"
                      onClick={() =>
                        setSelectedUser(
                          selectedUser === item.user_id ? null : item.user_id
                        )
                      }
                    >
                      Details
                    </button>
                  </td>
                </tr>,

                selectedUser === item.user_id && (
                  <tr key={`expand-${item.user_id}`}>
                    <td colSpan="7" className="px-4 py-4 bg-gray-50">
                      <UserForm
                        currUser={userId}
                        userId={item.user_id}
                        refreshTable={() => setRefreshUsers(prev => !prev)}
                      />
                    </td>
                  </tr>
                )
              ].filter(Boolean))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

export default UserTable;