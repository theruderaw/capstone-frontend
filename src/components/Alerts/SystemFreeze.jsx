import React from 'react';
import { useAuth } from '../../AuthContext';

const SystemFreeze = () => {
    const { alerts, user } = useAuth();

    // System Freeze only triggers for Supervisors (Role 2)
    const isSupervisor = Number(user.status_id) === 2;
    
    // Check if any active alert is "critical"
    const hasCriticalAlert = alerts.some(a => a.severity_name?.toLowerCase() === 'critical');

    if (!isSupervisor || !hasCriticalAlert) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '20px'
        }}>
            <div style={{
                width: '100px',
                height: '100px',
                background: '#ff4b2b',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                marginBottom: '30px',
                boxShadow: '0 0 50px rgba(255, 75, 43, 0.5)',
                animation: 'pulse 1.5s infinite'
            }}>
                ⚠️
            </div>
            <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', letterSpacing: '4px' }}>SYSTEM FREEZE</h1>
            <p style={{ fontSize: '18px', maxWidth: '600px', opacity: 0.8, lineHeight: '1.6' }}>
                A critical safety alert has been triggered. All standard operations are suspended for your node. 
                Please follow emergency protocols and wait for clearance.
            </p>
            <div style={{ marginTop: '40px', fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '2px' }}>
                Safety Management System Active
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SystemFreeze;
