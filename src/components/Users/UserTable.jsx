import React, { useEffect, useState, useRef } from "react";
import UserForm from "./UserForm";
import CreateUserModal from "./CreateUserModal";



function UserTable({ userId }) {
  const [rows, setRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshUsers, setRefreshUsers] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedUser(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const res = await fetch(`/user/all/${userId}`);
      const result = await res.json();

      if (result.status === "OK") {
        setRows(result.data);
      }
    };

    fetchData();
  }, [userId, refreshUsers]);

  return (
    <div className="h-[85vh] w-full flex justify-center bg-gray-50 overflow-hidden">
      <div className="w-full max-w-7xl flex flex-col p-6 md:p-8 h-full">
        
        {/* Updated Header */}
        <header className="flex-shrink-0 mb-8 flex flex-col md:flex-row md:items-end justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">User Directory</h1>
            <p className="text-gray-500 mt-2 text-base font-medium">Manage personnel profiles and deployments</p>
          </div>
          <button
            className="mt-4 md:mt-0 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all transform active:scale-95 shadow-lg flex items-center gap-2"
            onClick={() => setShowModal(!showModal)}
          >
            <span className="text-xl">👤</span>
            Create New User
          </button>
        </header>

        {/* Modal */}
        {showModal && (
          <CreateUserModal
            showModal={showModal}
            setShowModal={setShowModal}
            currUser={userId}
            refreshTable={() => setRefreshUsers(prev => !prev)}
          />
        )}

        {/* Enhanced Table Container */}
        <div ref={tableRef} className="flex-1 overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">User ID</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Worker Name</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Helmet ID</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-center">Work</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-center">Site</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Role</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.flatMap((item) => [
                  <tr key={`row-${item.user_id}`} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{item.user_id}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                    <td className="px-6 py-4">
                      {item.helmet_id ? (
                        <span className="bg-black text-white px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tighter shadow-sm">
                          HEL-{item.helmet_id}
                        </span>
                      ) : (
                        <span className="text-gray-300 italic text-[10px]">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <div className={`w-3.5 h-3.5 rounded-full ${item.working ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center text-lg">
                        {item.onsite ? '📍' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold text-gray-500">
                        {item.status_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="bg-white border-2 border-black text-black text-[11px] font-black px-4 py-1.5 rounded-xl hover:bg-black hover:text-white transition-all transform active:scale-95"
                        onClick={() =>
                          setSelectedUser(
                            selectedUser === item.user_id ? null : item.user_id
                          )
                        }
                      >
                        {selectedUser === item.user_id ? 'CLOSE' : 'DETAILS'}
                      </button>
                    </td>
                  </tr>,
                  selectedUser === item.user_id && (
                    <tr key={`expand-${item.user_id}`} className="bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                      <td colSpan="7" className="px-8 py-8 border-l-4 border-black shadow-inner">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                           <UserForm
                            currUser={userId}
                            userId={item.user_id}
                            refreshTable={() => setRefreshUsers(prev => !prev)}
                          />
                        </div>
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
  );
}

export default UserTable;