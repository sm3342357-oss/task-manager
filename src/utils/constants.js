// constants.js
// Responsabilidad única: centralizar valores constantes usados en
// múltiples archivos, evitando strings/números mágicos dispersos.

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/",
  PROFILE: "/profile",
};

export const AUTH_ERROR_MESSAGES = {
  "auth/invalid-email": "El correo electrónico no es válido.",
  "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
  "auth/user-not-found": "No existe una cuenta con ese correo.",
  "auth/wrong-password": "Contraseña incorrecta.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/popup-closed-by-user": "Se cerró la ventana de autenticación.",
};

// Traduce códigos de error de Firebase Auth a mensajes legibles
// en español, con un fallback genérico.
export function translateAuthError(errorCode) {
  return AUTH_ERROR_MESSAGES[errorCode] || "Ocurrió un error inesperado. Intenta de nuevo.";
}
