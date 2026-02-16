import { useParams } from "react-router-dom";
import BillingTable from "../Common/BillingTable";

function BillingTableWrapper({ dashboard,}) {
  const { userId } = useParams(); // <-- gets the :userId from URL
  return <BillingTable dashboard={dashboard} userId={userId} self={false} />;
}

export default BillingTableWrapper