import { useParams } from "react-router-dom";
import BillingTable from "./BillingTable";

function ReportPage() {
  const { userId } = useParams(); // this grabs :userId from the route

  return (
    <div>
      <h1>User Report</h1>
      <BillingTable
        user_id={localStorage.user_id}           // pass the URL param
        showMoreButton={false}
      />
    </div>
  );
}

export default ReportPage;