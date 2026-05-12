# Parcial 1 - Aplicaciones Móviles

**Gonzalo Heinzen:**
**Aplicaciones móviles:**
**Instituto Superior Tecnológico Empresarial Argentino**

---

## Opción Elegida
**Gestor de Tareas**

Se desarrolló una aplicación móvil funcional para gestionar tareas, permitiendo a los usuarios agregar elementos con un recordatorio asociado, listarlos y eliminarlos.

---

##  Cómo ejecutar la app

Este proyecto está construido con **React Native** y **Expo**. Para ejecutarlo localmente:

1. **Requisitos previos**: Tener instalado [Node.js](https://nodejs.org/) y la app **Expo Go** en tu celular.
2. **Clonar el repositorio** y abrir la carpeta del proyecto en la terminal.
3. **Instalar dependencias**:
   ```bash
   npm install
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

## 🛠 Funcionalidades Implementadas

La aplicación cumple con todos los requerimientos obligatorios del parcial:

1. **Autenticación (AsyncStorage)**
   - Registro de usuario y contraseña de forma local.
   - Login validando los datos contra lo guardado previamente.
   - Protección de rutas: no se puede acceder al Home sin iniciar sesión.

2. **Navegación (React Navigation)**
   - Implementación de `Stack Navigation` para fluir entre pantallas.
   - 4 pantallas principales: `Login`, `Registro`, `Home`, y `CrearTarea`.

3. **Almacenamiento de Datos (AsyncStorage)**
   - Se guarda persistentemente la lista de tareas.
   - Permite agregar nuevas tareas y eliminar tareas existentes.
   - Los datos se mantienen aunque la aplicación se cierre por completo.

4. **Componentes y Styling**
   - Uso de componentes core (`View`, `Text`, `TextInput`, `TouchableOpacity`, `FlatList`).
   - Desarrollo de un **Componente Reutilizable** personalizado (`<TaskItem />`).
   - Uso de  `StyleSheet`.

5. **Notificaciones Locales (Expo Notifications)**
   - Solicitud de permisos en el sistema operativo.
   - Creación de tareas con temporizador. Al guardar una tarea indicando una cantidad de "segundos", se programa una notificación local que se dispara en el tiempo exacto.

---

## Video DEMO

Puedes ver una demostración de la aplicación funcionando en un dispositivo real en el siguiente enlace:

 [VIDEO DEMO](https://drive.google.com/file/d/1pAoYVBCnchrdB7ONUzf6t4RFQ8ukfSr_/view?usp=sharing)
