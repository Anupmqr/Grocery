
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';

const Navbar = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn'); // Check if the user is logged in
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Clear login state
    navigate('/'); // Redirect to the Home page after logout
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark" aria-label="Fourth navbar example">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">My Shop</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample04"
          aria-controls="navbarsExample04"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample04">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
          </ul>

          {/* Conditional rendering based on login state */}
          {!isLoggedIn ? (
            <>
              <Link to="/Login" className="btn btn-primary ms-2">Login</Link>
              <Link to="/SignUp" className="btn btn-secondary ms-2">Sign Up</Link>
            </>
          ) : (
            <button className="btn btn-danger ms-2" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
