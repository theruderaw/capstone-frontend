import React, { useState, useEffect } from "react";
import SupervisorDropdown from "../Common/SupervisorDropdown";

const UserForm = ({ currUser, userId, refreshTable, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    user_id: userId,
    aadhar_no: "",
    name: "",
    father_name: "",
    dob: "",
    gender: "",
    email: "",
    address: "",
    status_id: "",
    supervisor: "",
    base_wage: "",
    penalty_per_unit: "",
    password: "" // Added for creation mode
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || mode === 'create') return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/user/${userId}`);
        const data = await res.json();
        if (data.status === "OK") {
          const result = data.data[0];
          setFormData({
            ...formData,
            user_id: result.user_id || userId,
            aadhar_no: result.aadhar_no || "",
            name: result.name || "",
            father_name: result.father_name || "",
            dob: result.dob || "",
            gender: result.gender || "",
            email: result.email || "",
            address: result.address || "",
            status_id: result.status_id || "",
            supervisor: result.supervisor || "",
            base_wage: result.base_wage || "",
            penalty_per_unit: result.penalty_per_unit || ""
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/user/delete/${userId}`, {
        method: "PATCH",
        headers: { accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currUser })
      });
      const data = await response.json();
      if (data.status === "OK") {
        refreshTable();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = mode === 'edit' ? {
      user_personal: {
        aadhar_no: formData.aadhar_no,
        dob: formData.dob,
        name: formData.name,
        status_id: Number(formData.status_id),
        gender: formData.gender,
        father_name: formData.father_name,
        address: formData.address,
        active: true,
        email: formData.email
      },
      user_action: { user_id: Number(currUser) }
    } : {
      user_personal: {
        aadhar_no: formData.aadhar_no,
        dob: formData.dob,
        name: formData.name,
        status_id: Number(formData.status_id),
        gender: formData.gender,
        father_name: formData.father_name,
        address: formData.address,
        active: true,
        email: formData.email
      },
      auth: {
        password: formData.password
      }
    };

    try {
      const endpoint = mode === 'edit' 
        ? `/user/edit/${userId}` 
        : `/user/add?user_id=${currUser}`;
      
      const method = mode === 'edit' ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.status === "OK") {
        alert(mode === 'edit' ? "Profile updated successfully" : "User created successfully");
        refreshTable();
      } else {
        alert("Operation failed: " + (result.detail || "Unknown error"));
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Identity Section */}
          <div className="space-y-4 col-span-full">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b pb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              Core Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mode === 'edit' ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase ml-1">System ID</label>
                  <input
                    type="number"
                    name="user_id"
                    value={formData.user_id}
                    readOnly
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-mono text-xs text-gray-400 shadow-inner"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Access Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Set entry code"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold text-sm transition-all shadow-inner"
                    required
                  />
                </div>
              )}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter worker's legal name"
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold text-sm transition-all shadow-inner"
                  required
                />
              </div>
            </div>
          </div>
          {/* Personal Details */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b pb-2">Personal</h3>
             <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Aadhar Number</label>
                  <input
                    type="text"
                    name="aadhar_no"
                    value={formData.aadhar_no}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium text-sm transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Father's Name</label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium text-sm transition-all shadow-inner"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-700 uppercase ml-1">DOB</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium text-sm transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Gender</label>
                    <input
                      type="text"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium text-sm transition-all shadow-inner"
                    />
                  </div>
                </div>
             </div>
          </div>

          {/* Contact & Deployment */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b pb-2">Employment</h3>
             <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Email Terminal</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium text-sm transition-all shadow-inner"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Status Level</label>
                    <input
                      type="number"
                      name="status_id"
                      value={formData.status_id}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium text-sm transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Supervisor</label>
                    <div className="shadow-inner rounded-2xl overflow-hidden">
                        <SupervisorDropdown />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Geographic Address</label>
                  <textarea
                    rows="2"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium text-sm transition-all shadow-inner resize-none"
                  />
                </div>
             </div>
          </div>

          {/* Financials */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b pb-2">Pay & Logistics</h3>
             <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Base Wage (₹)</label>
                  <input
                    type="number"
                    name="base_wage"
                    value={formData.base_wage}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold text-sm transition-all shadow-inner text-green-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-700 uppercase ml-1">Penalty Unit (₹)</label>
                  <input
                    type="number"
                    name="penalty_per_unit"
                    value={formData.penalty_per_unit}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold text-sm transition-all shadow-inner text-red-700"
                  />
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t border-gray-100">
          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 rounded-2xl border-2 border-red-50 text-red-500 font-bold hover:bg-red-50 transition-all active:scale-95 disabled:grayscale"
            >
              TERMINATE RECORD
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-16 py-4 rounded-2xl bg-black text-white font-black hover:bg-gray-800 shadow-xl transition-all transform active:scale-98 disabled:bg-gray-400 ${mode === 'create' ? 'md:ml-auto' : ''}`}
          >
            {loading ? 'SYNCHRONIZING...' : mode === 'edit' ? 'COMMIT CHANGES' : 'CREATE ACCOUNT'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;