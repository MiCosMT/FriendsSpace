# 🌟 FriendsSpace

Una plataforma social moderna para conectar con personas que comparten tus intereses. Encuentra amigos, comparte anuncios y comunicarte a través de un sistema de mensajería en tiempo real.

---

## 📋 Descripción del Proyecto

**FriendsSpace** es una aplicación fullstack diseñada para facilitar conexiones significativas entre usuarios basadas en intereses comunes. La plataforma incluye:

- 🔐 Sistema de autenticación y autorización
- 👥 Perfiles de usuario personalizados
- 🎯 Sistema de intereses y etiquetas
- 📢 Tablón de anuncios compartidos
- 🤝 Solicitudes de conexión entre usuarios
- 💬 Mensajería en tiempo real con WebSockets
- 🎨 Interfaz moderna con tema claro/oscuro

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
FriendsSpace/
├── fs_backend/              # Backend Node.js + Express
│   ├── config/              # Configuraciones (DB, Cloudinary, etc.)
│   ├── controllers/         # Lógica de negocio
│   ├── models/              # Modelos Sequelize
│   ├── routes/              # Rutas API
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
| Node.js | - | Runtime JavaScript |
| Express | 5.2.1 | Framework web |
| Socket.io | 4.8.3 | Comunicación en tiempo real |
| MySQL | 3.17.2 | Base de datos |
| Sequelize | 6.37.7 | ORM para MySQL |
| JWT | 9.0.3 | Autenticación |
| Bcrypt | 6.0.0 | Encriptación de contraseñas |
| Cloudinary | 1.41.3 | Almacenamiento de imágenes |
| Multer | 2.1.0 | Gestión de archivos |

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 19.2.0 | Librería UI |
| Vite | 7.3.1 | Build tool |
| React Router | 7.13.0 | Enrutamiento |
| Material-UI | 7.3.8 | Componentes UI |
| Zustand | 5.0.11 | Gestión de estado |
| Socket.io Client | 4.8.3 | Cliente WebSocket |
| Axios | 1.13.5 | HTTP client |
| Framer Motion | 12.35.2 | Animaciones |

---

## 📦 Funcionalidades Principales

### 1. **Autenticación y Usuarios**
- Registro e inicio de sesión
- Recuperación de contraseña
- Perfiles de usuario con foto, bio, objetivos
- Roles: USER, ADMIN, DEVELOPER
- Sistema de baneos

### 2. **Intereses**
- Crear y gestionar intereses personales
- Filtrar usuarios por intereses
- Tags y categorías

### 3. **Conexiones**
- Solicitar conexión con otros usuarios
- Aceptar/rechazar solicitudes
- Ver lista de conexiones

### 4. **Anuncios**
- Publicar anuncios con descripción e imágenes
- Filtrar por intereses
- Listar anuncios de usuarios conectados

### 5. **Mensajería**
- Chat en tiempo real con WebSockets
- Historial de conversaciones
- Menú contextual de mensajes

### 6. **Gestión de Admins**
- Listar usuarios con rol ADMIN
- DEVs pueden crear nuevos admins
- DEVs pueden banear admins

---

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js 16+ (con npm o yarn)
- MySQL 8.0+
- Cuenta en Cloudinary (opcional, para imágenes)

### Backend Setup

```bash
# 1. Navegar a la carpeta del backend
cd fs_backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cp .env.example .env

# 4. Configurar variables de entorno
# - DB_HOST
# - DB_USER
# - DB_PASSWORD
# - DB_NAME
# - JWT_SECRET
# - CLOUDINARY_NAME
# - CLOUDINARY_KEY
# - CLOUDINARY_SECRET
# - FRONTEND_URL

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

## 📚 API Endpoints

### Usuarios
```
POST   /api/users/register      - Registrar nuevo usuario
POST   /api/users/login         - Iniciar sesión
GET    /api/users/:id           - Obtener usuario
PUT    /api/users/:id           - Actualizar usuario
DELETE /api/users/:id           - Eliminar usuario
GET    /api/users/search        - Buscar usuarios
```

### Intereses
```
GET    /api/interests           - Listar intereses
POST   /api/interests           - Crear interés
DELETE /api/interests/:id       - Eliminar interés
```

### Anuncios
```
GET    /api/ads                 - Listar anuncios
POST   /api/ads                 - Crear anuncio
PUT    /api/ads/:id             - Actualizar anuncio
DELETE /api/ads/:id             - Eliminar anuncio
```

### Conexiones
```
GET    /api/connections         - Listar conexiones
POST   /api/connections         - Enviar solicitud
PUT    /api/connections/:id     - Aceptar/rechazar
```

### Mensajes
```
GET    /api/messages/:userId    - Obtener conversación
POST   /api/messages            - Enviar mensaje
```

---

## 🔌 WebSocket Events

```javascript
// Cliente → Servidor
'send_message'         - Enviar mensaje
'typing'              - Indicar que está escribiendo
'connect'             - Conectar a sala

// Servidor → Cliente
'receive_message'     - Recibir mensaje
'user_typing'         - Usuario escribiendo
'new_connection'      - Nueva conexión
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
DB_PASSWORD=password
DB_NAME=friendsspace

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

---

## 📱 Páginas Principales

### Frontend

| Página | Ruta | Descripción |
|--------|------|-------------|
| Home | / | Página de inicio |
| Login | /login | Iniciar sesión |
| Register | /register | Registro de nuevo usuario |
| User Profile | /user/:id | Perfil de usuario |
| Edit Profile | /user/edit | Editar perfil propio |
| Ads | /ads | Tablón de anuncios |
| Search Friends | /search | Buscar nuevos amigos |
| Requests | /requests | Solicitudes de conexión |
| Chats | /chats | Mensajería |
| Admins | /admins | Listar y gestionar admins (DEVELOPER only) |
| Banned | /banned | Usuarios baneados |
| Change Password | /change-password | Cambiar contraseña |

---

## 🎨 Características de UI

- 🌓 Tema claro/oscuro
- 📱 Diseño responsivo con Material-UI
- ✨ Animaciones fluidas con Framer Motion
- 🎯 Navegación intuitiva con React Router
- 🔔 Diálogos de error personalizados
- 📊 Componentes reutilizables

---

## 📄 Modelos de Base de Datos

```
Users
├── Roles (USER, ADMIN, DEVELOPER)
├── Profile (name, email, bio, image, goals)
└── Status (banned, created_at)

Interests
└── Tags compartidos

Connections
├── User A ↔ User B
└── Status (pendiente, aceptada)

Ads
├── Título, descripción
├── Imágenes (Cloudinary)
└── Intereses asociados

Messages
├── User A → User B
└── Timestamp en tiempo real

Requests
├── Solicitudes de conexión
└── Status (pendiente, aceptada, rechazada)
```

---

## 🚢 Despliegue

### Backend (Vercel/Railway/Heroku)
```bash
npm run build
npm start
```

### Frontend (Vercel)
```bash
npm run build
# Vercel automáticamente detecta y despliega
```

---

## 📞 Soporte y Contacto

- 👤 Autor: Ruben
- 📧 Email: xrmartri675@ieshnosmachado.org
- 🐙 GitHub: @Ruben12MT

---

## 📝 Licencia

ISC

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## ✅ Estado del Proyecto

- ✅ Autenticación completa
- ✅ CRUD de usuarios
- ✅ Sistema de intereses
- ✅ Anuncios con imágenes
- ✅ Conexiones entre usuarios
- ✅ Mensajería en tiempo real
- 📋 Tests unitarios (pendiente)

---

**Última actualización:** Mayo 2026
