# 🌟 FriendsSpace

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Una plataforma social moderna para conectar con personas que comparten tus intereses. Encuentra amigos, comparte anuncios y comunícate a través de un sistema de mensajería en tiempo real.

## 📋 Descripción del Proyecto

**FriendsSpace** es una aplicación fullstack diseñada para facilitar conexiones significativas entre usuarios basadas en intereses comunes. La plataforma incluye:

- 🔐 Sistema de autenticación y autorización robusto
- 👥 Perfiles de usuario personalizados con fotos y biografías
- 🎯 Sistema de intereses y etiquetas para matchmaking
- 📢 Tablón de anuncios compartidos con imágenes
- 🤝 Solicitudes de conexión entre usuarios
- 💬 Mensajería en tiempo real con WebSockets
- 🎨 Interfaz moderna con tema claro/oscuro
- 📱 Diseño responsivo para móviles y desktop

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
FriendsSpace/
├── fs_backend/              # Backend Node.js + Express
│   ├── config/              # Configuraciones (DB, Cloudinary, etc.)
│   ├── controllers/         # Lógica de negocio
│   ├── models/              # Modelos Sequelize
│   ├── routes/              # Rutas API REST
│   ├── services/            # Servicios reutilizables
│   ├── middlewares/         # Autenticación y validaciones
│   ├── validations/         # Esquemas de validación
│   ├── utils/               # Utilidades y helpers
│   ├── request/             # Tests con REST Client
│   └── index.js             # Punto de entrada
│
└── fs_frontend/             # Frontend React + Vite
    ├── src/
    │   ├── components/      # Componentes reutilizables
    │   ├── pages/          # Páginas/vistas
    │   ├── context/        # Context API (Socket, Error)
    │   ├── hooks/          # Hooks personalizados
    │   ├── store/          # Zustand stores (Auth, Theme)
    │   ├── utils/          # Utilidades y API calls
    │   ├── assets/         # Recursos estáticos
    │   └── App.jsx         # Componente raíz
    ├── public/             # Archivos públicos
    └── vite.config.js      # Configuración de Vite
```

---

## 🚀 Tecnologías Principales

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js | 18+ | Runtime JavaScript |
| Express | 5.2.1 | Framework web |
| Socket.io | 4.8.3 | Comunicación en tiempo real |
| MySQL | 8.0+ | Base de datos relacional |
| Sequelize | 6.37.7 | ORM para MySQL |
| JWT | 9.0.3 | Autenticación basada en tokens |
| Bcrypt | 6.0.0 | Encriptación de contraseñas |
| Cloudinary | 1.41.3 | Almacenamiento de imágenes |
| Multer | 2.1.0 | Gestión de archivos multipart |

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 19.2.0 | Librería UI |
| Vite | 7.3.1 | Build tool y dev server |
| React Router | 7.13.0 | Enrutamiento SPA |
| Material-UI | 7.3.8 | Componentes UI |
| Zustand | 5.0.11 | Gestión de estado global |
| Socket.io Client | 4.8.3 | Cliente WebSocket |
| Axios | 1.13.5 | Cliente HTTP |
| Framer Motion | 12.35.2 | Animaciones |

---

## 📦 Funcionalidades Principales

### 1. **Autenticación y Usuarios**
- Registro e inicio de sesión seguro
- Recuperación de contraseña
- Perfiles de usuario con foto, bio, objetivos
- Roles: USER, ADMIN, DEVELOPER
- Sistema de baneos para moderación

### 2. **Intereses**
- Crear y gestionar intereses personales
- Filtrar usuarios por intereses compartidos
- Tags y categorías organizadas

### 3. **Conexiones**
- Solicitar conexión con otros usuarios
- Aceptar/rechazar solicitudes de amistad
- Ver lista de conexiones activas

### 4. **Anuncios**
- Publicar anuncios con descripción e imágenes
- Filtrar anuncios por intereses
- Listar anuncios de usuarios conectados

### 5. **Mensajería**
- Chat en tiempo real con WebSockets
- Historial de conversaciones persistente
- Menú contextual de mensajes

### 6. **Gestión de Admins**
- Listar usuarios con rol ADMIN
- DEVs pueden crear nuevos admins
- DEVs pueden banear admins

---

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js 18+ (con npm o yarn)
- MySQL 8.0+
- Cuenta en Cloudinary (opcional, para subir imágenes)

### Backend Setup

```bash
# 1. Navegar a la carpeta del backend
cd fs_backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cp .env.example .env

# 4. Configurar variables de entorno (ver sección Variables de Entorno)
# Editar el archivo .env con tus credenciales

# 5. Ejecutar servidor
npm start          # Producción
npm run dev        # Desarrollo (con nodemon)
```

### Frontend Setup

```bash
# 1. Navegar a la carpeta del frontend
cd fs_frontend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cp .env.example .env

# 4. Configurar URL del backend
# VITE_API_URL=http://localhost:3000

# 5. Ejecutar servidor de desarrollo
npm run dev

# 6. Build para producción
npm run build
```

---

## 🚀 Uso

1. **Iniciar el Backend**: Ejecuta `npm run dev` en `fs_backend/`
2. **Iniciar el Frontend**: Ejecuta `npm run dev` en `fs_frontend/`
3. **Acceder**: Abre http://localhost:5173 en tu navegador
4. **Registro**: Crea una cuenta nueva
5. **Configurar Perfil**: Agrega intereses y foto de perfil
6. **Conectar**: Busca usuarios con intereses similares y envía solicitudes
7. **Chatear**: Usa el sistema de mensajería en tiempo real

---

## 📚 API Endpoints

### Usuarios
```
POST   /api/users/register      - Registrar nuevo usuario
POST   /api/users/login         - Iniciar sesión
GET    /api/users/:id           - Obtener usuario por ID
PUT    /api/users/:id           - Actualizar usuario
DELETE /api/users/:id           - Eliminar usuario
GET    /api/users/search        - Buscar usuarios por criterios
```

### Intereses
```
GET    /api/interests           - Listar todos los intereses
POST   /api/interests           - Crear nuevo interés
DELETE /api/interests/:id       - Eliminar interés por ID
```

### Anuncios
```
GET    /api/ads                 - Listar anuncios
POST   /api/ads                 - Crear nuevo anuncio
PUT    /api/ads/:id             - Actualizar anuncio
DELETE /api/ads/:id             - Eliminar anuncio
```

### Conexiones
```
GET    /api/connections         - Listar conexiones del usuario
POST   /api/connections         - Enviar solicitud de conexión
PUT    /api/connections/:id     - Aceptar/rechazar solicitud
```

### Mensajes
```
GET    /api/messages/:userId    - Obtener conversación con usuario
POST   /api/messages            - Enviar mensaje
```

---

## 🔌 WebSocket Events

```javascript
// Cliente → Servidor
socket.emit('send_message', { to: userId, message: 'Hola!' });
socket.emit('typing', { to: userId, isTyping: true });

// Servidor → Cliente
socket.on('receive_message', (data) => { /* manejar mensaje */ });
socket.on('user_typing', (data) => { /* mostrar indicador */ });
socket.on('new_connection', (data) => { /* actualizar lista */ });
```

---

## 🔒 Variables de Entorno

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=friendsspace

# JWT
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRE=7d

# Cloudinary (opcional)
CLOUDINARY_NAME=tu_cloudinary_name
CLOUDINARY_KEY=tu_cloudinary_key
CLOUDINARY_SECRET=tu_cloudinary_secret
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

---

## 📱 Páginas Principales

| Página | Ruta | Descripción |
|--------|------|-------------|
| Home | / | Página de inicio con feed |
| Login | /login | Iniciar sesión |
| Register | /register | Registro de nuevo usuario |
| User Profile | /user/:id | Perfil de usuario |
| Edit Profile | /user/edit | Editar perfil propio |
| Ads | /ads | Tablón de anuncios |
| Search Friends | /search | Buscar nuevos amigos |
| Requests | /requests | Solicitudes de conexión |
| Chats | /chats | Mensajería |
| Admins | /admins | Gestión de admins (DEVELOPER) |
| Banned | /banned | Usuarios baneados |
| Change Password | /change-password | Cambiar contraseña |

---

## 🎨 Características de UI

- 🌓 Tema claro/oscuro automático
- 📱 Diseño completamente responsivo
- ✨ Animaciones fluidas con Framer Motion
- 🎯 Navegación intuitiva con React Router
- 🔔 Sistema de notificaciones de error
- 📊 Componentes reutilizables y modulares

---

¡Gracias por usar FriendsSpace! 🌟
