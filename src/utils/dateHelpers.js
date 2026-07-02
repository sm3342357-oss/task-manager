// dateHelpers.js
// Responsabilidad única: funciones puras de formateo de fechas y
// duraciones, reutilizadas por ReportExport, TaskCard, etc.
// No depende de React ni de Firestore directamente.

import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// Convierte un Timestamp de Firestore a un string legible dd/MM/yyyy HH:mm.
export function formatFirestoreTimestamp(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") {
    return "Sincronizando...";
  }
  return format(timestamp.toDate(), "dd/MM/yyyy HH:mm", { locale: es });
}

// Texto relativo tipo "hace 3 horas", útil para mostrar en TaskCard
// cuándo fue la última actualización sin exponer la fecha completa.
export function formatRelativeTime(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") {
    return "";
  }
  return formatDistanceToNow(timestamp.toDate(), {
    addSuffix: true,
    locale: es,
  });
}

// Convierte segundos totales en formato "Hh Mm", usado en TaskCard
// y en el reporte CSV.
export function secondsToHoursMinutes(totalSeconds = 0) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// Convierte segundos totales en formato "HH:MM:SS", usado en TaskTimer
// mientras el cronómetro corre.
export function secondsToClock(totalSeconds = 0) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
