// Dashboard.jsx
// Responsabilidad única: renderizar la vista principal de gestión de
// tareas, consumiendo exclusivamente el hook useTasks para datos y
// lógica de negocio. Este componente NO contiene llamadas directas
// a Firestore (Arquitectura Limpia: la UI solo orquesta, no accede a datos).

import { useState, useMemo } from "react";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";
import ReportExport from "../components/tasks/ReportExport";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Swal from "sweetalert2";

// Filtros disponibles para la barra de estado, centralizados aquí
// para no repetir strings mágicos en el JSX.
const STATUS_FILTERS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "in-progress", label: "En progreso" },
  { value: "completed", label: "Completadas" },
];

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const {
    tasks,
    loading,
    error,
    createTask,
    deleteTask,
    toggleTaskStatus,
    addTimeToTask,
  } = useTasks();

  // Estado local de UI (no de negocio): controla el filtro activo
  // y la visibilidad del formulario de creación.
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // useMemo evita recalcular el filtrado en cada render si tasks
  // y activeFilter no han cambiado (optimización de rendimiento
  // relevante al usar onSnapshot, que puede disparar renders frecuentes).
  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") return tasks;
    return tasks.filter((task) => task.status === activeFilter);
  }, [tasks, activeFilter]);

  // Métricas rápidas mostradas en las tarjetas superiores del dashboard.
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const totalSeconds = tasks.reduce(
      (acc, t) => acc + (t.timeSpentSeconds ?? 0),
      0
    );
    return { total, completed, totalHours: (totalSeconds / 3600).toFixed(1) };
  }, [tasks]);

  // Handler de creación: delega en useTasks y maneja feedback de UI
  // con sweetalert2, manteniendo el hook libre de dependencias de UI.
  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setIsFormOpen(false);
      Swal.fire({
        icon: "success",
        title: "Tarea creada",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo crear la tarea",
        text: err.message,
      });
    }
  };

  // Handler de borrado con confirmación previa, evitando eliminaciones
  // accidentales desde TaskCard.
  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar esta tarea?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error al eliminar", text: err.message });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al cerrar sesión", text: err.message });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard-page">
      <header className="glass-container dashboard-header">
        <div>
          <h1>Hola, {currentUser?.displayName || currentUser?.email}</h1>
          <p className="dashboard-subtitle">
            {stats.total} tareas · {stats.completed} completadas ·{" "}
            {stats.totalHours} h registradas
          </p>
        </div>
        <button className="btn-secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {error && (
        <div className="glass-container error-banner">
          Ocurrió un error al sincronizar tus tareas: {error}
        </div>
      )}

      <section className="glass-container dashboard-toolbar">
        <div className="filter-group">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`filter-chip ${
                activeFilter === filter.value ? "filter-chip-active" : ""
              }`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="toolbar-actions">
          <ReportExport tasks={tasks} />
          <button
            className="btn-primary"
            onClick={() => setIsFormOpen((prev) => !prev)}
          >
            {isFormOpen ? "Cancelar" : "+ Nueva tarea"}
          </button>
        </div>
      </section>

      {isFormOpen && (
        <section className="glass-container">
          <TaskForm onSubmit={handleCreateTask} />
        </section>
      )}

      <section className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <div className="glass-container empty-state">
            <p>No hay tareas para mostrar en este filtro.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={() => toggleTaskStatus(task.id, task.status)}
              onDelete={() => handleDeleteTask(task.id)}
              onAddTime={(seconds) => addTimeToTask(task.id, seconds)}
            />
          ))
        )}
      </section>
    </div>
  );
}
