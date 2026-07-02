// PrivateRoute.jsx
// Responsabilidad única: proteger rutas que requieren sesión activa,
// redirigiendo a /login si no hay usuario autenticado. Consume
// exclusivamente useAuth, sin lógica de Firebase propia.

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
