import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import AlertModal from './AlertModal';

const AlertBanner = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        if (!user || !user.user_id) return;

        // Connect to WebSocket for real-time alerts
        const wsUrl = `ws://localhost:8000/ws/${user.user_id}`;
        const websocket = new WebSocket(wsUrl);
        const alertTopics = [];

        if ([2, 3, 5].includes(user.status_id)) {
            alertTopics.push('alerts_supervisors');
        }
        if (user.status_id === 5) {
            alertTopics.push('alerts_admin');
        }

        websocket.onopen = async () => {
            console.log('✅ Connected to alert system');
            for (const topic of alertTopics) {
                await fetch('http://localhost:8000/ws/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subscriber_id: user.user_id, topic_id: topic })
                });
                console.log(`✅ Subscribed to alert topic: ${topic}`);
            }
        };

        websocket.onmessage = (event) => {
            const payload = JSON.parse(event.data);
            console.log('🚨 Alert event received:', payload);

            const alert = payload.data ? payload.data : payload;
            const topic = payload.topic;

            if (alert.event === 'system_alert' && alert.severity_id === 3) {
                setAlerts(prev => [...prev, alert]);
            } else if (alert.event === 'alert_resolved') {
                setAlerts(prev => prev.filter(a => a.alert_id !== alert.alert_id));
            } else if (alert.event === 'ack_message') {
                // Show acknowledgment message to supervisors
                setAlerts(prev => [...prev, alert]);
            } else if (topic && ['alerts_admin', 'alerts_supervisors'].includes(topic) && alert.event === 'system_alert') {
                setAlerts(prev => [...prev, alert]);
            }
        };

        websocket.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
        };

        websocket.onclose = () => {
            console.log('🔌 Disconnected from alert system');
        };

        setWs(websocket);

        return () => {
            if (websocket) {
                for (const topic of alertTopics) {
                    fetch('http://localhost:8000/ws/unsubscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ subscriber_id: user.user_id, topic_id: topic })
                    });
                }
                websocket.close();
            }
        };
    }, [user]);

    const handleResolve = async (alertId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/alert/resolve/${alertId}?user_id=${user.user_id}`,
                { method: 'POST' }
            );
            if (response.ok) {
                setAlerts(prev => prev.filter(a => a.alert_id !== alertId));
            } else {
                alert('Failed to resolve alert');
            }
        } catch (error) {
            console.error('Error resolving alert:', error);
        }
    };

    const handleDismiss = async (alertId) => {
        // UI-only dismiss: remove from local state
        // For ack_messages, alertId will be the alert_id from the resolved alert
        setAlerts(prev => prev.filter(a => a.alert_id !== alertId));
    };

    if (alerts.length === 0) return null;

    return (
        <div>
            {alerts
                .filter(alert => alert.severity_id === 3 || alert.event === 'ack_message')
                .map((alert) => (
                    <AlertModal
                        key={alert.event === 'ack_message' ? `ack-${alert.alert_id}-${alert.resolved_by}` : `alert-${alert.alert_id}`}
                        alert={alert}
                        onResolve={handleResolve}
                        onDismiss={handleDismiss}
                    />
            ))}
        </div>
    )
}

export default AlertBanner;
