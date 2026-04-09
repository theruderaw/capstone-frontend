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
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">User List</h4>

            <button
            className="btn btn-dark"
            onClick={() => {
                // open blank form / modal / navigate
                setShowModal(!showModal)
            }}
            >
            Create New User
            </button>
        </div>

        {showModal && <CreateUserModal
            showModal={showModal}
            setShowModal={setShowModal}
            currUser={userId}
            refreshTable={() => setRefreshUsers(prev => !prev)}
        />}

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>DoB</th>
                  <th>Father's Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((item) => (
                  <React.Fragment key={item.user_id}>
                    {/* Main row */}
                    <tr>
                      <td>{item.user_id}</td>
                      <td>{item.name}</td>
                      <td>{item.dob}</td>
                      <td>{item.father_name}</td>
                      <td>{item.email}</td>
                      <td>{item.status_name}</td>
                      <td>
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() =>
                            setSelectedUser(
                              selectedUser === item.user_id
                                ? null
                                : item.user_id
                            )
                          }
                        >
                          Details
                        </button>
                      </td>
                    </tr>

                    {/* Expandable form row */}
                    {selectedUser === item.user_id && (
                      <tr>
                        <td colSpan="7">
                          <UserForm currUser={userId} userId={item.user_id} refreshTable={() => setRefreshUsers(prev => !prev)}/>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserTable;