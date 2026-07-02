// firebaseConfig.js
// Responsabilidad única: inicializar la app de Firebase y exportar
// las instancias de los servicios (Auth y Firestore) que consumirá
// el resto de la aplicación. Ningún otro archivo debe llamar a
// initializeApp() directamente (principio SOLID - SRP).

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Las credenciales se inyectan mediante variables de entorno de Vite.
// Todas deben estar declaradas en un archivo .env en la raíz del
// proyecto y prefijadas con VITE_ para que Vite las exponga al cliente.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validación temprana: si falta alguna variable de entorno, fallamos
// rápido en desarrollo en lugar de obtener errores crípticos de
// Firebase más adelante en tiempo de ejecución.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    "[firebaseConfig] Faltan variables de entorno VITE_FIREBASE_*. Revisa tu archivo .env"
  );
}

// Inicialización única de la app (patrón singleton implícito de Firebase SDK v9+).
const app = initializeApp(firebaseConfig);

// Instancia de autenticación, consumida por AuthContext y los hooks de auth.
export const auth = getAuth(app);

// Instancia de Firestore, consumida por useTasks y cualquier hook de datos.
export const db = getFirestore(app);

// Proveedor de Google preconfigurado, listo para usarse con
// signInWithPopup en la Fase 2 (Configuración del Servicio de Autenticación).
export const googleProvider = new GoogleAuthProvider();

export default app;
