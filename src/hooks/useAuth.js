// useAuth.js
// Responsabilidad única: reexportar el hook useAuth definido en
// AuthContext.jsx, para que todos los hooks de la carpeta /hooks
// puedan importarse desde un mismo lugar consistente (src/hooks/*).
// Evita que algunos componentes importen desde /context y otros
// desde /hooks para el mismo concepto.

export { useAuth, default as AuthContext } from "../context/AuthContext";
