
const express = require("express");
const router = express.Router();
const pool = require("./database");
// Endpoint para exportar datos detallados para supervisores
router.get("/exportar-supervisor", async (req, res) => {
  try {
    // Consulta SQL base
    let sql = `
SELECT 
    
    pt.prefijo,
    pt.fecha_hora,
    pt.hora_inicio,
    d.nombre AS id_departamento,
    pt.id_area,
    s.nombre AS id_sucursal,
    pt.descripcion_trabajo,
    e.estatus,
    e.subestatus,
    e.comentarios, 
    pt.contrato,
    pt.tipo_mantenimiento,
    pt.ot_numero,
    pt.tag,
    pt.equipo_intervenir,
    pt.nombre_solicitante,
    pt.empresa,
    pt.nombre_departamento
FROM permisos_trabajo pt
LEFT JOIN departamentos d ON pt.id_departamento = d.id_departamento
LEFT JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
LEFT JOIN usuarios u ON pt.id_usuario = u.id_usuario
LEFT JOIN estatus e ON pt.id_permiso = e.id_permiso
ORDER BY pt.id_permiso;
    `;

    // Ejecutar la consulta y obtener los resultados
    const result = await pool.query(sql);

    // Debug opcional
    if (process.env.EXPORT_DEBUG === "1") {
      console.log(`exportar-supervisor: returned ${result.rows.length} rows`);
      if (result.rows.length > 0) {
        console.log(
          "exportar-supervisor: sample columns=",
          Object.keys(result.rows[0])
        );
      }
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error en exportar-supervisor:", error);
    res.status(500).json({ error: "Error al exportar datos para supervisor" });
  }
});

module.exports = router;



// Endpoint para exportar datos detallados filtrados por departamento (autorizar)
router.get("/exportar-autorizar-departamento/:id_departamento", async (req, res) => {
  try {
    const { id_departamento } = req.params;
    const params = [];

    // Validar que el parámetro sea un número
    const idDeptoInt = parseInt(id_departamento, 10);
    if (isNaN(idDeptoInt)) {
      return res.status(400).json({ error: "id_departamento debe ser un número válido" });
    }

    let sql = `
  SELECT 
    pt.prefijo,
    pt.fecha_hora,
    pt.hora_inicio,
    d.nombre AS id_departamento,
    pt.id_area,
    s.nombre AS id_sucursal,
    pt.descripcion_trabajo,
    e.estatus,
    e.subestatus,
    e.comentarios, 
    pt.contrato,
    pt.tipo_mantenimiento,
    pt.ot_numero,
    pt.tag,
    pt.equipo_intervenir,
    pt.nombre_solicitante,
    pt.empresa,
    pt.nombre_departamento
  FROM permisos_trabajo pt
  LEFT JOIN departamentos d ON pt.id_departamento = d.id_departamento
  LEFT JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
  LEFT JOIN usuarios u_creador ON pt.id_usuario = u_creador.id_usuario
  LEFT JOIN estatus e ON pt.id_permiso = e.id_permiso
  WHERE pt.id_departamento = $1
  ORDER BY pt.fecha_hora DESC, pt.id_permiso;
    `;

    params.push(idDeptoInt);
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en exportar-autorizar:", error);
    res.status(500).json({ error: "Error al exportar datos para autorizar" });
  }
});




// Endpoint para exportar datos detallados filtrados por departamento (autorizar)
router.get("/exportar-crear-usuario/:id_usuario", async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const params = [];

    // Validar que el parámetro sea un número
    const idUsuarioInt = parseInt(id_usuario, 10);
    if (isNaN(idUsuarioInt)) {
      return res.status(400).json({ error: "id_usuario debe ser un número válido" });
    }

    let sql = `
SELECT 
    

    pt.prefijo,
    pt.fecha_hora,
    pt.hora_inicio,
    d.nombre AS id_departamento,
    pt.id_area,
    s.nombre AS id_sucursal,
    pt.descripcion_trabajo,
    e.estatus,
    e.subestatus,
    e.comentarios, 
    pt.contrato,
    pt.tipo_mantenimiento,
    pt.ot_numero,
    pt.tag,
    pt.equipo_intervenir,
    pt.nombre_solicitante,
    pt.empresa,
    pt.nombre_departamento
FROM permisos_trabajo pt
LEFT JOIN departamentos d ON pt.id_departamento = d.id_departamento
LEFT JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
LEFT JOIN usuarios u ON pt.id_usuario = u.id_usuario
LEFT JOIN estatus e ON pt.id_permiso = e.id_permiso
WHERE pt.id_usuario = $1
ORDER BY pt.fecha_hora DESC;
    `;

    params.push(idUsuarioInt);
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en exportar-crear-usuario:", error);
    res.status(500).json({ error: "Error al exportar datos para crear" });
  }
});



// Endpoint alternativo para exportar datos detallados filtrados por departamento (autorizar) con ruta /exportar-autorizar/:id_departamento
router.get("/exportar-autorizar/:id_departamento", async (req, res) => {
  try {
    const { id_departamento } = req.params;
    const params = [];

    // Validar que el parámetro sea un número
    const idDeptoInt = parseInt(id_departamento, 10);
    if (isNaN(idDeptoInt)) {
      return res.status(400).json({ error: "id_departamento debe ser un número válido" });
    }

    let sql = `
  
SELECT 
    pt.prefijo,
    pt.fecha_hora,
    pt.hora_inicio,
    d.nombre AS id_departamento,
    pt.id_area,
    s.nombre AS id_sucursal,
    pt.descripcion_trabajo,
    e.estatus,
    e.subestatus,
    e.comentarios, 
    pt.contrato,
    pt.tipo_mantenimiento,
    pt.ot_numero,
    pt.tag,
    pt.equipo_intervenir,
    pt.nombre_solicitante,
    pt.empresa,
    pt.nombre_departamento
FROM usuarios u_filtro
INNER JOIN departamentos d_filtro ON u_filtro.departamento = d_filtro.nombre  
INNER JOIN permisos_trabajo pt ON d_filtro.id_departamento = pt.id_departamento
LEFT JOIN departamentos d ON pt.id_departamento = d.id_departamento
LEFT JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
LEFT JOIN usuarios u_creador ON pt.id_usuario = u_creador.id_usuario
LEFT JOIN estatus e ON pt.id_permiso = e.id_permiso
WHERE u_filtro.id_usuario = $1 
ORDER BY pt.fecha_hora DESC, pt.id_permiso;

    `;

    params.push(idDeptoInt);
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en exportar-autorizar (api):", error);
    res.status(500).json({ error: "Error al exportar datos para autorizar (api)" });
  }
});