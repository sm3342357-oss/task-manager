// Profile.jsx
// Responsabilidad única: mostrar y permitir editar los datos básicos
// del usuario autenticado (nombre, foto de perfil vía Cloudinary).

import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useCloudinaryUpload } from "../hooks/useCloudinaryUpload";
import Swal from "sweetalert2";

export default function Profile() {
  const { currentUser } = useAuth();
  const { uploadFile, uploading, uploadProgress } = useCloudinaryUpload();
  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? "");

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const photoURL = await uploadFile(file);
      await updateProfile(currentUser, { photoURL });
      Swal.fire({ icon: "success", title: "Foto de perfil actualizada" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al subir la foto", text: err.message });
    }
  };

  const handleNameSave = async () => {
    try {
      await updateProfile(currentUser, { displayName });
      Swal.fire({ icon: "success", title: "Nombre actualizado" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al actualizar el nombre", text: err.message });
    }
  };

  return (
    <div className="dashboard-page">
      <div className="glass-container auth-card">
        <h1>Mi perfil</h1>

        {currentUser?.photoURL && (
          <img
            src={currentUser.photoURL}
            alt="Foto de perfil"
            className="profile-avatar"
          />
        )}

        <div className="form-field">
          <label htmlFor="avatar">Cambiar foto de perfil</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={uploading}
          />
          {uploading && <span className="form-hint">Subiendo... {uploadProgress}%</span>}
        </div>

        <div className="form-field">
          <label htmlFor="displayName">Nombre</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={handleNameSave}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
