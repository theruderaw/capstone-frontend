import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../AuthContext'
import SelfText from './SelfText'
import CardData from './CardData'
import ProjectData from '../Project/ProjectData'
import CheckTicket from '../Reports/CheckTicket'
import SearchUserBar from '../Common/SearchUserBar'

function Dashboard({ userId = null, self = false, statuscheck = false }) {
  const { user } = useAuth()
  const user_id = userId || user?.user_id
  const socketRef = useRef(null)
  const [workingStatus, setWorkingStatus] = useState(false)
  const [onsiteStatus, setOnsiteStatus] = useState(false)

  // Fetch initial status
  useEffect(() => {
    if (!user_id) return;
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/info?user_id=${user_id}`);
        if (res.ok) {
          const data = await res.json();
          setWorkingStatus(data.data.working);
          setOnsiteStatus(data.data.onsite);
        }
      } catch (e) {
        console.error("Failed to fetch initial status", e);
      }
    };
    fetchStatus();
  }, [user_id]);

  useEffect(() => {
    // Only proceed if we have a target user_id and a logged-in user
    if (user_id && user.user_id) {
      // 1. Establish WebSocket connection for the current session
      const socket = new WebSocket(`ws://${window.location.host}/ws/${user.user_id}`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log(`[WebSocket] Connected. Subscribing User ${user.user_id} to Topic ${user_id}`);
        // 2. Once connected, subscribe to the specific user_id topic
        fetch('/ws/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            subscriber_id: user.user_id, 
            topic_id: user_id 
          })
        });
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Only process topic-wrapped messages for status updates
          if (data && typeof data === 'object' && data.topic && data.data) {
            console.log(`[WebSocket] Processing topic ${data.topic}:`, data.data);
            if (String(data.topic) === String(user_id)) {
              if (data.data.event === "status_change") {
                console.log(`[WebSocket] Status change: ${data.data.status}`);
                setWorkingStatus(data.data.status === "working");
              } else if (data.data.event === "location_change") {
                console.log(`[WebSocket] Location change: ${data.data.location}`);
                setOnsiteStatus(data.data.location === "onsite");
              }
            }
          } else {
            // Ignore direct messages (like alerts) or malformed messages
            console.log(`[WebSocket] Ignoring message:`, data);
          }
        } catch (e) {
          console.error("[WebSocket] Failed to parse message:", event.data, e);
        }
      };

      // 3. Cleanup: Unsubscribe and close socket when leaving the dashboard
      return () => {
        console.log(`[WebSocket] Unsubscribing User ${user.user_id} from Topic ${user_id}`);
        fetch('/ws/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            subscriber_id: user.user_id, 
            topic_id: user_id 
          })
        });

        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
        socketRef.current = null;
      };
    }
  }, [user_id, user.user_id]);

  if (statuscheck) {
    return (
      <div className="flex flex-col h-[90-vh]">
        <SelfText userId={user_id} profile={!self} workingStatus={workingStatus} onsiteStatus={onsiteStatus} />
        <div className="h-1/2 min-h-0">
          <CardData userId={user_id} self={self} statuscheck={false} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">

      {/* Top section */}
      <div className="flex-none min-h-0 w-full flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-5xl px-4">
          <SelfText userId={user_id} profile={Boolean(userId)} workingStatus={workingStatus} onsiteStatus={onsiteStatus} />
        </div>
      </div>

      {/* Bottom section (controlled height) */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        {(user.status_id == 2 || user.status_id == 1) && (
          <div className="w-full h-full min-h-0 overflow-hidden flex flex-col items-center">
            <div className="w-full max-w-6xl h-full min-h-0 px-4">
              <CardData userId={user_id} self={true} status_id={user.status_id == 2} />
            </div>
          </div>
        )}

        {(user.status_id == 3) && (
          <div className="w-full h-full min-h-0 overflow-hidden flex flex-col items-center">
            <ProjectData userId={user_id} self={true} />
          </div>
        )}

        {(user.status_id == 5) && (
          <div className="flex flex-col gap-6 items-center w-full px-4 h-full min-h-0 overflow-auto">
            <SearchUserBar userId={user_id} />
          </div>
        )}
      </div>
    </div>
  )
}
export default Dashboard
