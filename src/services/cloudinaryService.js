// cloudinaryService.js
// Responsabilidad única: exponer constantes y helpers puros
// relacionados con Cloudinary que no dependen de React (a diferencia
// de useCloudinaryUpload.js, que sí maneja estado de subida).

export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

// Valida que las variables de entorno necesarias existan antes de
// intentar cualquier subida, evitando llamadas de red destinadas a fallar.
export function assertCloudinaryConfig() {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Faltan VITE_CLOUDINARY_CLOUD_NAME o VITE_CLOUDINARY_UPLOAD_PRESET en el .env"
    );
  }
}

// Extrae el public_id de una URL segura de Cloudinary, útil si en el
// futuro se necesita borrar o transformar un recurso ya subido.
export function extractPublicIdFromUrl(secureUrl) {
  if (!secureUrl) return null;
  const parts = secureUrl.split("/upload/");
  if (parts.length < 2) return null;
  const afterUpload = parts[1].split("/").slice(1).join("/");
  return afterUpload.replace(/\.[^/.]+$/, "");
}
