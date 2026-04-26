import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";


function Navbar() {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  if(!user?.user_id) return null;

  const renderLinks = () => {
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
        return (
          <>
            <li className='nav-item'><Link className='nav-link active' to="/dashboard">Home</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="/payments/authorise">Check Payments</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="projects/list">Project Details</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="/project/self">Workers</Link></li>
          </>
        );
      case 5:
        return (
          <>  
            <li className='nav-item'><Link className='nav-link active' to="/dashboard">Home</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="/users">View Users</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="/helmets">Helmets</Link></li>
            <li className='nav-item'><Link className='nav-link active' to="/project/self">Workers</Link></li>
          </>
        )
      default:
        return null;
    }
  }

  return (
  <nav className="fixed overflow-auto top-0 left-0 w-full h-[10vh] z-50 flex items-center bg-black text-white">
    <div className="w-full flex justify-between items-center px-6">

      <Link className="text-xl font-semibold" to="/dashboard">
        Dashboard
      </Link>

      <ul className="flex gap-6 items-center">
        {renderLinks()}
      </ul>

      <button
        className="border border-white px-4 py-1 rounded hover:bg-white hover:text-black transition"
        onClick={() => { logout(); navigate('/'); }}
      >
        Logout
      </button>

    </div>
  </nav>
  );
}

export default Navbar;