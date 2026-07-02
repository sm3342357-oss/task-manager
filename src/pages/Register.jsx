// Register.jsx
// Responsabilidad única: layout de la página de registro, delega el
// formulario funcional a RegisterForm.

import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="auth-page">
      <div className="glass-container auth-card">
        <h1>Crea tu cuenta</h1>
        <p className="auth-subtitle">Empieza a organizar tu tiempo hoy mismo</p>
        <RegisterForm />
        <p className="auth-footer-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
