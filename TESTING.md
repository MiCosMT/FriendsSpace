# 🧪 Guía de Testing - FriendsSpace

## 📋 Resumen de Configuración

La app está lista para testing con:
- **Backend**: Jest + Supertest
- **Frontend**: Vitest + React Testing Library

---

## 🚀 Pasos para Ejecutar Tests

### 1️⃣ INSTALAR DEPENDENCIAS

**Backend:**
```bash
cd fs_backend
npm install
```

**Frontend:**
```bash
cd fs_frontend
npm install
```

---

## 🧪 COMANDOS DE TESTING

### Backend (Node.js + Jest)

```bash
cd fs_backend

# Ejecutar tests una vez
npm test

# Ejecutar tests en modo observación (se re-ejecutan al cambiar archivos)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

**Ubicación de tests:** `fs_backend/__tests__/`

### Frontend (React + Vitest)

```bash
cd fs_frontend

# Ejecutar tests una vez
npm test

# Ejecutar tests en modo observación con UI
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

**Ubicación de tests:** `fs_frontend/src/__tests__/`

---

## 📁 Estructura de Tests Creada

### Backend
```
fs_backend/__tests__/
├── example.test.js              ← Test básico de ejemplo
├── routes/
│   └── example.test.js          ← Tests de rutas (API)
└── services/
    └── example.test.js          ← Tests de servicios
```

### Frontend
```
fs_frontend/src/__tests__/
├── setup.js                     ← Configuración de testing
├── example.test.jsx             ← Tests básicos
```

---

## 💡 Cómo Escribir Tests

### Backend - Test de Servicio
```javascript
// __tests__/services/userService.test.js
const userService = require('../../services/userService');

describe('User Service', () => {
  test('should create a user', async () => {
    const user = await userService.createUser({
      email: 'test@test.com',
      password: 'pass123'
    });
    
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@test.com');
  });
});
```

### Backend - Test de Rutas/API
```javascript
// __tests__/routes/user.test.js
const request = require('supertest');
const app = require('../../index');

describe('User Routes', () => {
  test('GET /api/users should return users', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/users should create user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'newuser@test.com',
        password: 'pass123'
      })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
  });
});
```

### Frontend - Test de Componente
```javascript
// src/__tests__/components/UserCard.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserCard from '../../components/UserCard';

describe('UserCard Component', () => {
  it('should render user card with name', () => {
    render(<UserCard name="John" />);
    expect(screen.getByText('John')).toBeTruthy();
  });
});
```

### Frontend - Test de Hook
```javascript
// src/__tests__/hooks/useUser.test.jsx
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useUser from '../../hooks/useUser';

describe('useUser Hook', () => {
  it('should return user data', () => {
    const { result } = renderHook(() => useUser());
    expect(result.current).toBeDefined();
  });
});
```

---

## 🎯 Próximos Pasos

1. **Instala las dependencias** en ambos directorios
2. **Ejecuta los tests de ejemplo** para verificar que todo funciona
3. **Reemplaza los tests de ejemplo** con tests reales de tus componentes/servicios
4. **Integra los tests en tu CI/CD** (GitHub Actions, etc.)

---

## 📊 Cobertura de Código

Los tests generarán reportes en:
- Backend: `fs_backend/coverage/`
- Frontend: `fs_frontend/coverage/`

Abre `index.html` en cualquier carpeta para ver el reporte visual.

---

## 🔧 Notas Importantes

✅ Los tests del backend pueden acceder a la base de datos (configúralos si es necesario)  
✅ Los tests del frontend usan jsdom, no necesitan navegador real  
✅ Usa `vitest --ui` para una UI interactiva de tests en el frontend  
✅ Los tests se ejecutan aislados, así que puedes crear varios sin que interfieran  

---

¡Tu app está lista para testing! 🎉
