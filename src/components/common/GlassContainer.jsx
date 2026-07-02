// GlassContainer.jsx
// Responsabilidad única: envolver contenido con la clase CSS
// ".glass-container" (definida en glassmorphism.css), evitando
// repetir el className manualmente en cada sección del layout.

export default function GlassContainer({ as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag className={`glass-container ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
