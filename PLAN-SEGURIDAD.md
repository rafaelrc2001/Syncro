# Plan de Implementación de Seguridad - Sistema Syncro

## 📋 Análisis de la Estructura Actual

### Páginas Públicas (No requieren autenticación)
- ✅ `/public/index.html` - Página de carga inicial (redirige a login)
- ✅ `/public/login.html` - Página de login

### Páginas Protegidas por Rol

#### 👤 Usuario (Departamento)
**Ubicación:** `/public/Modules/Usuario/`
- `Dash-Usuario.html` - Dashboard principal
- `Dash-Usuario1.html` - Dashboard alternativo/gráficas
- `CrearPT.html` - Crear permisos de trabajo
- `AutorizarPT.html` - Autorizar permisos de trabajo

#### 👨‍💼 Supervisor
**Ubicación:** `/public/Modules/SupSeguridad/`
- `Dash-Supervisor.html` - Dashboard principal
- `Dash-Supervisor1.html` - Dashboard alternativo 1
- `Dash-Supervisor2.html` - Dashboard alternativo 2
- `Dash-Supervisor3.html` - Dashboard alternativo 3
- `SupSeguridad.html` - Panel de supervisión

#### 👔 Jefe de Seguridad
**Ubicación:** `/public/Modules/JefeSeguridad/`
- `Dash-Jefe.html` - Dashboard principal
- `Dash-Jefe1.html` - Dashboard alternativo 1
- `Dash-Jefe2.html` - Dashboard alternativo 2
- `Dash-Jefe3.html` - Dashboard alternativo 3
- `JefeSeguridad.html` - Panel administrativo
- `CrearArea.html` - Crear áreas
- `CrearCategoria.html` - Crear categorías
- `CrearDepartamento.html` - Crear departamentos
- `CrearSucursal.html` - Crear sucursales
- `CrearSupervisor.html` - Crear supervisores

---

## 🔐 Estrategia de Seguridad

### Nivel 1: Backend (Servidor)
**Objetivo:** Proteger todas las rutas API con sesiones del lado del servidor

#### Componentes necesarios:
1. **Sistema de sesiones** (express-session) ✅ INSTALADO
2. **Middleware de autenticación** - Verificar sesión en cada petición
3. **Middleware de autorización** - Verificar roles específicos
4. **Endpoints de gestión de sesión:**
   - `POST /endpoints/loginDepartamento` - Login de usuario
   - `POST /endpoints/loginJefe` - Login de jefe
   - `POST /endpoints/loginSupervisor` - Login de supervisor
   - `GET /api/verificar-sesion` - Verificar sesión activa
   - `POST /api/cerrar-sesion` - Cerrar sesión

### Nivel 2: Frontend (Cliente)
**Objetivo:** Verificar autenticación antes de mostrar contenido

#### Componentes necesarios:
1. **Script de verificación global** (`auth-check.js`)
   - Verificar sesión al cargar cada página
   - Verificar rol del usuario
   - Redirigir si no está autorizado
   - Interceptor automático para fetch API

2. **Implementación en cada HTML:**
   - Incluir `auth-check.js` ANTES de otros scripts
   - Llamar `verificarRol(['usuario'])` en páginas de Usuario
   - Llamar `verificarRol(['supervisor'])` en páginas de Supervisor
   - Llamar `verificarRol(['jefe'])` en páginas de Jefe

---

## 📝 Plan de Implementación Paso a Paso

### FASE 1: Configuración del Servidor ⚙️

#### Paso 1.1: Crear middleware de autenticación
**Archivo:** `middleware/auth.js`
```javascript
- verificarAutenticacion() - Para todas las rutas API
- verificarRol(...roles) - Para rutas específicas de rol
- verificarSesion() - Endpoint público para verificar sesión
- cerrarSesion() - Endpoint para logout
```

#### Paso 1.2: Configurar sesiones en app.js
```javascript
- Importar express-session y cookie-parser
- Configurar middleware de sesión
- Agregar secret key (usar variable de entorno)
- Configurar duración de sesión (8 horas)
```

#### Paso 1.3: Actualizar endpoints de login
**Archivo:** `loginconsulta.js`
```javascript
- Modificar /endpoints/loginDepartamento - Crear req.session.usuario
- Modificar /endpoints/loginJefe - Crear req.session.usuario
- Modificar /endpoints/loginSupervisor - Crear req.session.usuario
```

#### Paso 1.4: Proteger todas las rutas API
**Archivo:** `app.js`
```javascript
- Agregar verificarAutenticacion a todas las rutas /api/*
- Mantener /endpoints/* como público (solo login)
- Agregar endpoints de sesión
```

### FASE 2: Configuración del Cliente 🖥️

#### Paso 2.1: Crear script de verificación global
**Archivo:** `public/JS/generales/auth-check.js`
```javascript
- verificarSesionActiva() - Llamada a /api/verificar-sesion
- verificarRol(rolesPermitidos) - Verificar rol y redirigir
- cerrarSesion() - Llamada a /api/cerrar-sesion
- obtenerUsuarioActual() - Obtener datos del usuario
- Interceptor fetch automático - Agregar credentials: 'include'
```

#### Paso 2.2: Modificar login.js
**Archivo:** `public/login.js`
```javascript
- Mantener localStorage (compatibilidad)
- Confiar en las cookies de sesión del servidor
- Redirigir según rol después de login exitoso
```

#### Paso 2.3: Proteger páginas HTML de Usuario
**Archivos a modificar:**
- `Dash-Usuario.html`
- `Dash-Usuario1.html`
- `CrearPT.html`
- `AutorizarPT.html`

**Cambios en cada archivo:**
```html
<head>
  <!-- Otros scripts... -->
</head>
<body>
  <!-- Contenido... -->
  
  <!-- AGREGAR ANTES DE OTROS SCRIPTS -->
  <script src="/JS/generales/auth-check.js"></script>
  
  <script>
    document.addEventListener("DOMContentLoaded", async function() {
      // Verificar autenticación y rol
      const usuario = await verificarRol(["usuario"]);
      if (!usuario) return; // auth-check.js ya redirigió
      
      // Código existente de la página...
    });
  </script>
</body>
```

#### Paso 2.4: Proteger páginas HTML de Supervisor
**Archivos a modificar:**
- `Dash-Supervisor.html`
- `Dash-Supervisor1.html`
- `Dash-Supervisor2.html`
- `Dash-Supervisor3.html`
- `SupSeguridad.html`

**Cambios:** Igual que Usuario pero con `verificarRol(["supervisor"])`

#### Paso 2.5: Proteger páginas HTML de Jefe
**Archivos a modificar:**
- `Dash-Jefe.html`
- `Dash-Jefe1.html`
- `Dash-Jefe2.html`
- `Dash-Jefe3.html`
- `JefeSeguridad.html`
- `CrearArea.html`
- `CrearCategoria.html`
- `CrearDepartamento.html`
- `CrearSucursal.html`
- `CrearSupervisor.html`

**Cambios:** Igual que Usuario pero con `verificarRol(["jefe"])`

#### Paso 2.6: Actualizar scripts de menú
**Archivos a verificar:**
- `MenuUsuario.js` - Agregar botón de cerrar sesión
- `MenuSupervisor.js` - Agregar botón de cerrar sesión
- `MenuJefe.js` - Agregar botón de cerrar sesión

```javascript
// Buscar el botón de logout y agregar:
logoutBtn.addEventListener('click', async function() {
  await cerrarSesion(); // Función de auth-check.js
});
```

### FASE 3: Variables de Entorno 🔑

#### Paso 3.1: Crear/actualizar archivo .env
**Archivo:** `.env`
```env
PORT=3000
SESSION_SECRET=tu-secreto-super-seguro-cambiame-en-produccion-12345
```

**⚠️ IMPORTANTE:** Agregar `.env` al `.gitignore`

---

## 🎯 Archivos a Crear/Modificar

### ✨ Archivos NUEVOS a crear:
1. `middleware/auth.js` - Middleware de autenticación
2. `public/JS/generales/auth-check.js` - Verificación frontend
3. `.env` - Variables de entorno (si no existe)

### 📝 Archivos a MODIFICAR:

#### Backend:
1. `app.js` - Configurar sesiones y proteger rutas
2. `loginconsulta.js` - Crear sesiones en login
3. `package.json` - Ya tiene las dependencias ✅

#### Frontend - Scripts JS:
1. `public/login.js` - Ajustar manejo de login
2. `public/JS/usuario/MenuUsuario.js` - Cerrar sesión
3. `public/JS/jefe/MenuJefe.js` - Cerrar sesión
4. `public/JS/supervisor/MenuSupervisor.js` - Cerrar sesión

#### Frontend - HTML (16 páginas):
**Usuario (4):**
1. `Modules/Usuario/Dash-Usuario.html`
2. `Modules/Usuario/Dash-Usuario1.html`
3. `Modules/Usuario/CrearPT.html`
4. `Modules/Usuario/AutorizarPT.html`

**Supervisor (5):**
5. `Modules/SupSeguridad/Dash-Supervisor.html`
6. `Modules/SupSeguridad/Dash-Supervisor1.html`
7. `Modules/SupSeguridad/Dash-Supervisor2.html`
8. `Modules/SupSeguridad/Dash-Supervisor3.html`
9. `Modules/SupSeguridad/SupSeguridad.html`

**Jefe (11):**
10. `Modules/JefeSeguridad/Dash-Jefe.html`
11. `Modules/JefeSeguridad/Dash-Jefe1.html`
12. `Modules/JefeSeguridad/Dash-Jefe2.html`
13. `Modules/JefeSeguridad/Dash-Jefe3.html`
14. `Modules/JefeSeguridad/JefeSeguridad.html`
15. `Modules/JefeSeguridad/CrearArea.html`
16. `Modules/JefeSeguridad/CrearCategoria.html`
17. `Modules/JefeSeguridad/CrearDepartamento.html`
18. `Modules/JefeSeguridad/CrearSucursal.html`
19. `Modules/JefeSeguridad/CrearSupervisor.html`

---

## 🔍 Flujo de Seguridad

### Flujo de Login:
```
1. Usuario ingresa credenciales en login.html
2. login.js envía POST a /endpoints/login[Tipo]
3. Backend verifica credenciales en BD
4. Si correcto: crea req.session.usuario y responde success
5. Frontend recibe respuesta y redirige según rol
6. Cookie de sesión se guarda automáticamente en navegador
```

### Flujo de Acceso a Página Protegida:
```
1. Usuario intenta acceder a Dash-Usuario.html
2. Navegador carga la página HTML
3. Script auth-check.js se ejecuta PRIMERO
4. verificarRol() llama a GET /api/verificar-sesion
5. Backend verifica req.session.usuario
6. Si válido: devuelve datos del usuario
7. Si inválido: auth-check.js redirige a /login.html
8. Si rol incorrecto: redirige a su dashboard correspondiente
```

### Flujo de Petición API:
```
1. Página hace fetch('/api/permisos')
2. Interceptor agrega credentials: 'include'
3. Backend verifica req.session en middleware
4. Si válido: continúa a controlador
5. Si inválido: responde 401 Unauthorized
6. Frontend detecta 401 y puede redirigir a login
```

---

## ✅ Checklist de Implementación

### Backend
- [ ] Crear middleware/auth.js
- [ ] Configurar sesiones en app.js
- [ ] Actualizar endpoints de login
- [ ] Proteger todas las rutas /api/*
- [ ] Crear endpoints de sesión
- [ ] Configurar variables de entorno

### Frontend - Core
- [ ] Crear auth-check.js
- [ ] Actualizar login.js

### Frontend - Páginas Usuario
- [ ] Dash-Usuario.html
- [ ] Dash-Usuario1.html
- [ ] CrearPT.html
- [ ] AutorizarPT.html

### Frontend - Páginas Supervisor
- [ ] Dash-Supervisor.html
- [ ] Dash-Supervisor1.html
- [ ] Dash-Supervisor2.html
- [ ] Dash-Supervisor3.html
- [ ] SupSeguridad.html

### Frontend - Páginas Jefe
- [ ] Dash-Jefe.html
- [ ] Dash-Jefe1.html
- [ ] Dash-Jefe2.html
- [ ] Dash-Jefe3.html
- [ ] JefeSeguridad.html
- [ ] CrearArea.html
- [ ] CrearCategoria.html
- [ ] CrearDepartamento.html
- [ ] CrearSucursal.html
- [ ] CrearSupervisor.html

### Frontend - Menús
- [ ] MenuUsuario.js
- [ ] MenuSupervisor.js
- [ ] MenuJefe.js

### Testing
- [ ] Probar login de cada rol
- [ ] Probar acceso a páginas propias
- [ ] Probar acceso a páginas de otros roles (debe denegar)
- [ ] Probar cierre de sesión
- [ ] Probar expiración de sesión (8 horas)
- [ ] Probar URLs directas sin login

---

## 🚀 Orden de Implementación Recomendado

### Día 1: Backend
1. Crear middleware/auth.js
2. Configurar app.js (sesiones + rutas protegidas)
3. Actualizar loginconsulta.js
4. Crear .env

### Día 2: Frontend Core + Usuario
1. Crear auth-check.js
2. Actualizar login.js
3. Proteger 4 páginas de Usuario
4. Actualizar MenuUsuario.js
5. **Probar completamente Usuario**

### Día 3: Supervisor + Jefe
1. Proteger 5 páginas de Supervisor
2. Actualizar MenuSupervisor.js
3. Proteger 10 páginas de Jefe
4. Actualizar MenuJefe.js
5. **Probar todos los roles**

---

## 🔒 Beneficios de esta Implementación

1. ✅ **Seguridad del servidor:** Todas las API protegidas con sesiones
2. ✅ **Seguridad del cliente:** Verificación antes de mostrar contenido
3. ✅ **Control de roles:** Cada usuario solo ve su contenido
4. ✅ **Expiración automática:** Sesiones expiran después de 8 horas
5. ✅ **URL directas bloqueadas:** No se puede acceder compartiendo links
6. ✅ **Logout funcional:** Cierra sesión en servidor y cliente
7. ✅ **Compatible:** Mantiene localStorage para compatibilidad

---

## 📚 Recursos y Documentación

### Dependencias instaladas:
- `express-session@1.18.1` - Gestión de sesiones
- `cookie-parser@1.4.7` - Parseo de cookies

### Configuración de sesión:
- Duración: 8 horas
- Almacenamiento: Memoria (para desarrollo)
- Cookie: httpOnly, secure en producción

### Próximos pasos (opcional):
- Implementar almacenamiento de sesiones en Redis
- Agregar rate limiting para prevenir ataques
- Implementar HTTPS en producción
- Hashear contraseñas con bcrypt
