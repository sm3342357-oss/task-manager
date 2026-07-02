// App.jsx
// Responsabilidad única: definir el árbol de rutas de la aplicación,
// combinando rutas públicas (login, register) y protegidas
// (dashboard, profile) mediante PrivateRoute, con el Navbar visible
// solo cuando corresponde.

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/layout/PrivateRoute";
import { ROUTES } from "./utils/constants";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route
          path={ROUTES.DASHBOARD}
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.PROFILE}
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Ruta comodín: cualquier URL no reconocida redirige al login. */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}
