import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";


function Navbar() {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  if(!user?.user_id) return null;

  const renderLinks = () => {
    console.log(user.status_id)
    switch(Number(user.status_id)) {
      case 1:
        return (
          <>
            <li className="nav-item"><Link className="nav-link active" to="/dashboard">Home</Link></li>
            <li className="nav-item"><Link className="nav-link active" to="/finances/self">Month Report</Link></li>
            <li className="nav-item"><Link className="nav-link active" to="/report/submit">Submit a Report</Link></li>
          </>
        );
      case 2:
        return (
          <>
            <li className='nav-item'><Link className='nav-link active' to="/dashboard">Home</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="/finances/self">Month Report</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="/report/resolve">Check Tickets</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="/project/self">Projects</Link></li>
          </>
        );
      case 3:
        console.log("Here")
        return (
          <>
            <li className='nav-item'><Link className='nav-link active' to="/dashboard">Home</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="/finances/self">Check Payments</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="projects/list">Project Details</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="/project/self">Workers</Link></li>
          </>
        );
      default:
        console.log("There")
        return null;
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">Dashboard</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {renderLinks()}
          </ul>
          <button className='btn btn-outline-light' onClick={() => { logout(); navigate('/'); }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;