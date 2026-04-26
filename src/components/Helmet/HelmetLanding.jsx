import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';

const HelmetLanding = () => {
    const { user } = useAuth();
    const [helmetId, setHelmetId] = useState('');
    const [userIdToAssign, setUserIdToAssign] = useState('');
    const [helmetIdToAssign, setHelmetIdToAssign] = useState('');
    const [workers, setWorkers] = useState([]);
    const [lookupResult, setLookupResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchWorkers = async () => {
        try {
            const res = await fetch(`/user/all/${user.user_id}`);
            const data = await res.json();
            if (res.ok) {
                // filter active users (though backend already filters active=True)
                setWorkers(data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch workers:", err);
        }
    };

    useEffect(() => {
        if (user?.user_id) {
            fetchWorkers();
        }
    }, [user?.user_id]);

    const handleAddHelmet = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('http://127.0.0.1:8000/helmet/add', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.user_id })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Success! New Helmet ID: ${data.data[0].helmet_id}`);
                // Refresh list not needed for new helmet unless we had a helmet list
            } else {
                setMessage(`Error: ${data.detail || 'Failed to add helmet'}`);
            }
        } catch (err) {
            setMessage(`Network Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignHelmet = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('http://127.0.0.1:8000/helmet/assign', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: parseInt(userIdToAssign),
                    helmet_id: parseInt(helmetIdToAssign),
                    admin: { user_id: user.user_id }
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Helmet successfully assigned!');
                fetchWorkers(); // Refresh deployment table
            } else {
                setMessage(`Error: ${data.detail || 'Assignment failed'}`);
            }
        } catch (err) {
            setMessage(`Network Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLookup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLookupResult(null);
        setMessage('');
        try {
            const res = await fetch(`/helmet/${helmetId}`);
            const data = await res.json();
            if (res.ok) {
                const assignedUserId = data.data.user_id;
                const worker = workers.find(w => w.user_id === assignedUserId);
                setLookupResult({
                    ...data.data,
                    worker_name: worker ? worker.name : 'Unknown Worker',
                    working: worker ? worker.working : false,
                    onsite: worker ? worker.onsite : false
                });
            } else {
                setMessage(`Error: ${data.detail || 'Helmet not found'}`);
            }
        } catch (err) {
            setMessage(`Network Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[85vh] w-full flex justify-center bg-gray-50 overflow-hidden">
            <div className="w-full max-w-5xl flex flex-col p-6 md:p-8 h-full">
                <header className="flex-shrink-0 mb-6 flex flex-col md:flex-row md:items-end justify-between border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Helmet Control Center</h1>
                        <p className="text-gray-500 mt-1 text-base font-medium">Monitoring & Deployment Management</p>
                    </div>
                </header>
                
                {message && (
                    <div className={`flex-shrink-0 p-3 mb-6 border-l-4 rounded-r shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
                        message.startsWith('Error') 
                        ? 'bg-red-50 border-red-500 text-red-700' 
                        : 'bg-green-50 border-green-500 text-green-700'
                    }`}>
                        <div className="flex items-center gap-3">
                            <span className="text-lg">{message.startsWith('Error') ? '⚠️' : '✅'}</span>
                            <span className="font-medium text-sm">{message}</span>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Add Helmet Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-black text-white rounded-lg shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Inventory</h2>
                                </div>
                                <p className="text-gray-600 mb-6 text-sm leading-relaxed font-normal">Register a new safety helmet with a unique RFID token.</p>
                            </div>
                            <button 
                                onClick={handleAddHelmet}
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transform active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:scale-100 shadow-lg"
                            >
                                {loading ? 'Processing...' : 'Register New Helmet'}
                            </button>
                        </div>

                        {/* Assign Helmet Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-black text-white rounded-lg shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.803a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.101-1.101" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Worker Deployment</h2>
                            </div>
                            <form onSubmit={handleAssignHelmet} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-700 ml-1 uppercase tracking-widest">Worker User ID</label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g. 102" 
                                        value={userIdToAssign}
                                        onChange={(e) => setUserIdToAssign(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none font-medium text-sm transition-all shadow-inner"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-700 ml-1 uppercase tracking-widest">Helmet ID</label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g. 45" 
                                        value={helmetIdToAssign}
                                        onChange={(e) => setHelmetIdToAssign(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none font-medium text-sm transition-all shadow-inner"
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="md:col-span-2 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 shadow-md mt-2 transition-all active:scale-[0.99] disabled:bg-gray-400"
                                >
                                    {loading ? 'UPDATING ARCHIVES...' : 'COMMIT ASSIGNMENT'}
                                </button>
                            </form>
                        </div>

                        {/* Lookup Helmet Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-black text-white rounded-lg shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Quick Tools</h2>
                                </div>
                                <form onSubmit={handleLookup} className="space-y-4">
                                    <input 
                                        type="number" 
                                        placeholder="Search by Helmet ID..." 
                                        value={helmetId}
                                        onChange={(e) => setHelmetId(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none font-medium text-gray-700 text-sm shadow-inner"
                                        required
                                    />
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full border-2 border-black text-black py-3 rounded-xl font-bold hover:bg-black hover:text-white transition-all disabled:border-gray-200"
                                    >
                                        Track Assignment
                                    </button>
                                </form>
                                {lookupResult && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in zoom-in-95 duration-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-[10px] text-blue-600 uppercase font-bold tracking-widest">Worker Info</p>
                                                <p className="text-lg font-extrabold text-blue-900">{lookupResult.worker_name}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className={`w-3 h-3 rounded-full mt-1 ${lookupResult.working ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                                                {lookupResult.onsite && <span className="text-xs">📍</span>}
                                            </div>
                                        </div>
                                        <p className="text-xs text-blue-800 font-medium">Global ID: #{lookupResult.user_id}</p>
                                    </div>
                                )}
                        </div>

                        {/* Deployment Overview Table */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden flex flex-col max-h-[400px]">
                            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-black text-white rounded-lg shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Deployment Overview</h2>
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Active Workers</span>
                            </div>
                            <div className="flex-1 overflow-auto rounded-xl border border-gray-50">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-3 font-bold text-gray-700">Worker</th>
                                            <th className="px-4 py-3 font-bold text-gray-700">ID</th>
                                            <th className="px-4 py-3 font-bold text-gray-700">Helmet</th>
                                            <th className="px-4 py-3 font-bold text-gray-700 text-center">Work</th>
                                            <th className="px-4 py-3 font-bold text-gray-700 text-center">Site</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {workers.map((worker) => (
                                            <tr key={worker.user_id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-semibold text-gray-800">{worker.name}</td>
                                                <td className="px-4 py-3 text-gray-500 font-mono text-xs">#{worker.user_id}</td>
                                                <td className="px-4 py-3">
                                                    {worker.helmet_id ? (
                                                        <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">HEL-{worker.helmet_id}</span>
                                                    ) : (
                                                        <span className="text-gray-300 italic text-[10px]">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        <div className={`w-3 h-3 rounded-full ${worker.working ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center text-base">
                                                        {worker.onsite ? '📍' : ''}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelmetLanding;
