# Gestor de Tareas Personal con Seguimiento de Tiempo

Aplicación React + Firebase + Cloudinary para gestionar tareas personales con
cronómetro integrado, adjuntos de archivos y reportes exportables a CSV.

## Stack

- React 18 + Vite
- Cloud Firestore (base de datos en tiempo real)
- Firebase Authentication (Email/Contraseña + Google)
- Cloudinary (subida de archivos vía Upload Preset unsigned)
- styled-components / CSS nativo (Glassmorfismo)
- react-router-dom, date-fns, sweetalert2, uuid, react-csv

## 1. Instalación

```bash
cd task-manager
npm install
```

## 2. Configura tus variables de entorno

Copia el archivo de ejemplo y complétalo con tus propias credenciales:

```bash
cp .env.example .env
```

### Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/) y crea un proyecto.
2. Habilita **Cloud Firestore** en modo de prueba.
3. Habilita **Authentication** → método Correo/Contraseña y Google.
4. En "Configuración del proyecto" copia los valores `apiKey`, `authDomain`,
   `projectId`, `storageBucket`, `messagingSenderId`, `appId` a tu `.env`.
5. Configura las reglas de seguridad de Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerId;
    }
  }
}
```

### Cloudinary

1. Crea una cuenta en [Cloudinary](https://cloudinary.com/).
2. En **Settings → Upload → Upload presets**, crea un preset en modo **Unsigned**.
3. Copia el `Cloud name` y el nombre del preset a tu `.env`.

## 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## 4. Build de producción

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
src/
├── assets/         # Iconos e imágenes estáticas
├── components/     # Componentes reutilizables (auth, layout, tasks, common)
├── context/        # AuthContext (Context API)
├── hooks/          # Custom hooks: useAuth, useTasks, useCloudinaryUpload
├── pages/          # Vistas de ruta: Login, Register, Dashboard, Profile
├── services/       # Configuración de Firebase y Cloudinary
├── styles/         # global.css y glassmorphism.css
└── utils/          # constants.js, dateHelpers.js
```

## Funcionalidades

- Registro/login con correo y contraseña o Google.
- Rutas protegidas mediante `PrivateRoute`.
- CRUD de tareas en tiempo real con `onSnapshot`.
- Cronómetro por tarea que acumula tiempo trabajado.
- Adjuntar archivos a tareas y foto de perfil vía Cloudinary.
- Exportación de tareas a CSV.
- Diseño Glassmorfismo con CSS nativo (`backdrop-filter`).
