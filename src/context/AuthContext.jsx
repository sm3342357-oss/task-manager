// AuthContext.jsx
// Responsabilidad única: exponer el estado global de autenticación
// (usuario actual, estado de carga) a toda la aplicación mediante
// Context API, desacoplando la UI de la lógica de Firebase Auth.

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

// Contexto crudo, no se exporta directamente para forzar el uso
// del hook useAuth() y evitar accesos inconsistentes.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // currentUser: objeto de usuario de Firebase o null si no hay sesión.
  const [currentUser, setCurrentUser] = useState(null);

  // loading: evita "parpadeos" de UI (ej. redirigir a /login antes de
  // que Firebase confirme si hay una sesión persistida).
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged es un listener en tiempo real: se dispara
    // en el login inicial, en cada login/logout posterior, y al
    // restaurar la sesión persistida desde el almacenamiento local.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup function: OBLIGATORIA. Sin este return, el listener
    // seguiría activo tras desmontar el AuthProvider, provocando
    // fugas de memoria y posibles actualizaciones de estado sobre
    // un componente ya desmontado (warning de React).
    return () => unsubscribe();
  }, []);

  // Función centralizada de logout para no duplicar lógica de
  // Firebase en cada componente que necesite cerrar sesión.
  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    logout,
  };

  // No renderizamos children hasta resolver el estado inicial de auth,
  // evitando que rutas privadas se rendericen prematuramente.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook de consumo. Lanza un error explícito si se usa fuera del
// AuthProvider, facilitando la depuración temprana.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return context;
}

export default AuthContext;
