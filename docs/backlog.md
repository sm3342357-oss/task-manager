# Fase 0 — Épicas e Historias de Usuario
## Gestor de Tareas Personal con Seguimiento de Tiempo

Cada historia sigue el formato Como [rol], quiero [accion], para [beneficio],
con criterios de aceptacion verificables y el estado actual respecto al
codigo ya implementado.

Leyenda de estado: Implementado / Parcial / Pendiente

---

## Epica 1 - Autenticacion y Gestion de Cuenta

### HU 1.1 - Registro con correo y contrasena
Estado: Implementado (RegisterForm.jsx)

### HU 1.2 - Inicio de sesion con correo y contrasena
Estado: Implementado (LoginForm.jsx)

### HU 1.3 - Inicio de sesion con Google (OAuth)
Estado: Implementado (LoginForm.jsx, firebaseConfig.js)

### HU 1.4 - Persistencia de sesion
Estado: Implementado (AuthContext.jsx)

### HU 1.5 - Cierre de sesion
Estado: Implementado (Dashboard.jsx, PrivateRoute.jsx)

### HU 1.6 - Edicion de perfil
Estado: Implementado (Profile.jsx) - usa Cloudinary, no Firebase Storage

---

## Epica 2 - Gestion de Tareas (CRUD)

### HU 2.1 - Crear tarea
Estado: Implementado (TaskForm.jsx, useTasks.js)

### HU 2.2 - Ver tareas en tiempo real
Estado: Implementado (useTasks.js)

### HU 2.3 - Editar tarea existente
Estado: PENDIENTE - falta el flujo de UI desde TaskCard

### HU 2.4 - Marcar completada / reabrir
Estado: Implementado (TaskCard.jsx, useTasks.js)

### HU 2.5 - Eliminar tarea
Estado: Implementado (TaskCard.jsx, Dashboard.jsx)

### HU 2.6 - Filtrar por estado
Estado: Implementado (Dashboard.jsx)

### HU 2.7 - Adjuntar archivo
Estado: Implementado (TaskForm.jsx, useCloudinaryUpload.js)

---

## Epica 3 - Seguimiento de Tiempo

### HU 3.1 - Cronometro por tarea
Estado: Implementado (TaskTimer.jsx, useTasks.js)

### HU 3.2 - Tiempo total por tarea
Estado: Implementado (TaskCard.jsx)

### HU 3.3 - Resumen general de tiempo
Estado: Implementado (Dashboard.jsx)

### HU 3.4 - Firebase Storage en vez de Cloudinary
Estado: PENDIENTE - decision de arquitectura

---

## Epica 4 - Reportes, PWA y Calidad

### HU 4.1 - Exportar CSV
Estado: Implementado (ReportExport.jsx)

### HU 4.2 - Convertir a PWA
Estado: PENDIENTE

### HU 4.3 - Pruebas unitarias con Jest
Estado: PENDIENTE

---

## Resumen: 16 de 20 historias completas. Pendientes: HU 2.3, HU 3.4, HU 4.2, HU 4.3.
