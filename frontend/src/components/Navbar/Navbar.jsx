import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <h2>Purple Merit Technologies</h2>
          </Link>
        </div>

        <div className="navbar-menu">
          <div className="navbar-links">
            {isAdmin() && (
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            )}
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user.fullName}</span>
              <span className={`user-role badge-${user.role}`}>
                {user.role}
              </span>
            </div>
            <Button variant="outline" onClick={handleLogout} className="logout-btn">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
