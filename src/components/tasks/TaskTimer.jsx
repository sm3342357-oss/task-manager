// TaskTimer.jsx
// Responsabilidad única: manejar un cronómetro local (start/stop) para
// una tarea específica y, al detenerse, reportar los segundos
// transcurridos al componente padre mediante onStop. No escribe en
// Firestore directamente: delega esa acción a TaskCard -> useTasks.

import { useState, useEffect, useRef } from "react";
import { secondsToClock } from "../../utils/dateHelpers";

export default function TaskTimer({ onStop }) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // useRef para el intervalId: evita que el valor del intervalo
  // provoque re-renders innecesarios (a diferencia de guardarlo en state).
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    // Cleanup function: limpia el intervalo tanto al desmontar el
    // componente como al cambiar isRunning a false, evitando timers
    // fantasma corriendo en segundo plano (fuga de memoria clásica).
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);

  const handleStop = () => {
    setIsRunning(false);
    if (elapsedSeconds > 0) {
      onStop(elapsedSeconds);
    }
    setElapsedSeconds(0);
  };

  return (
    <div className="task-timer">
      <span className="task-timer-display">{secondsToClock(elapsedSeconds)}</span>
      {isRunning ? (
        <button
          type="button"
          className="btn-secondary timer-btn"
          onClick={handleStop}
        >
          ⏹ Detener
        </button>
      ) : (
        <button
          type="button"
          className="btn-primary timer-btn"
          onClick={handleStart}
        >
          ▶ Iniciar
        </button>
      )}
    </div>
  );
}
