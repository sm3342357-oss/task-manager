// useTasks.js
// Responsabilidad única: encapsular toda la lógica de acceso a datos
// de Firestore para la colección "tasks", exponiendo un estado
// reactivo (en tiempo real) y funciones CRUD listas para usar en la UI.
// Ningún componente debe importar Firestore directamente: todo pasa
// por este hook (principio SOLID - SRP / Arquitectura Limpia).

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../services/firebaseConfig";
import { useAuth } from "../context/AuthContext";

// Nombre de la colección centralizado para evitar strings mágicos
// repetidos en distintas partes del código.
const TASKS_COLLECTION = "tasks";

export function useTasks() {
  const { currentUser } = useAuth();

  // tasks: arreglo reactivo sincronizado en tiempo real con Firestore.
  const [tasks, setTasks] = useState([]);

  // loading: true mientras se resuelve la primera lectura del snapshot.
  const [loading, setLoading] = useState(true);

  // error: captura fallos de conexión, permisos, etc., para mostrarlos
  // en la UI sin que el hook lance excepciones no controladas.
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si no hay usuario autenticado, no hay tareas que cargar.
    // Reseteamos el estado y no suscribimos ningún listener.
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Consulta filtrada por el uid del usuario actual (regla de
    // seguridad en Firestore: if request.auth != null y
    // request.auth.uid == resource.data.ownerId), ordenada por
    // fecha de creación descendente para mostrar lo más reciente primero.
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      where("ownerId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    // onSnapshot: listener en tiempo real. Cada vez que se crea,
    // actualiza o elimina un documento (desde este cliente o desde
    // otro dispositivo), este callback se dispara automáticamente
    // y sincroniza el estado local sin necesidad de refetch manual.
    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const fetchedTasks = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setTasks(fetchedTasks);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[useTasks] Error en el listener onSnapshot:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup function: OBLIGATORIA. Cancela la suscripción al
    // desmontar el componente o al cambiar de usuario (currentUser
    // en las dependencias), evitando listeners huérfanos y fugas
    // de memoria, además de escrituras de estado sobre un
    // componente ya desmontado.
    return () => unsubscribe();
  }, [currentUser]);

  // --- CREATE ---
  // Crea una nueva tarea asociada al usuario autenticado.
  const createTask = useCallback(
    async (taskData) => {
      if (!currentUser) {
        throw new Error("No hay usuario autenticado para crear la tarea.");
      }

      const newTask = {
        localId: uuidv4(), // identificador auxiliar útil para claves de UI optimistas
        title: taskData.title ?? "",
        description: taskData.description ?? "",
        status: taskData.status ?? "pending", // pending | in-progress | completed
        priority: taskData.priority ?? "medium", // low | medium | high
        timeSpentSeconds: taskData.timeSpentSeconds ?? 0,
        attachmentUrl: taskData.attachmentUrl ?? null, // URL de Cloudinary, si aplica
        ownerId: currentUser.uid,
        createdAt: serverTimestamp(), // marca de tiempo generada por el servidor
        updatedAt: serverTimestamp(),
      };

      try {
        const docRef = await addDoc(collection(db, TASKS_COLLECTION), newTask);
        return docRef.id;
      } catch (err) {
        console.error("[useTasks] Error al crear tarea:", err);
        throw err;
      }
    },
    [currentUser]
  );

  // --- UPDATE ---
  // Actualiza campos parciales de una tarea existente por su id de Firestore.
  const updateTask = useCallback(async (taskId, updates) => {
    if (!taskId) {
      throw new Error("Se requiere un taskId válido para actualizar.");
    }

    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("[useTasks] Error al actualizar tarea:", err);
      throw err;
    }
  }, []);

  // --- DELETE ---
  // Elimina una tarea de forma permanente por su id de Firestore.
  const deleteTask = useCallback(async (taskId) => {
    if (!taskId) {
      throw new Error("Se requiere un taskId válido para eliminar.");
    }

    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error("[useTasks] Error al eliminar tarea:", err);
      throw err;
    }
  }, []);

  // --- TOGGLE STATUS ---
  // Atajo específico para el flujo de "completar/reabrir" tarea,
  // muy usado desde TaskCard.jsx, evitando repetir lógica de estado
  // en múltiples componentes.
  const toggleTaskStatus = useCallback(
    async (taskId, currentStatus) => {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await updateTask(taskId, { status: newStatus });
    },
    [updateTask]
  );

  // --- TIME TRACKING ---
  // Suma segundos al acumulado de tiempo trabajado en una tarea.
  // Se usa desde TaskTimer.jsx al detener el cronómetro.
  const addTimeToTask = useCallback(
    async (taskId, secondsToAdd) => {
      const task = tasks.find((t) => t.id === taskId);
      const currentSeconds = task?.timeSpentSeconds ?? 0;
      await updateTask(taskId, {
        timeSpentSeconds: currentSeconds + secondsToAdd,
      });
    },
    [tasks, updateTask]
  );

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addTimeToTask,
  };
}

export default useTasks;
