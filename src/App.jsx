import { Navigate, BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Common/Navbar";
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import BillingTable from "./components/Common/BillingTable";
import SubmitReport from "./components/Reports/SubmitReport";
import CheckTicket from "./components/Reports/CheckTicket";
import Project from "./components/Project/Project";
import ProjectData from "./components/Project/ProjectData";
import { useAuth } from "./AuthContext";
import DashboardWrapper from "./components/Wrappers/DashboardWrapper";
import BillingTableWrapper from "./components/Wrappers/BillingTableWrapper";
import UserTable from "./components/Users/UserTable";
import AuthorisePaymentModal from "./components/Common/AuthorisePaymentModal";
import HelmetLanding from "./components/Helmet/HelmetLanding";
import AlertBanner from "./components/Alerts/AlertBanner";
import SystemFreeze from "./components/Alerts/SystemFreeze";
function App() {
    const { user } = useAuth();

    return (
        <Router>
            <div className="h-[10vh] fixed top-0 left-0 w-full z-50">
            <Navbar />
        </div>
        <AlertBanner />
        <SystemFreeze />
        <div className="pt-[10vh] h-screen w-screen overflow-hidden">
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
                            <CheckTicket endpointURL = {"/report?user_id="}/>
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
                <Route
                    path="projects/list"
                    element={
                        <ProtectedRoute>
                            <ProjectData/>
                        </ProtectedRoute>
                    }/>
                <Route
                    path="/users/"
                    element = {
                        <ProtectedRoute><UserTable userId = {user.user_id}/></ProtectedRoute>
                    }
                />
                <Route
                    path="/payments/authorise"
                    element = {
                        <ProtectedRoute>
                            <AuthorisePaymentModal userId={user.user_id}/>
                        </ProtectedRoute>
                    }
                ></Route>
                <Route
                    path="/helmets"
                    element={
                        <ProtectedRoute>
                            <HelmetLanding />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>    
        </div>  
        </Router>
  )
}

export default App
