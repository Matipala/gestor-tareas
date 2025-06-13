# Gestor de Tareas Fullstack

## Tecnologías usadas

* **Frontend**: React, Vite, React Router, Tailwind CSS
* **Autenticación y Base de Datos**: Supabase (PostgreSQL + Auth)
* **Patrón de Diseño**: Singleton para cliente Supabase, Module para contexto de Auth

## Cómo ejecutar el proyecto y las pruebas

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/matipala/gestor-tareas.git
   cd gestor-tareas
   ```
2. Instalar dependencias:

   ```bash
   npm install
   ```
3. Configurar variables de entorno en `.env`:

   ```env
   VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
   VITE_SUPABASE_ANON_KEY=<tu-anon-key>
   ```
4. Levantar la aplicación en modo desarrollo:

   ```bash
   npm run dev
   ```
5. Abrir en el navegador `http://localhost:5173`


## Explicación del patrón de diseño aplicado

Se utilizó el **Singleton** para crear una única instancia del cliente de Supabase (`supabase-Client.js`).
Esto garantiza que en toda la app se comparta la misma conexión y configuración, evitando múltiples inicializaciones y facilitando cambios centralizados.
Además, la lógica de autenticación se encapsula en un **Module Pattern** mediante el `AuthContext`, reduciendo el acoplamiento y haciendo la lógica reutilizable.

## Estructura del proyecto

```
├── public/
├── src/
│   ├── components/
│   │   ├── TaskManager.jsx
│   │   ├── CategoryManager.jsx
│   │   └── Navbar.jsx
│   │   └── Register.jsx
│   │   └── Login.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── supabase-Client.js
│   ├── App.jsx
│   ├── Main.jsx
│   └── index.css
├── .env
├── .env.example
├── vite.config.js
├── package.json
└── README.md
```

## Descripción del problema que resuelve la aplicación

Crear y organizar tareas personales en:

* Múltiples categorías para agrupar tareas.
* Estado de cada tarea (por categoria).
* Acceso privado para cada usuario.

## Solución planteada

Una SPA en React con Vite y Tailwind, utilizando Supabase para:

* **Autenticación** de usuarios con sesión persistente.
* **CRUD** de tareas y categorías enlazadas a cada usuario.
* **Contexto** de Auth para control de rutas privadas.

## Historias de usuario

## HU-01: Registro y acceso de usuario
Como usuario sin cuenta
Quiero poder registrarme con email y contraseña, y luego hacer login
Para acceder de forma segura a mi panel de tareas

Criterios de aceptación

Dado que no tengo cuenta, cuando relleno email y contraseña válidos en el formulario de registro y envío, entonces se crea mi cuenta en Supabase y redirige al login.

Dado que ya tengo cuenta, cuando relleno email y contraseña correctos en el formulario de login y envío, entonces se inicia sesión, se persiste la sesión y redirige al Dashboard.

Dado que envío credenciales inválidas, cuando hago login, entonces muestro un mensaje de error y no redirijo.


## HU-02: Gestión de categorías
Como usuario autenticado
Quiero crear, editar y eliminar categorías
Para agrupar mis tareas según su tipo o prioridad

Criterios de aceptación

Dado que estoy autenticado, cuando escribo un nombre en “Nueva categoría” y pulso “Añadir”, entonces la categoría aparece inmediatamente en el listado con recargar la pagina

Dado que existe una categoría, cuando pulso “Editar”, modifico su nombre y pulso “Guardar”, entonces el cambio se refleja en la UI y en la base de datos.

Dado que existe una categoría, cuando pulso “Eliminar” junto a ella, entonces desaparece del listado y se borra de la base de datos.


## HU-03: CRUD y marcación de tareas
Como usuario autenticado
Quiero crear, editar, eliminar y marcar tareas como completadas

Criterios de aceptación

Dado que estoy en el Dashboard, cuando relleno título, descripción, fecha y categoría en “Crear nueva tarea” y pulso “Añadir Tarea”, entonces la tarea aparece en el tablero con recargar la pagina.

Dado que existe una tarea, cuando pulso “Editar”, modifico alguno de sus campos y pulso “Guardar”, entonces se actualiza la tarea en la UI y en la base de datos.

Dado que existe una tarea, cuando pulso “Eliminar” en su tarjeta, entonces desaparece inmediatamente del tablero y se borra de la base de datos.

Dado que existe una tarea (completada o no), cuando marco o desmarco su checkbox, entonces su estado cambia y se guarda el cambio en la base de datos.



## Lecciones aprendidas

* Integración de **Supabase** con React: manejo de auth y consultas.
* Diseño de **UI optimista**: estados locales y refetch para sincronización.
* Uso de **React Context** para centralizar la sesión.
* Beneficios del **Singleton Pattern** para clientes externos.

## VIDEO YOUTUBE
https://youtu.be/snQus1i3ym8
