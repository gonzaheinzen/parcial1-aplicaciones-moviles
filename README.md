# Parcial 2 - Aplicaciones Móviles

**Alumno:** Gonzalo Heinzen  
**Materia:** Aplicaciones Móviles  
**Instituto:** Instituto Superior Tecnológico Empresarial Argentino (ISTEA)  

---

## 🎯 Opción Elegida
**Gestor de Tareas (Ampliación del Parcial 1)**

Se extendió el Gestor de Tareas para incorporar el acceso a los recursos de hardware del dispositivo, el manejo del estado global con Zustand, y una suite de tests automatizados utilizando Jest.

---

## 🚀 Cómo ejecutar la app

Este proyecto está construido con **React Native** y **Expo**. Para ejecutarlo localmente:

1. **Requisitos previos**: Tener instalado [Node.js](https://nodejs.org/) y la app **Expo Go** en tu celular.
2. **Clonar el repositorio** y abrir la carpeta del proyecto en la terminal.
3. **Instalar dependencias**:
   ```bash
   npm install --legacy-peer-deps
   ```
4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   ```
5. **Probar en el dispositivo**: 
   - Abrir la app **Expo Go** en tu celular.
   - Escanear el código QR que aparece en la terminal.
   - *(Asegurarse de que tanto la PC como el celular estén conectados a la misma red Wi-Fi)*.

---

## 🧪 Cómo ejecutar los Tests Automatizados

La aplicación cuenta con pruebas unitarias para componentes, lógica de negocio y el store global:

Ejecutar en la terminal:
```bash
npm test
```

Esto correrá los tests creados y mostrará el reporte de cobertura en la consola.

---

## 🛠 Funcionalidades y Requerimientos Técnicos (Parcial 2)

### 1. Estado Global con Zustand
- Se migró el almacenamiento local y la gestión de tareas de la app a un **Store Global** en `src/store/taskStore.js`.
- Se implementó persistencia automática integrada con `AsyncStorage` mediante el middleware `persist` de Zustand.
- Se refactorizaron las pantallas de `Login`, `Registro`, `Home` y `Alta` para interactuar directamente con el Store global mediante selectores/hooks.

### 2. Acceso a Hardware y Recursos del Dispositivo
- **Permisos**: Se implementó la solicitud dinámica y el manejo de los estados de permisos (concedido, denegado, pendiente) mostrando alertas claras si se rechazan.
- **Cámara y Galería (`expo-image-picker`)**: Permite tomar una foto con la cámara del dispositivo o seleccionarla desde la galería para asociarla a una tarea.
- **Ubicación GPS (`expo-location`)**: Permite obtener la ubicación geográfica actual (latitud y longitud) mediante GPS y realiza una geocodificación inversa para obtener la dirección postal aproximada de la tarea.
- **Contactos (`expo-contacts`)**: Permite acceder a la agenda del teléfono mediante un modal, seleccionar un contacto (responsable de la tarea) y asociarlo a la misma.
- **Calendario (`expo-calendar`)**: Permite sincronizar la tarea creando un evento de forma automática en el calendario nativo del teléfono (iOS/Android).

### 3. Visualización y Flujo de Navegación
- Se agregó una nueva pantalla de **Detalle de Tarea** (`TaskDetailScreen.js`) que permite visualizar a pantalla completa la foto adjunta, ver los datos de ubicación (dirección y coordenadas) con un botón para **abrir directamente en Google Maps o Apple Maps**, ver el contacto asociado y la vinculación de calendario.
- Se rediseñó el componente reutilizable `TaskItem` para mostrar pequeñas etiquetas (tags) correspondientes a los recursos adjuntos y permitir navegar a los detalles de la tarea al hacer clic en ella.

### 4. Tests Automatizados (Jest + RNTL)
Se escribieron 3 suites de pruebas que validan los componentes críticos en `src/__tests__/`:
1. **Componente Reutilizable (`TaskItem.test.js`)**: Valida el renderizado correcto del título, la visualización de las etiquetas ("Ubicación", "Contacto") y el llamado asíncrono a la función de eliminación y navegación.
2. **Lógica de Negocio (`helpers.test.js`)**: Valida la lógica pura de la aplicación como el formateador de coordenadas GPS a texto y la validación de extensión del título de la tarea.
3. **Store Global (`taskStore.test.js`)**: Verifica que las acciones del store (`addTask`, `deleteTask`, `registerUser`, `login`, `logout`) actualicen correctamente el estado global de la app.

---

## 🎥 Video DEMO (Parcial 1)
Puedes ver una demostración de la aplicación inicial funcionando en el siguiente enlace:

👉 [VIDEO DEMO PARCIAL 1](https://drive.google.com/file/d/1WsMc3DfdOCWelDvFsje5B9WfDbBFQeh1/view?usp=sharing)
