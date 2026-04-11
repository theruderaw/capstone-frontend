import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import Toast from "../Common/Toast";

function SubmitReport() {
  const { user } = useAuth();

  const [username, setUsername] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 🔥 FETCH USER DATA
  useEffect(() => {
    if (!user?.user_id) return;

    const fetchData = async () => {
      try {
        const userRes = await fetch(
          `http://localhost:8000/info/user?user_id=${user.user_id}`
        );
        const userData = await userRes.json();
        if (userRes.ok) setUsername(userData.data.name);

        const supRes = await fetch(
          `http://localhost:8000/info/supervisor?user_id=${user.user_id}`
        );
        const supData = await supRes.json();
        if (supRes.ok) setSupervisor(supData.data.supervisor_name);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user?.user_id]);

  // 🔥 SUBMIT HANDLER (CORRECT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.user_id) return;

    const payload = {
      reason,
      description,
      submission_date: new Date().toISOString().split("T")[0],
      user_id: user.user_id,
    };

    try {
      const res = await fetch("http://localhost:8000/report/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setReason("");
        setDescription("");
        setShowToast(true);
      } else {
        alert("Failed to submit");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col overflow-hidden px-6 py-4"
    >
      {/* SCROLL AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
            className="w-full border rounded-md px-3 py-2"
            required
          />

          <input
            type="text"
            value={username}
            disabled
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
          />

        </div>

        {/* TEXTAREA */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Full complaint"
          className="w-full min-h-[35vh] border rounded-md p-3"
          required
        />

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            value={new Date().toISOString().split("T")[0]}
            disabled
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
          />

          <input
            type="text"
            value={supervisor || ""}
            disabled
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
          />

        </div>

      </div>

      {/* BUTTON */}
      <div className="pt-4 flex justify-center">
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
        >
          Register
        </button>
      </div>

      {/* TOAST */}
      {showToast && (
        <Toast
          onClose={() => setShowToast(false)}
          message="Report submitted successfully!"
          title="Success"
        />
      )}
    </form>
  );
}

export default SubmitReport;