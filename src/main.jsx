// main.jsx
// Punto de entrada de la aplicación. Responsabilidad única:
// montar el árbol de React en el DOM e inyectar los providers
// globales (AuthProvider, Router) que envuelven toda la app.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./styles/global.css";
import "./styles/glassmorphism.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter debe envolver a AuthProvider si App usa hooks
        de router (useNavigate) dentro de la lógica de autenticación */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
