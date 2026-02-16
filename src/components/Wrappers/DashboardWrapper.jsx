import React from "react";
import { useParams } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

function DashboardWrapper() {
  const { userId } = useParams(); // get userId from URL
  return <Dashboard userId={userId} statuscheck={true}/>;
}

export default DashboardWrapper;