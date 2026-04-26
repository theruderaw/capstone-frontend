import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';

const AlertModal = ({ alert, onResolve, onDismiss }) => {
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const userStatusId = user?.status_id;
    const isIT = userStatusId === 5;      // IT/Admin can resolve
    const canDismiss = alert.can_remove;  // Derived from server payload

    const getSeverityClasses = (severityId) => {
        const severityMap = {
            1: 'info',
            2: 'warning',
            3: 'critical'
        };
        const severityName = severityMap[severityId] || 'info';

        const baseClasses = {
            'info': 'bg-blue-50 border-blue-500 text-blue-900',
            'warning': 'bg-orange-50 border-orange-500 text-orange-900',
            'critical': 'bg-red-50 border-red-500 text-red-900'
        };
        return baseClasses[severityName];
    };

    const getSeverityName = (severityId) => {
        const severityMap = {
            1: 'Info',
            2: 'Warning',
            3: 'Critical'
        };
        return severityMap[severityId] || 'Unknown';
    };

    const severityClasses = getSeverityClasses(alert.severity_id);

    const handleResolve = async () => {
        if (!isIT) return;
        setIsProcessing(true);
        try {
            await onResolve(alert.alert_id);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDismiss = async () => {
        // Allow dismissing ack_messages even without can_remove permission
        if (!canDismiss && alert.event !== 'ack_message') return;
        setIsProcessing(true);
        try {
            await onDismiss(alert.alert_id);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        // IT users can close the UI without any server check
        onDismiss(alert.alert_id);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className={`border-4 rounded-2xl p-6 max-w-md w-11/12 shadow-2xl ${severityClasses} font-sans`}>
                {/* Header */}
                <div className="mb-4">
                    <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                        {alert.event === 'ack_message' ? 'Acknowledgment' : `${getSeverityName(alert.severity_id)} Alert`}
                    </div>
                    <h2 className="text-xl font-semibold m-0 mb-2">
                        {alert.event === 'ack_message' ? 'Alert Resolution Notice' : `System Alert #${alert.alert_id}`}
                    </h2>
                </div>

                {/* Alert Info */}
                <div className="bg-white bg-opacity-30 p-3 rounded-lg mb-5 text-sm leading-relaxed">
                    {alert.event === 'ack_message' ? (
                        <>Message: {alert.message}</>
                    ) : (
                        <>
                            Worker ID: {alert.worker_id}<br/>
                            Severity: {getSeverityName(alert.severity_id)}
                        </>
                    )}
                </div>

                {/* Role-based Info */}
                <div className="bg-white bg-opacity-20 p-3 rounded-md mb-5 text-xs">
                    {alert.event === 'ack_message' && (
                        <p className="m-0">ℹ️ Acknowledgment message from IT.</p>
                    )}
                    {alert.event !== 'ack_message' && isIT && (
                        <p className="m-0">🔧 As IT/Admin, you can resolve this alert.</p>
                    )}
                    {alert.event !== 'ack_message' && canDismiss && !isIT && (
                        <p className="m-0">👤 As Supervisor's Supervisor, you can dismiss this alert.</p>
                    )}
                    {alert.event !== 'ack_message' && !isIT && !canDismiss && (
                        <p className="m-0">⚠️ You are receiving this alert as Supervisor. Escalate to IT for resolution.</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                    {/* For ack_message events - supervisors can dismiss */}
                    {alert.event === 'ack_message' && (
                        <button
                            onClick={handleDismiss}
                            disabled={isProcessing}
                            className={`bg-blue-500 hover:bg-blue-600 text-white border-none py-2.5 px-5 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${isProcessing ? 'opacity-60' : ''}`}
                        >
                            ✓ OK
                        </button>
                    )}

                    {/* Resolve Button - IT only */}
                    {alert.event !== 'ack_message' && isIT && (
                        <button
                            onClick={handleResolve}
                            disabled={isProcessing}
                            className={`bg-green-500 hover:bg-green-600 text-white border-none py-2.5 px-5 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${isProcessing ? 'opacity-60' : ''}`}
                        >
                            ✓ RESOLVE
                        </button>
                    )}

                    {/* Close Button - IT can dismiss UI without resolving */}
                    {alert.event !== 'ack_message' && isIT && (
                        <button
                            onClick={handleClose}
                            disabled={isProcessing}
                            className={`bg-gray-500 hover:bg-gray-600 text-white border-none py-2.5 px-5 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${isProcessing ? 'opacity-60' : ''}`}
                        >
                            ✕ CLOSE
                        </button>
                    )}

                    {/* Dismiss Button - Only for users with can_remove=true */}
                    {alert.event !== 'ack_message' && canDismiss && !isIT && (
                        <button
                            onClick={handleDismiss}
                            disabled={isProcessing}
                            className={`bg-orange-500 hover:bg-orange-600 text-white border-none py-2.5 px-5 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${isProcessing ? 'opacity-60' : ''}`}
                        >
                            ✕ DISMISS
                        </button>
                    )}

                    {/* Acknowledge Button - For supervisors (view-only) */}
                    {alert.event !== 'ack_message' && !isIT && !canDismiss && (
                        <button
                            className="bg-gray-400 text-white border-none py-2.5 px-5 rounded-md text-sm font-semibold cursor-not-allowed opacity-60"
                            disabled
                        >
                            ACKNOWLEDGED
                        </button>
                    )}
                </div>

                {/* Warning Text */}
                <div className="mt-4 text-xs opacity-60 italic text-center">
                    This modal cannot be closed until action is taken.
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
