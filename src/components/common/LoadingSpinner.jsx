// LoadingSpinner.jsx
// Responsabilidad única: indicador visual de carga reutilizable,
// sin ninguna dependencia de lógica de negocio.

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="loading-spinner-wrapper">
      <div className="loading-spinner" role="status" aria-live="polite" />
      <p className="loading-spinner-text">{message}</p>
    </div>
  );
}
