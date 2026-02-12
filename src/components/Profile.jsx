import { useParams } from "react-router-dom";
import CardData from "./CardData";

function Profile() {
  const { workerID } = useParams();

  return (
    <div>
      <CardData imageUrl={null} user_id={workerID} />
    </div>
  );
}

export default Profile;