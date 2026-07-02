// ReportExport.jsx
// Responsabilidad única: transformar el arreglo de tareas de Firestore
// en un formato tabular apto para exportación CSV y disparar la
// descarga mediante react-csv. Este componente no conoce Firestore
// ni Firebase: solo recibe "tasks" como prop (Arquitectura Limpia).

import { useMemo } from "react";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import { formatFirestoreTimestamp, secondsToHoursMinutes } from "../../utils/dateHelpers";

// Mapea el status interno (en inglés, usado como valor de Firestore)
// a una etiqueta legible en español para el reporte final.
const STATUS_LABELS = {
  pending: "Pendiente",
  "in-progress": "En progreso",
  completed: "Completada",
};

const PRIORITY_LABELS = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export default function ReportExport({ tasks }) {
  // useMemo: recalcula el dataset del CSV únicamente cuando cambia el
  // arreglo de tareas, evitando reconstruir el mapeo en cada render
  // provocado por otros cambios de estado en Dashboard.jsx.
  const csvData = useMemo(() => {
    return tasks.map((task) => ({
      Titulo: task.title ?? "",
      Descripcion: task.description ?? "",
      Estado: STATUS_LABELS[task.status] ?? task.status,
      Prioridad: PRIORITY_LABELS[task.priority] ?? task.priority,
      "Tiempo invertido": secondsToHoursMinutes(task.timeSpentSeconds),
      "Creada el": formatFirestoreTimestamp(task.createdAt),
      "Actualizada el": formatFirestoreTimestamp(task.updatedAt),
      Adjunto: task.attachmentUrl ?? "Sin adjunto",
    }));
  }, [tasks]);

  // Encabezados explícitos para react-csv: garantizan el orden de
  // columnas independientemente del orden de claves del objeto JS.
  const csvHeaders = [
    { label: "Título", key: "Titulo" },
    { label: "Descripción", key: "Descripcion" },
    { label: "Estado", key: "Estado" },
    { label: "Prioridad", key: "Prioridad" },
    { label: "Tiempo invertido", key: "Tiempo invertido" },
    { label: "Creada el", key: "Creada el" },
    { label: "Actualizada el", key: "Actualizada el" },
    { label: "Adjunto", key: "Adjunto" },
  ];

  // Nombre de archivo dinámico con la fecha actual, evita sobrescribir
  // reportes previos descargados el mismo día por error.
  const fileName = `reporte-tareas-${format(new Date(), "yyyy-MM-dd")}.csv`;

  const isDisabled = tasks.length === 0;

  return (
    <CSVLink
      data={csvData}
      headers={csvHeaders}
      filename={fileName}
      className={`btn-secondary csv-export-btn ${
        isDisabled ? "csv-export-btn-disabled" : ""
      }`}
      target="_blank"
      onClick={() => {
        // CSVLink navega igual con data vacío; bloqueamos el click
        // explícitamente cuando no hay tareas que exportar.
        if (isDisabled) return false;
      }}
    >
      ⬇ Exportar CSV
    </CSVLink>
  );
}
