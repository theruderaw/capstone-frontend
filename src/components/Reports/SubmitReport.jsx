import { useState,useEffect } from "react"
import {useAuth} from "../../AuthContext"
import Toast from "../Common/Toast"

function SubmitReport() {
  const { user } = useAuth()
  const [username, setUsername] = useState("")
  const [supervisor, setSupervisor] = useState(null)
  const [reason,setReason] = useState('')
  const [description,setDescription] = useState('')
  const [showToast,setShowToast] = useState(false)

  useEffect(() => {
    if (!user?.user_id) return

    const fetchData = async () => {
      try {
        // Fetch username
        const userRes = await fetch(`http://localhost:8000/info/user?user_id=${user.user_id}`, {
          headers: { Accept: "application/json" }
        })
        const userData = await userRes.json()
        if (userRes.ok) setUsername(userData.data.name)

        // Fetch supervisor
        const supRes = await fetch(`http://localhost:8000/info/supervisor?user_id=${user.user_id}`, {
          headers: { Accept: "application/json" }
        })
        const supData = await supRes.json()
        if (supRes.ok) setSupervisor(supData.data.supervisor_name)
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [user?.user_id])



  const handleClick = async () => {
    if (!user?.user_id) return alert("User not logged in")

    const payload = {
      reason: reason,
      description: description,
      submission_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      user_id: user.user_id
    }

    try {
      const res = await fetch("http://localhost:8000/report/submit", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      console.log("Response:", data)

      if (res.ok) {
        setReason("")
        setDescription("")
		setShowToast(true)
      } else {
        alert("Failed to submit report")
      }

    } catch (err) {
      console.error(err)
      alert("Error submitting report")
    }
  }


  return (
    <div className="container mt-4" 
         style={{ maxHeight: "calc(100vh - 56px)", overflowY: "auto" }}>
      {/* maxHeight: viewport minus navbar height, scroll only inside container */}

      {/* Row 1: Two short fields */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">Reason</span>
            <input type="text" className="form-control" placeholder="Short reason" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">Complainant</span>
            <input type="text" className="form-control" value={username} disabled/>
          </div>
        </div>
      </div>

      {/* Row 2: Big textarea */}
      <div className="row g-3 mt-4">
        <div className="col-12">
          <div className="form-floating">
            <textarea
              className="form-control"
              placeholder="Write full complaint here..."
              style={{ minHeight: "50vh" }} // can scroll inside container
            ></textarea>
            <label>Full Complaint</label>
          </div>
        </div>
      </div>

      {/* Row 3: Two long fields */}
      <div className="row g-3 mt-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">Date of Report</span>
            <input type="text" className="form-control" disabled value={new Date().toISOString().split("T")[0]} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">Supervisor</span>
            <input type="text" className="form-control" value={supervisor} disabled/>
          </div>
        </div>
      </div>

      {/* Row 4: Register button */}
      <div className="row mt-4 mb-3">
        <div className="col d-flex justify-content-center">
          <button className="btn btn-dark" onClick={handleClick}>Register</button>
        </div>
      </div>
	  <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message="Report submitted successfully!"
        title="Success"
      />
    </div>
  )
}

export default SubmitReport