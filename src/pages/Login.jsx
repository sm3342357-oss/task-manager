// Login.jsx
// Responsabilidad única: layout de la página de login, delega el
// formulario funcional a LoginForm.

import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="auth-page">
      <div className="glass-container auth-card">
        <h1>Bienvenido de nuevo</h1>
        <p className="auth-subtitle">Inicia sesión para gestionar tus tareas</p>
        <LoginForm />
        <p className="auth-footer-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
