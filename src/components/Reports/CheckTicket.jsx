import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import ResolveForm from "./ResolveForm";
import ReportTable from "./ReportTable";

function CheckTicket({ endpointURL }) {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async (reportId) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`/report/report/?report_id=${reportId}&user_id=${user.user_id}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setReport(data.data[0]);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setMessage('Failed to load report details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${endpointURL}${user.user_id}`,
          { headers: { accept: "application/json" } }
        );
        const data = await res.json();
        if (res.ok) setReports(data.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setMessage('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user?.user_id]);

  const handleShowMore = () => {
    setVisibleCount(visibleCount === 5 ? reports.length : 5);
  };

  return (
    <div className="h-[85vh] w-full flex justify-center bg-gray-50 overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col p-6 md:p-8 h-full">
        <header className="flex-shrink-0 mb-6 flex flex-col md:flex-row md:items-end justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Report Management Center</h1>
            <p className="text-gray-500 mt-1 text-base font-medium">Review & Resolve Worker Reports</p>
          </div>
        </header>

        {message && (
          <div className={`flex-shrink-0 p-3 mb-6 border-l-4 rounded-r shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.startsWith('Failed')
            ? 'bg-red-50 border-red-500 text-red-700'
            : 'bg-green-50 border-green-500 text-green-700'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">{message.startsWith('Failed') ? '⚠️' : '✅'}</span>
              <span className="font-medium text-sm">{message}</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Stats Card */}
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

            {/* Resolve Report Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-black text-white rounded-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Resolve Reports</h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">Click "Expand" on any report below to review and resolve it.</p>
              <div className="text-center">
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  {loading ? 'Loading...' : `${reports.filter(r => !r.remarks).length} Pending`}
                </span>
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
                  <h2 className="text-xl font-bold text-gray-800">All Reports</h2>
                </div>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                  {reports.length} Total
                </span>
              </div>
              <div className="flex-1 overflow-auto">
                <ReportTable
                  reports={reports}
                  visibleCount={visibleCount}
                  onExpand={handleClick}
                  onShowMore={handleShowMore}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showForm && (
          <ResolveForm
            report={report}
            show={showForm}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
}

export default CheckTicket;