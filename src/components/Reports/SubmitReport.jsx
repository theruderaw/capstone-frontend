import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import Toast from "../Common/Toast";
import SubmitReportModal from "./SubmitReportModal";
import MyReportsTable from "./MyReportsTable";

function SubmitReport() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedReport, setExpandedReport] = useState(null);
  const [username, setUsername] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH USER DATA AND REPORTS
  useEffect(() => {
    if (!user?.user_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user info
        const userRes = await fetch(`/info/user?user_id=${user.user_id}`
        );
        const userData = await userRes.json();
        if (userRes.ok) setUsername(userData.data.name);

        // Fetch supervisor info
        const supRes = await fetch(`/info/supervisor?user_id=${user.user_id}`
        );
        const supData = await supRes.json();
        if (supRes.ok) setSupervisor(supData.data.supervisor_name);

        // Fetch user's own reports
        const reportsRes = await fetch(`/report/self?user_id=${user.user_id}`,
          { headers: { accept: "application/json" } }
        );
        const reportsData = await reportsRes.json();
        if (reportsRes.ok && reportsData.data) setReports(reportsData.data);
      } catch (err) {
        console.error(err);
        setToastMessage("Failed to load data");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.user_id]);

  // 🔥 SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.user_id) return;

    const payload = {
      reason,
      description,
      submission_date: new Date().toISOString().split("T")[0],
      user_id: user.user_id,
    };

    setLoading(true);
    try {
      const res = await fetch("/report/submit", {
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
        setToastMessage("Report submitted successfully!");
        setShowToast(true);
        setShowModal(false);
        // Refetch reports
        const reportsRes = await fetch(`/report/self?user_id=${user.user_id}`,
          { headers: { accept: "application/json" } }
        );
        const reportsData = await reportsRes.json();
        if (reportsRes.ok && reportsData.data) setReports(reportsData.data);
      } else {
        setToastMessage("Failed to submit report");
        setShowToast(true);
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Server error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[85vh] w-full flex justify-center bg-gray-50 overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col p-6 md:p-8 h-full">
        <header className="flex-shrink-0 mb-6 flex flex-col md:flex-row md:items-end justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Reports</h1>
            <p className="text-gray-500 mt-1 text-base font-medium">Submit & Track Your Reports</p>
          </div>
        </header>

        {toastMessage && (
          <div className={`flex-shrink-0 p-3 mb-6 border-l-4 rounded-r shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
            toastMessage.includes('successfully')
            ? 'bg-green-50 border-green-500 text-green-700'
            : 'bg-red-50 border-red-500 text-red-700'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">{toastMessage.includes('successfully') ? '✅' : '⚠️'}</span>
              <span className="font-medium text-sm">{toastMessage}</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submit Report Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-black text-white rounded-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Submit Report</h2>
              </div>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed font-normal">Report issues or concerns to your supervisor.</p>
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transform active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:scale-100 shadow-lg"
              >
                Create New Report
              </button>
            </div>

            {/* Stats Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-black text-white rounded-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Overview</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reports</span>
                  <span className="font-bold text-gray-800">{reports.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-bold text-yellow-600">{reports.filter(r => !r.remarks).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolved</span>
                  <span className="font-bold text-green-600">{reports.filter(r => r.remarks).length}</span>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black text-white rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">All My Reports</h2>
                </div>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                  {reports.length} Total
                </span>
              </div>
              <div className="flex-1 overflow-auto">
                {reports.length > 0 ? (
                  <MyReportsTable
                    reports={reports}
                    onExpand={setExpandedReport}
                    expandedReport={expandedReport}
                    onCloseExpanded={() => setExpandedReport(null)}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>{loading ? 'Loading reports...' : 'No reports submitted yet.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <SubmitReportModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          username={username}
          supervisor={supervisor}
          reason={reason}
          setReason={setReason}
          description={description}
          setDescription={setDescription}
        />

        {showToast && (
          <Toast
            onClose={() => setShowToast(false)}
            message={toastMessage}
            title="Report"
          />
        )}
      </div>
    </div>
  );
}

export default SubmitReport;