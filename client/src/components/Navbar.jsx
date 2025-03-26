import { NavLink, useNavigate } from "react-router";
import Logo from "../assets/logo.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");

  function handleLogout() {
    window.Swal.fire({
      title: "Are you sure you want to logout?",
      text: "You can't manage your recipes if you logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("access_token");
        return navigate("/login");
      }
    });
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <span className="navbar-brand d-flex align-items-center py-0">
          <img
            src={Logo}
            alt="Logo"
            style={{ height: "2rem", marginRight: "5px" }}
          />
          <span className="fw-bold text-red">Resep</span><span className="text-white">edia</span>
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            {!access_token ? (
              ""
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/my-recipes" className="nav-link">
                    My Recipes
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {access_token ? (
                <button onClick={handleLogout} className="nav-link">
                  Logout
                </button>
              ) : (
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
