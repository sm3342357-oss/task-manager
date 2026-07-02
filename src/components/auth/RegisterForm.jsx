// RegisterForm.jsx
// Responsabilidad única: capturar datos de registro, crear la cuenta
// en Firebase Auth y actualizar el displayName del nuevo usuario.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { translateAuthError, ROUTES } from "../../utils/constants";
import Swal from "sweetalert2";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Las contraseñas no coinciden",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Actualizamos el displayName inmediatamente después de crear
      // la cuenta, para que AuthContext refleje el nombre en el
      // siguiente disparo de onAuthStateChanged.
      await updateProfile(userCredential.user, { displayName: formData.name });

      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo crear la cuenta",
        text: translateAuthError(err.code),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="name">Nombre completo</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu nombre"
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
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
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div className="form-field">
        <label htmlFor="confirmPassword">Confirmar contraseña</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
