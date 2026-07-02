// TaskForm.jsx
// Responsabilidad única: capturar y validar los datos de entrada de
// una nueva tarea (o edición futura) y delegar el envío al callback
// onSubmit recibido por props. No conoce Firestore ni useTasks
// directamente (Arquitectura Limpia: UI desacoplada de la persistencia).

import { useState } from "react";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";

const INITIAL_STATE = {
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
};

export default function TaskForm({ onSubmit, initialData = null }) {
  // Si initialData existe, el formulario funciona en modo edición;
  // si no, arranca con los valores por defecto de una tarea nueva.
  const [formData, setFormData] = useState(initialData ?? INITIAL_STATE);

  // Estado de validación local: mensajes de error por campo.
  const [errors, setErrors] = useState({});

  // Hook desacoplado para la subida de archivos a Cloudinary
  // (Fase 3): expone el progreso y la URL resultante sin que este
  // componente sepa nada sobre FormData ni la API REST de Cloudinary.
  const { uploadFile, uploading, uploadProgress } = useCloudinaryUpload();

  const [attachmentUrl, setAttachmentUrl] = useState(
    initialData?.attachmentUrl ?? null
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiamos el error del campo en cuanto el usuario vuelve a escribir.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      setAttachmentUrl(url);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        attachment: "No se pudo subir el archivo. Intenta de nuevo.",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio.";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      attachmentUrl,
    });

    // Reseteamos el formulario solo si es creación (sin initialData),
    // dejando la edición con los valores tal como quedaron.
    if (!initialData) {
      setFormData(INITIAL_STATE);
      setAttachmentUrl(null);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej. Preparar presentación de cierre"
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Detalles opcionales de la tarea..."
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="priority">Prioridad</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pendiente</option>
            <option value="in-progress">En progreso</option>
            <option value="completed">Completada</option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="attachment">Adjunto (opcional)</label>
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && (
          <span className="form-hint">Subiendo... {uploadProgress}%</span>
        )}
        {attachmentUrl && !uploading && (
          <span className="form-hint">Archivo adjuntado correctamente ✓</span>
        )}
        {errors.attachment && (
          <span className="form-error">{errors.attachment}</span>
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={uploading}>
        {initialData ? "Guardar cambios" : "Crear tarea"}
      </button>
    </form>
  );
}
