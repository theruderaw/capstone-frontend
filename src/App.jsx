import { Navigate, BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Common/Navbar";
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import BillingTable from "./components/Common/BillingTable";
import SubmitReport from "./components/Reports/SubmitReport";
import CheckTicket from "./components/Reports/CheckTicket";
import Project from "./components/Project/Project";
import { useAuth } from "./AuthContext";
import DashboardWrapper from "./components/Wrappers/DashboardWrapper";
import BillingTableWrapper from "./components/Wrappers/BillingTableWrapper";

function App() {
    const {user} = useAuth()
  return (
    <Router>
        <Navbar/>
        <Routes>
            <Route path = "/" element = {<Landing/>}/>
            <Route
                path = "/dashboard" 
                element = {
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>}/>
            <Route 
                path = "/finances/self"
                element = {
                    <ProtectedRoute>
                        <BillingTable dashboard={false} userId={user.user_id} self={true}/>
                    </ProtectedRoute>}/>
            <Route 
                path = "/report/submit"
                element = {
                    <ProtectedRoute>
                        <SubmitReport/>
                    </ProtectedRoute>}/>
            <Route
                path="/report/resolve"
                element = {
                    <ProtectedRoute>
                        <CheckTicket/>
                    </ProtectedRoute>
                }/>
            <Route
                path="/project/self"
                element = {
                    <ProtectedRoute>
                        <Project/>
                    </ProtectedRoute>
                }/>
            <Route 
                path="/profile/:userId" 
                element={
                    <ProtectedRoute>
                        <DashboardWrapper/>
                    </ProtectedRoute>} />
            <Route 
                path="/summary/:userId" 
                element={
                    <ProtectedRoute>
                        <BillingTableWrapper dashboard={false}/>
                    </ProtectedRoute>
                } />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>    
    </Router>
  )
}

export default App
