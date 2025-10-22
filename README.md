# Syncro — Permisos de Trabajo (PT) — Resumen de versiones, credenciales y puertos

Resumen corto con la información necesaria para ejecutar y conectar la aplicación localmente.

## Versiones recomendadas
- Node.js: 18.x — 20.x (LTS recomendado: 18/20)
- npm: 8.x — 10.x
- PostgreSQL: 13 — 15

## Instalación rápida
1. Clonar repositorio.
2. Copiar archivo de ejemplo de variables de entorno:
   - Crear `.env` en la raíz del proyecto (no subir al repo).
3. Instalar dependencias:
   - `npm install`
4. Ejecutar:
   - Desarrollo: `npm run dev` (si existe script), si no: `node index.js` o `npm start`.

## Puertos por defecto
- Backend API (Express): 3000 (variable: `APP_PORT`)
- Frontend (si se sirve con Express): mismo puerto del backend (3000).  
- PostgreSQL: 5432 (variable: `DB_PORT`)

Ajusta los puertos en `.env` según tu entorno.

## Endpoints principales (ejemplos)
- GET /api/verformularios?id=ID_PERMISO  
  - Retorna: { tipo_permiso, general, detalles, ast, actividades_ast, ... }
- PT específicos (ejemplos en el proyecto):
  - /api/pt-altura/:id
  - /api/pt-apertura/:id
  - /api/pt-confinado/:id
  - /api/pt-no-peligroso/requisitos_area/:id

Revisa `endpoints/` para la lista completa.

## Variables de entorno (recomendadas)
Definir en `.env`. Ejemplo y explicación:

````env
# filepath: c:\Users\rafae\OneDrive\Escritorio\syncro\Syncro\.env.example
NODE_ENV=development
APP_PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario_db
DB_PASSWORD=tu_contraseña_db
DB_NAME=nombre_base_datos
DB_MAX_POOL=20



# Otros (opcional)
LOG_LEVEL=info
