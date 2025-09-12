// Inicialización de app
// ...existing code...
// Endpoint de login de usuario departamento
//Notas:
//Tengo dos funciones de estatus una mas arrbiba en el codigo y la otra hasta abajo

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");
require("dotenv").config();

const tablasRouter = require("./tablas");
const listasRouter = require("./listas");
const vertablasRouter = require("./vertablas");
const targetasRouter = require("./verformularios");
const verformulariosRouter = require("./loginconsulta");
const autorizacionesEstatusRouter = require("./autorizaciones_estatus");
const formulariosRouter = require("./formularios");
const formularioConfinadosRouter = require("./formulariospt3-10/formulario_confinados");

const loginconsultaRouter = require("./loginconsulta");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS (debe ir antes de cualquier ruta)
const corsOptions = {
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint de login de usuario departamento
app.use("/endpoints", loginconsultaRouter);

// Rutas de la API

app.use("/api", tablasRouter); // Monta las rutas de tablas.js bajo el prefijo /api
app.use("/api", listasRouter); // Monta las rutas de listas.js bajo el prefijo /api
app.use("/api", vertablasRouter); // Monta las rutas de vertablas.js bajo el prefijo /api
app.use("/api", targetasRouter); // Monta las rutas de targetas.js bajo el prefijo /api
app.use("/api", verformulariosRouter); // Monta las rutas de verformularios.js bajo el prefijo /api
app.use("/api", autorizacionesEstatusRouter); // Monta las rutas de autorizaciones_estatus.js bajo el prefijo /api
app.use("/api", formulariosRouter); // Monta las rutas de formularios.js bajo el prefijo /api
app.use("/api", formularioConfinadosRouter); // Monta las rutas de formulario_confinados.js bajo el prefijo /api

// ================= RUTAS DE TABLAS BASE =================
const tablasBase = require("./tablasbase");

// CATEGORIAS
app.get("/api/categorias", tablasBase.getCategorias);
app.post("/api/categorias", tablasBase.createCategoria);
app.put("/api/categorias/:id", tablasBase.updateCategoria);
app.delete("/api/categorias/:id", tablasBase.deleteCategoria);

// AREAS
app.get("/api/areas", tablasBase.getAreas);
app.get("/api/areas/:id", tablasBase.getAreaById);
app.post("/api/areas", tablasBase.createArea);
app.put("/api/areas/:id", tablasBase.updateArea);
app.delete("/api/areas/:id", tablasBase.deleteArea);

// SUCURSALES
app.get("/api/sucursales", tablasBase.getSucursales);
app.get("/api/sucursales/:id", tablasBase.getSucursalById);
app.post("/api/sucursales", tablasBase.createSucursal);
app.put("/api/sucursales/:id", tablasBase.updateSucursal);
app.delete("/api/sucursales/:id", tablasBase.deleteSucursal);

// DEPARTAMENTOS
app.get("/api/departamentos", tablasBase.getDepartamentos);
app.get("/api/departamentos/:id", tablasBase.getDepartamentoById);
app.post("/api/departamentos", tablasBase.createDepartamento);
app.put("/api/departamentos/:id", tablasBase.updateDepartamento);
app.delete("/api/departamentos/:id", tablasBase.deleteDepartamento);

// SUPERVISORES
app.get("/api/supervisores_base", tablasBase.getSupervisores);
app.get("/api/supervisores/:id", tablasBase.getSupervisorById);
app.post("/api/supervisores", tablasBase.createSupervisor);
app.put("/api/supervisores/:id", tablasBase.updateSupervisor);
app.delete("/api/supervisores/:id", tablasBase.deleteSupervisor);

app.get("/api/areas", tablasBase.getAreas);
app.get("/api/areas/:id", tablasBase.getAreaById);
app.post("/api/areas", tablasBase.createArea);
app.put("/api/areas/:id", tablasBase.updateArea);
app.delete("/api/areas/:id", tablasBase.deleteArea);

// Endpoint de estado de la aplicación
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
