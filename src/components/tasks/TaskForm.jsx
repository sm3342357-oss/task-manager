// TaskForm.jsx
// Responsabilidad unica: capturar y validar los datos de entrada de
// una tarea (creacion o edicion) y delegar el envio al callback
// onSubmit recibido por props. No conoce Firestore ni useTasks
// directamente. El Dashboard decide si onSubmit crea o actualiza.

import { useState } from "react";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";

const INITIAL_STATE = {
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
};

export default function TaskForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(initialData ?? INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const { uploadFile, uploading, uploadProgress } = useCloudinaryUpload();
  const [attachmentUrl, setAttachmentUrl] = useState(
    initialData?.attachmentUrl ?? null
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      newErrors.title = "El titulo es obligatorio.";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "El titulo debe tener al menos 3 caracteres.";
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

    if (!initialData) {
      setFormData(INITIAL_STATE);
      setAttachmentUrl(null);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="title">Titulo</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej. Preparar presentacion de cierre"
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="description">Descripcion</label>
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
