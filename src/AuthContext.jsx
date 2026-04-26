import { createContext, useContext, useState, useEffect, useRef } from "react";

// -----------------------------------------------------------------
// Auth Context – holds authentication info and optional WS handling
// -----------------------------------------------------------------
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // -------------------
  // 1️⃣  User state
  // -------------------
  const [user, setUserState] = useState({
    user_id: null,
    status_id: null,
    currentWorkerId: null,
    project_id: null,
  });

  const setUser = (key, value) => {
    setUserState((prev) => ({ ...prev, [key]: value }));
  };

  const logout = () => {
    setUserState({
      user_id: null,
      status_id: null,
      currentWorkerId: null,
      project_id: null,
    });
    // Ensure any open socket is closed on logout
    disconnectSocket();
    setAlerts([]);
  };

  // -------------------
  // 2️⃣  Alert state
  // -------------------
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    console.log("🔔 Alerts state updated:", alerts);
  }, [alerts]);

  // -------------------
  // 2️⃣  WebSocket handling (voluntary & RBAC‑aware)
  // -------------------
  const [ws, setWs] = useState(null);
  const allowedRoles = [2, 3, 5]; // Supervisor, Manager, Root

  const connectSocket = () => {
    if (!user.status_id) {
      console.warn("User status unknown – cannot decide WS eligibility");
      return;
    }
    if (!allowedRoles.includes(Number(user.status_id))) {
      console.warn("User role does not permit WebSocket connection");
      return;
    }
    if (ws) {
      console.info("WebSocket already connected");
      return;
    }
    const wsUrl = (typeof process !== 'undefined' && process.env?.REACT_APP_WS_URL) 
                  || import.meta.env?.VITE_WS_URL 
                  || "ws://localhost:8000";
    
    const socket = new WebSocket(`${wsUrl}/ws/${user.user_id}`);
    socket.onopen = () => console.info("🔗 WS connected");
    socket.onclose = () => console.info("❌ WS closed");
    socket.onerror = (e) => console.error("WS error", e);
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      const data = payload.data;
      console.log("📥 WS Received:", payload);
      
      // Handle both direct messages and topic-wrapped messages
      const alertData = data || payload; // Use data if wrapped, otherwise payload directly
      
      if (payload.topic === "global" || alertData.event === "system_alert") {
        if (alertData.event === "system_alert") {
          console.log("🚨 New Alert:", alertData);
          setAlerts((prev) => [...prev, alertData]);
        } else if (alertData.event === "alert_resolved") {
          console.log("✅ Alert Resolved:", alertData);
          setAlerts((prev) => prev.filter((a) => a.alert_id !== alertData.alert_id));
        }
      }

      // Forward raw data to any consumer via a custom event
      const custom = new CustomEvent("ws-message", { detail: payload });
      window.dispatchEvent(custom);
    };
    setWs(socket);
  };

  const disconnectSocket = () => {
    if (ws) {
      ws.close();
      setWs(null);
    }
  };

  // -----------------------------------------------------------------
  // Auto-connect socket when user logs in with allowed role
  // -----------------------------------------------------------------
  useEffect(() => {
    if (user.user_id && user.status_id && allowedRoles.includes(user.status_id)) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [user.user_id, user.status_id]);

  // Clean up on unmount
  useEffect(() => {
    return () => disconnectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------
  // Provide everything needed by child components
  // -----------------------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        ws,
        connectSocket,
        disconnectSocket,
        alerts,
        setAlerts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const WebSocketConnector = () => {
  const { ws, connectSocket, disconnectSocket } = useAuth();
  return (
    <button onClick={() => (ws ? disconnectSocket() : connectSocket())}>
      {ws ? "Disconnect WebSocket" : "Connect WebSocket"}
    </button>
  );
};