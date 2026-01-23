

// Inicialización de app
// Inicialización de app

// ...existing code...
// Endpoint de login de usuario departamento
//Notas:
//Tengo dos funciones de estatus una mas arrbiba en el codigo y la otra hasta abajo

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const db = require("./database");
require("dotenv").config();

const tablasRouter = require("./tablas");
const listasRouter = require("./listas");
const vertablasRouter = require("./vertablas");
const targetasRouter = require("./verformularios");
const verformulariosRouter = require("./loginconsulta");
const autorizacionesEstatusRouter = require("./autorizaciones_estatus");
// const formulariosRouter = require("./formularios");
//const formularioConfinadosRouter = require("./formulariospt3-10/formulario_confinados");
//const formularioFuegoRouter = require("./formulariospt3-10/formulario_fuego"); // <--- AGREGA ESTA LÍNEA
//const formularioElectricoRouter = require("./formulariospt3-10/formulario_electrico"); // <--- AGREGA ESTA LÍNEA
//const formularioRadiacionRouter = require("./formulariospt3-10/formulario_radiactivas"); // <--- AGREGA ESTA LÍNEA
//const formularioAlturaRouter = require("./formulariospt3-10/formulario_altura");
const pt1ImprimirRouter = require("./impresiones/pt1_imprimir");
const pt2PDFRouter = require("./impresiones/pt2_pdf_routes"); // Nuevo router para PDF PT2
const graficasAreasRouter = require("./graficas/endpoint_graficas_areas");
const permisosTipoRouter = require("./graficas/endpoint_permisos");
const graficaEstatusRouter = require("./graficas/endpoint_grafica_estatus");
const tablaPermisosRouter = require("./graficas/endpoint_tabla");
const exportarRouter = require("./exportar");
const fechasAutorizacionRouter = require("./fechas_autorizacion_routes");
//const formularioIzajeRouter = require("./formulariospt3-10/formulario_izaje");
//const formularioCestaRouter = require("./formulariospt3-10/formulario_cesta");
//const formularioExcavacionRouter = require("./formulariospt3-10/formulario_excavacion");
const loginconsultaRouter = require("./loginconsulta");
const graficaMesesRouter = require("./graficas/endpoint_grafica_meses");
const departamentoConsultaRouter = require("./departamento_consulta");

const graficaSubEstatusRouter = require("./graficas/endpoint_grafica_subestatus");




const permisoVistaRouter = require("./permiso_vista_routes");



const detectarDispositivoRouter = require('./obtenciondeipendpoint');


const graficasJefesRouter = require("./graficas/graficas_jefes/graficas_jefes");
const equipoBuscarRouter = require("./equipo_buscar");
const { verificarAutenticacion, verificarRol, verificarSesion, cerrarSesion } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

const usuarioCredencialRouter = require("./usuario_credencial");



// Configuración de CORS (debe ir antes de cualquier ruta)
// const corsOptions = {
//   origin: [
//     "http://localhost:5500",
//     "http://127.0.0.1:5500",
//     "http://localhost:5501",
//     "http://127.0.0.1:5501",
//   ],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
app.use(cors({
  origin: "https://syncro-production-30a.up.railway.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors({
  origin: "https://syncro-production-30a.up.railway.app",
  credentials: true
}));

// Middleware para cookies y sesiones
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "tu-secreto-super-seguro-cambiame-en-produccion",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Cambiar a true si usas HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 20, // 20 minutos
    },
  })
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de archivos estáticos con headers apropiados
app.use(
  express.static("public", {
    setHeaders: function (res, path, stat) {
      if (path.endsWith(".css")) {
        res.set("Content-Type", "text/css");
      }
    },
  })
);app.use("/api", verificarAutenticacion, graficaSubEstatusRouter); // Monta las rutas de graficas/endpoint_grafica_subestatus.js bajo el prefijo /api


// Endpoint de login de usuario departamento
app.use("/endpoints", loginconsultaRouter);
app.post("/endpoints/actualizarContrasena", loginconsultaRouter);
// Endpoints de autenticación (públicos)
app.get("/api/verificar-sesion", verificarSesion);
app.post("/api/cerrar-sesion", cerrarSesion);

// Rutas de la API (TODAS PROTEGIDAS CON AUTENTICACIÓN)

app.use("/api", verificarAutenticacion, tablasRouter); // Monta las rutas de tablas.js bajo el prefijo /api
app.use("/api", verificarAutenticacion, departamentoConsultaRouter); // Monta rutas de departamento_consulta.js (incluye /areas con filtro)
app.use("/api", verificarAutenticacion, listasRouter); // Monta las rutas de listas.js bajo el prefijo /api
app.use("/api", verificarAutenticacion, vertablasRouter); // Monta las rutas de vertablas.js bajo el prefijo /api
app.use("/api", verificarAutenticacion, targetasRouter); // Monta las rutas de targetas.js bajo el prefijo /api
app.use("/api", verificarAutenticacion, verformulariosRouter); // Monta las rutas de verformularios.js bajo el prefijo /api
app.use("/api", verificarAutenticacion, autorizacionesEstatusRouter); // Monta las rutas de autorizaciones_estatus.js bajo el prefijo /api
// app.use("/api", verificarAutenticacion, formulariosRouter); // Monta las rutas de formularios.js bajo el prefijo /api
//app.use("/api", verificarAutenticacion, formularioConfinadosRouter); // Monta las rutas de formulario_confinados.js bajo el prefijo /api
//app.use("/api", verificarAutenticacion, formularioFuegoRouter); // <--- Y ESTA LÍNEA
//app.use("/api", verificarAutenticacion, formularioElectricoRouter); // <--- Y ESTA LÍNEA
//app.use("/api", verificarAutenticacion, formularioRadiacionRouter); // <--- Y ESTA LÍNEA
//app.use("/api", verificarAutenticacion, formularioAlturaRouter); // Monta las rutas de formulario_altura.js bajo el prefijo /api
app.use("/api", verificarAutenticacion, pt1ImprimirRouter); // Monta las rutas de impresión PT1 bajo el prefijo /api
app.use("/api/pt2", verificarAutenticacion, pt2PDFRouter); // Monta las rutas de PDF PT2 bajo el prefijo /api/pt2
app.use("/api", verificarAutenticacion, graficasAreasRouter); // Monta las rutas de graficas/endpoint_graficas_areas.js bajo el prefijo /api
app.use("/api", verificarAutenticacion, permisosTipoRouter); // Monta las rutas de graficas/endpoint_permisos.js bajo el prefijo /api
app.use("/api", verificarAutenticacion, graficaEstatusRouter); // Monta las rutas de graficas/endpoint_grafica_estatus.js bajo el prefijo /api
app.use("/api", verificarAutenticacion, tablaPermisosRouter); // Monta las rutas de graficas/endpoint_tabla.js bajo el prefijo /api
app.use("/api", verificarAutenticacion, exportarRouter); // Monta las rutas de exportar.js bajo /api (p.ej. /api/exportar-supervisor)
app.use("/api", verificarAutenticacion, fechasAutorizacionRouter); // Monta las rutas de fechas de autorización
app.use("/api/graficas_jefes", verificarAutenticacion, graficasJefesRouter);
//app.use("/api", verificarAutenticacion, formularioIzajeRouter);
//app.use("/api", verificarAutenticacion, formularioCestaRouter);
//app.use("/api", verificarAutenticacion, formularioExcavacionRouter);
app.use("/api/graficas_jefes", verificarAutenticacion, graficaMesesRouter);
app.use("/api", verificarAutenticacion, departamentoConsultaRouter);
app.use("/api", verificarAutenticacion, equipoBuscarRouter); // Ruta para buscar equipo por TAG
app.use("/api", verificarAutenticacion, usuarioCredencialRouter); // Ruta para buscar usuario por número de credencial

// ================= RUTAS DE TABLAS BASE =================
const tablasBase = require("./tablasbase");

// CATEGORIAS
app.get("/api/categorias", verificarAutenticacion, tablasBase.getCategorias);
app.post("/api/categorias", verificarAutenticacion, tablasBase.createCategoria);
app.put("/api/categorias/:id", verificarAutenticacion, tablasBase.updateCategoria);
app.delete("/api/categorias/:id", verificarAutenticacion, tablasBase.deleteCategoria);
app.put("/api/categorias/hide/:id", verificarAutenticacion, tablasBase.hideCategoria);

// AREAS - COMENTADO: Ahora se usa el endpoint en departamento_consulta.js con filtro
// app.get("/api/areas", verificarAutenticacion, tablasBase.getAreas);
// app.get("/api/areas/:id", verificarAutenticacion, tablasBase.getAreaById);
app.post("/api/areas", verificarAutenticacion, tablasBase.createArea);
app.put("/api/areas/:id", verificarAutenticacion, tablasBase.updateArea);
app.delete("/api/areas/:id", verificarAutenticacion, tablasBase.deleteArea);
app.put("/api/areas/hide/:id", verificarAutenticacion, tablasBase.hideArea);

// SUCURSALES
app.get("/api/sucursales", verificarAutenticacion, tablasBase.getSucursales);
app.get("/api/sucursales/:id", verificarAutenticacion, tablasBase.getSucursalById);
app.post("/api/sucursales", verificarAutenticacion, tablasBase.createSucursal);
app.put("/api/sucursales/:id", verificarAutenticacion, tablasBase.updateSucursal);
app.delete("/api/sucursales/:id", verificarAutenticacion, tablasBase.deleteSucursal);
app.put("/api/sucursales/hide/:id", verificarAutenticacion, tablasBase.hideSucursal);

// DEPARTAMENTOS
app.get("/api/departamentos", verificarAutenticacion, tablasBase.getDepartamentos);
app.get("/api/departamentos/:id", verificarAutenticacion, tablasBase.getDepartamentoById);
app.post("/api/departamentos", verificarAutenticacion, tablasBase.createDepartamento);
app.put("/api/departamentos/:id", verificarAutenticacion, tablasBase.updateDepartamento);
app.delete("/api/departamentos/:id", verificarAutenticacion, tablasBase.deleteDepartamento);
app.put("/api/departamentos/hide/:id", verificarAutenticacion, tablasBase.hideDepartamento);

// SUPERVISORES
app.get("/api/supervisores_base", verificarAutenticacion, tablasBase.getSupervisores);
app.get("/api/supervisores/:id", verificarAutenticacion, tablasBase.getSupervisorById);
app.post("/api/supervisores", verificarAutenticacion, tablasBase.createSupervisor);
app.put("/api/supervisores/:id", verificarAutenticacion, tablasBase.updateSupervisor);
app.delete("/api/supervisores/:id", verificarAutenticacion, tablasBase.deleteSupervisor);
app.put("/api/supervisores/hide/:id", verificarAutenticacion, tablasBase.hideSupervisor);

app.get("/api/areas", verificarAutenticacion, tablasBase.getAreas);
app.get("/api/areas/:id", verificarAutenticacion, tablasBase.getAreaById);
app.post("/api/areas", verificarAutenticacion, tablasBase.createArea);
app.put("/api/areas/:id", verificarAutenticacion, tablasBase.updateArea);
app.delete("/api/areas/:id", verificarAutenticacion, tablasBase.deleteArea);

app.get("/api/usuarios/:id", verificarAutenticacion, tablasBase.getUsuarioById);

app.use("/api", verificarAutenticacion, autorizacionesEstatusRouter);
app.use('/api', detectarDispositivoRouter);
app.use("/api", verificarAutenticacion, permisoVistaRouter);

// Endpoint de estado de la aplicación
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
