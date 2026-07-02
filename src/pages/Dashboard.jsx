// Dashboard.jsx
// Responsabilidad unica: renderizar la vista principal de gestion de
// tareas, consumiendo exclusivamente el hook useTasks para datos y
// logica de negocio. Este componente NO contiene llamadas directas
// a Firestore (Arquitectura Limpia: la UI solo orquesta, no accede a datos).

import { useState, useMemo } from "react";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";
import ReportExport from "../components/tasks/ReportExport";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Swal from "sweetalert2";

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
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addTimeToTask,
  } = useTasks();

  const [activeFilter, setActiveFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") return tasks;
    return tasks.filter((task) => task.status === activeFilter);
  }, [tasks, activeFilter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const totalSeconds = tasks.reduce(
      (acc, t) => acc + (t.timeSpentSeconds ?? 0),
      0
    );
    return { total, completed, totalHours: (totalSeconds / 3600).toFixed(1) };
  }, [tasks]);

  const handleOpenCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        Swal.fire({
          icon: "success",
          title: "Tarea actualizada",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createTask(taskData);
        Swal.fire({
          icon: "success",
          title: "Tarea creada",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      handleCloseForm();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: editingTask ? "No se pudo actualizar la tarea" : "No se pudo crear la tarea",
        text: err.message,
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar esta tarea?",
      text: "Esta accion no se puede deshacer.",
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
      Swal.fire({ icon: "error", title: "Error al cerrar sesion", text: err.message });
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
          Cerrar sesion
        </button>
      </header>

      {error && (
        <div className="glass-container error-banner">
          Ocurrio un error al sincronizar tus tareas: {error}
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
            onClick={isFormOpen ? handleCloseForm : handleOpenCreateForm}
          >
            {isFormOpen ? "Cancelar" : "+ Nueva tarea"}
          </button>
        </div>
      </section>

      {isFormOpen && (
        <section className="glass-container">
          <h2 className="form-section-title">
            {editingTask ? "Editar tarea" : "Nueva tarea"}
          </h2>
          <TaskForm
            key={editingTask?.id ?? "new"}
            initialData={editingTask}
            onSubmit={handleSaveTask}
          />
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
              onEdit={() => handleOpenEditForm(task)}
            />
          ))
        )}
      </section>
    </div>
  );
}
