// Navbar.jsx
// Responsabilidad única: navegación superior entre Dashboard y Perfil,
// visible solo cuando hay un usuario autenticado.

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";

export default function Navbar() {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  return (
    <nav className="app-navbar">
      <Link to={ROUTES.DASHBOARD} className="navbar-brand">
        📋 Gestor de Tareas
      </Link>
      <div className="navbar-links">
        <Link
          to={ROUTES.DASHBOARD}
          className={location.pathname === ROUTES.DASHBOARD ? "navbar-link-active" : ""}
        >
          Dashboard
        </Link>
        <Link
          to={ROUTES.PROFILE}
          className={location.pathname === ROUTES.PROFILE ? "navbar-link-active" : ""}
        >
          {currentUser?.displayName || "Perfil"}
        </Link>
      </div>
    </nav>
  );
}
