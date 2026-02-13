import { useParams } from "react-router-dom";
import WorkerDashboard from "./WorkerDashboard";

function Profile() {
  const { workerID } = useParams();
  console.log(workerID)
  return (
    <div>
      <WorkerDashboard workerId = {workerID} fromsupervisor={true}/>
    </div>
  );
}

export default Profile;