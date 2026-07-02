// useCloudinaryUpload.js
// Responsabilidad única: subir archivos binarios a Cloudinary usando
// un Upload Preset "unsigned" (Fase 3), reportando progreso de subida
// mediante XMLHttpRequest (fetch no expone eventos de progreso nativos).

import { useState, useCallback } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback((file) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      return Promise.reject(
        new Error(
          "Faltan VITE_CLOUDINARY_CLOUD_NAME o VITE_CLOUDINARY_UPLOAD_PRESET en el .env"
        )
      );
    }

    setUploading(true);
    setUploadProgress(0);

    // FormData binario tal como exige la Fase 3: se envía el archivo
    // crudo junto al upload_preset unsigned (sin firma ni API secret
    // expuestos en el cliente).
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", UPLOAD_URL);

      // Evento de progreso: permite mostrar el porcentaje de subida
      // en tiempo real en TaskForm.jsx.
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          reject(new Error(`Cloudinary respondió con estado ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        reject(new Error("Error de red al subir el archivo a Cloudinary."));
      };

      xhr.send(formData);
    });
  }, []);

  return { uploadFile, uploading, uploadProgress };
}

export default useCloudinaryUpload;
