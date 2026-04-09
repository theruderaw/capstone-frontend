import React, { useState, useEffect } from "react";
import SupervisorDropdown from "../Common/SupervisorDropdown";

const UserForm = ({ currUser,userId,refreshTable }) => {
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
    penalty_per_unit: ""
  });

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/user/${userId}`);
        const data = await res.json();
        console.log(data.data[0].supervisor)
        if (data.status === "OK") {
          const result = data.data[0]
          setFormData({
            user_id: result.user_id || user_id,
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
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

	const handleDelete = async () => {
		try {
			console.log(`http://localhost:8000/user/delete/${userId}`)
			const response = await fetch(`http://localhost:8000/user/delete/${userId}`, {
				method: "PATCH",
				headers: {
					accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user_id: currUser,
				}),
			});

			const data = await response.json();
			console.log("Delete response:", data);
		} catch (error) {
			console.error("Delete failed:", error);
		}
		refreshTable();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
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
			user_action: {
				user_id: Number(currUser)
			}
		};

		try {
			const res = await fetch(
				`http://localhost:8000/user/edit/${userId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(payload)
				}
			);

			const result = await res.json();

			if (result.status === "OK") {
				alert(`User ${userId} updated successfully`);
				console.log(result);
			} else {
				alert("Update failed");
				console.error(result);
			}
		} catch (error) {
			console.error("Request failed:", error);
			alert("Something went wrong");
		}
	};
	refreshTable();
  return (
    <div className="card mt-2 shadow-sm">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">User ID</label>
              <input
                type="number"
                name="user_id"
                value={formData.user_id}
                readOnly
                className="form-control"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Aadhar No</label>
              <input
                type="text"
                name="aadhar_no"
                value={formData.aadhar_no}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Father Name</label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Gender</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-8 mb-3">
              <label className="form-label">Address</label>
              <textarea
                rows="2"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Status ID</label>
              <input
                type="number"
                name="status_id"
                value={formData.status_id}
                onChange={handleChange}
                className="form-control"
              />
            </div>
						<div className="col-md-4 mb-3">
							<label className="form-label">New</label>
            	<SupervisorDropdown/>
						</div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Base Wage</label>
              <input
                type="number"
                name="base_wage"
                value={formData.base_wage}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Penalty Per Unit</label>
              <input
                type="number"
                name="penalty_per_unit"
                value={formData.penalty_per_unit}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Onsite</label>
              <input
                type="text"
                name="onsite"
                value={formData.onsite}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

					<div className="d-flex justify-content-between align-items-center mt-3">
						<button
							type="submit"
							className="btn btn-success"
						>
							Submit
						</button>
						
						<button
							type="button"
							className="btn btn-danger"
							onClick={handleDelete}
						>
							Delete
						</button>

						
					</div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;