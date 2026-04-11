import React from 'react'
import { useAuth } from '../../AuthContext'
import SelfText from './SelfText'
import CardData from './CardData'
import ProjectData from '../Project/ProjectData'
import CheckTicket from '../Reports/CheckTicket'

function Dashboard({ userId = null, self = false, statuscheck = false }) {
  const { user } = useAuth()
  const user_id = userId || user?.user_id

  if (statuscheck) {
    return (
      <div className="flex flex-col h-[90-vh]">
        <SelfText userId={user_id} profile={!self} />
        <div className="h-1/2 min-h-0">
          <CardData userId={user_id} self={self} statuscheck={false} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center overflow-hidden">

      {/* Top section */}
      <div className="min-h-0 flex flex-col items-center overflow-auto">
          <SelfText userId={user_id} profile={Boolean(userId)} />
      </div>
      {/* Bottom section (controlled height) */}
      <div className="flex-1 min-h-0 justify-center">

        {(user.status_id == 2 || user.status_id == 1) && (
          <div className="overflow-auto min-h-0 flex flex-col items-center">
            <CardData userId={user_id} self={true} status_id={user.status_id == 2}/>
          </div>
        )}

        {(user.status_id == 3) && <ProjectData userId={user_id} self={true} />}

        {(user.status_id == 5) && (
          <CheckTicket endpointURL={"http://localhost:8000/report/all?user_id="} />
        )}

      </div>
    </div>
  )
}
export default Dashboard
