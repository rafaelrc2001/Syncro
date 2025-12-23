const express = require("express");
const router = express.Router();
const db = require("./database");

// Endpoint para obtener el nombre del departamento por id
router.get("/departamento/nombre", async (req, res) => {
  const id_departamento = parseInt(req.query.id_departamento, 10);
  if (!Number.isInteger(id_departamento) || id_departamento <= 0) {
    return res.status(400).json({ error: "id_departamento inválido" });
  }
  try {
    const result = await db.query(
      "SELECT nombre FROM departamentos WHERE id_departamento = $1 LIMIT 1",
      [id_departamento]
    );
    if (result.rows && result.rows.length > 0) {
      res.json({ nombre: result.rows[0].nombre });
    } else {
      res.json({ nombre: "" });
    }
  } catch (err) {
    console.error("Error al consultar nombre de departamento:", err);
    res.status(500).json({ error: "Error en la consulta" });
  }
});

// Endpoint para obtener todas las sucursales
// Endpoint para obtener todas las sucursales
// Endpoint para obtener todas las sucursales
router.get("/sucursales", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id_sucursal, nombre FROM sucursales WHERE visibilidad = true ORDER BY nombre ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener sucursales:", err);
    res.status(500).json({ error: "Error al obtener sucursales" });
  }
});

// Endpoint para obtener todas las áreas
// Endpoint para obtener todas las áreas
// Endpoint para obtener todas las áreas
router.get("/areas", async (req, res) => {
  try {
    // Solo áreas visibles y con relaciones visibles
    const result = await db.query(
      `SELECT a.id_area, a.nombre
      FROM areas a
      INNER JOIN departamentos d ON a.id_departamento = d.id_departamento AND d.visibilidad = true
      -- JOIN eliminado: no existe relación directa entre áreas y sucursales
      -- JOIN eliminado: no existe relación directa entre áreas y categorias_seguridad
      WHERE a.visibilidad = true
      ORDER BY a.nombre ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener áreas:", err);
    res.status(500).json({ error: "Error al obtener áreas" });
  }
});

// (Endpoint /participantes eliminado a petición del usuario)

// Endpoint para obtener todos los departamentos
// Endpoint para obtener todos los departamentos
// Endpoint para obtener todos los departamentos
router.get("/departamentos", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id_departamento, nombre FROM departamentos WHERE visibilidad = true ORDER BY nombre ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener departamentos:", err);
    res.status(500).json({ error: "Error al obtener departamentos" });
  }
});

// Endpoint para obtener el correo a partir del id_area
// Endpoint para obtener el correo a partir del id_area
// Endpoint para obtener el correo a partir del id_area
// Endpoint para obtener el correo a partir del id_area
// Endpoint para obtener el correo a partir del id_area
router.get("/correo-area", async (req, res) => {
  const id_area = parseInt(req.query.id_area, 10);
  if (!Number.isInteger(id_area) || id_area <= 0) {
    return res.status(400).json({ error: "id_area inválido" });
  }
  try {
    const result = await db.query(
      `
      SELECT a.id_area, d.correo
      FROM areas a
      INNER JOIN departamentos d ON a.id_departamento = d.id_departamento
      WHERE a.id_area = $1
    `,
      [id_area]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "No se encontró el área o el correo" });
    }
  } catch (err) {
    console.error("Error al obtener correo por área:", err);
    res.status(500).json({ error: "Error al obtener correo por área" });
  }
});

// Endpoint para obtener todos los supervisores
// Endpoint para obtener todos los supervisores
// Endpoint para obtener todos los supervisores
router.get("/supervisores", async (req, res) => {
  try {
    // Solo supervisores visibles y con relaciones visibles
    const result = await db.query(
      `SELECT s.id_supervisor, s.nombre
      FROM supervisores s
      WHERE s.visibilidad = true
      ORDER BY s.nombre ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener supervisores:", err);
    res.status(500).json({ error: "Error al obtener supervisores" });
  }
});

// Endpoint para obtener todos las categorias
// Endpoint para obtener todos los categorias
// Endpoint para obtener todos los categorias
router.get("/categorias", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id_categoria, nombre FROM categorias_seguridad WHERE visibilidad = true ORDER BY nombre ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener categorias:", err);
    res.status(500).json({ error: "Error al obtener categorias" });
  }
});

// Endpoint para obtener correo apartir del nombre del dptoartamento
// Endpoint para obtener correo apartir del nombre del dptoartamento
// Endpoint para obtener correo apartir del nombre del dptoartamento

router.get("/buscar_departamentos/correo", async (req, res) => {
  const nombre = req.query.nombre;
  if (!nombre) {
    return res.status(400).json({ error: "Falta el parámetro nombre" });
  }
  try {
    const result = await db.query(
      "SELECT correo FROM departamentos WHERE nombre = $1 LIMIT 1",
      [nombre]
    );
    if (result.rows && result.rows.length > 0) {
      res.json({ correo: result.rows[0].correo });
    } else {
      res.json({ correo: "" });
    }
  } catch (err) {
    console.error("Error al consultar correo de departamento:", err);
    res.status(500).json({ error: "Error en la consulta" });
  }
});

module.exports = router;
