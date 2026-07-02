// LoginForm.jsx
// Responsabilidad única: capturar credenciales de login y delegar
// la autenticación a Firebase Auth mediante llamadas directas al
// servicio de auth (no requiere un hook adicional por su simplicidad,
// a diferencia de useTasks que maneja estado en tiempo real complejo).

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../services/firebaseConfig";
import { translateAuthError, ROUTES } from "../../utils/constants";
import Swal from "sweetalert2";

export default function LoginForm() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo iniciar sesión",
        text: translateAuthError(err.code),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo iniciar sesión con Google",
        text: translateAuthError(err.code),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleEmailLogin} noValidate>
      <div className="form-field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={credentials.email}
          onChange={handleChange}
          placeholder="tucorreo@ejemplo.com"
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          value={credentials.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <div className="auth-divider">o</div>

      <button
        type="button"
        className="btn-secondary btn-google"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
      >
        Continuar con Google
      </button>
    </form>
  );
}
