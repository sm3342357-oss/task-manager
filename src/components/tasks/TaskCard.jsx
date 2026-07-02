// TaskCard.jsx
// Responsabilidad unica: representar visualmente una tarea individual
// y traducir las interacciones del usuario (click, timer) en llamadas
// a los callbacks recibidos por props. No importa useTasks ni Firestore.

import TaskTimer from "./TaskTimer";
import { secondsToHoursMinutes } from "../../utils/dateHelpers";

const PRIORITY_COLORS = {
  low: "#4ade80",
  medium: "#facc15",
  high: "#f87171",
};

const STATUS_LABELS = {
  pending: "Pendiente",
  "in-progress": "En progreso",
  completed: "Completada",
};

export default function TaskCard({ task, onToggleStatus, onDelete, onAddTime, onEdit }) {
  const isCompleted = task.status === "completed";

  return (
    <article className={`glass-container task-card ${isCompleted ? "task-card-completed" : ""}`}>
      <header className="task-card-header">
        <span
          className="priority-dot"
          style={{ backgroundColor: PRIORITY_COLORS[task.priority] ?? "#ccc" }}
          title={`Prioridad: ${task.priority}`}
        />
        <h3 className="task-card-title">{task.title}</h3>
      </header>

      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      {task.attachmentUrl && (
        
          href={task.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="task-card-attachment"
        >
          📎 Ver adjunto
        </a>
      )}

      <div className="task-card-meta">
        <span className="task-status-badge">{STATUS_LABELS[task.status]}</span>
        <span className="task-time-spent">
          ⏱ {secondsToHoursMinutes(task.timeSpentSeconds)}
        </span>
      </div>

      <TaskTimer onStop={onAddTime} />

      <footer className="task-card-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onEdit}
        >
          ✏ Editar
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onToggleStatus}
        >
          {isCompleted ? "Reabrir" : "Completar"}
        </button>
        <button
          type="button"
          className="btn-danger"
          onClick={onDelete}
        >
          Eliminar
        </button>
      </footer>
    </article>
  );
}
