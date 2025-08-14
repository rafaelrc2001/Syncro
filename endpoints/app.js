const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para obtener todas las categorías
app.get('/api/categorias', async (req, res) => {
  try {
    const result = await db.query('SELECT id_categoria as id, nombre FROM categorias_seguridad');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

// Ruta para crear una nueva categoría
app.post('/api/categorias', async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO categorias_seguridad(nombre) VALUES($1) RETURNING id_categoria as id, nombre',
      [nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear categoría:', err);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
});

// Ruta para actualizar una categoría
app.put('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const result = await db.query(
      'UPDATE categorias_seguridad SET nombre = $1 WHERE id_categoria = $2 RETURNING id_categoria as id, nombre',
      [nombre, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar categoría:', err);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
});

// Ruta para eliminar una categoría
app.delete('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM categorias_seguridad WHERE id_categoria = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

// Ruta de diagnóstico
app.get('/api/diagnostico', async (req, res) => {
  try {
    // 1. Verificar conexión a la base de datos
    await db.query('SELECT NOW()');
    
    // 2. Verificar si la tabla areas existe
    const tableExists = await db.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public' 
        AND    table_name   = 'areas'
      )`
    );
    
    if (!tableExists.rows[0].exists) {
      return res.json({
        conexion: 'OK',
        tabla: 'areas NO EXISTE',
        mensaje: 'La tabla areas no existe en la base de datos.'
      });
    }
    
    // 3. Obtener estructura de la tabla
    const structure = await db.query(
      `SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_name = 'areas'`
    );
    
    // 4. Contar registros
    const count = await db.query('SELECT COUNT(*) FROM areas');
    
    // 5. Obtener algunos registros (máximo 5)
    const sample = await db.query('SELECT * FROM areas LIMIT 5');
    
    res.json({
      conexion: 'OK',
      tabla: 'areas EXISTE',
      estructura: structure.rows,
      total_registros: parseInt(count.rows[0].count),
      registros_ejemplo: sample.rows,
      variables_entorno: {
        db_name: process.env.DB_NAME,
        db_user: process.env.DB_USER,
        db_host: process.env.DB_HOST,
        db_port: process.env.DB_PORT
      }
    });
    
  } catch (error) {
    console.error('Error en diagnóstico:', error);
    res.status(500).json({
      conexion: 'ERROR',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Diagnóstico disponible en: http://localhost:3000/api/diagnostico');
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++AREAS++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Ruta para obtener todas las áreas
app.get('/api/areas', async (req, res) => {
  try {
    console.log('Obteniendo todas las áreas...');
    const result = await db.query('SELECT id_area as id, nombre FROM areas');
    console.log('Áreas encontradas:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener áreas:', err);
    res.status(500).json({ error: 'Error al obtener las áreas' });
  }
});

// Obtener un área por ID
app.get('/api/areas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Obteniendo área con ID: ${id}`);
    const result = await db.query('SELECT id_area as id, nombre FROM areas WHERE id_area = $1', [id]);
    
    if (result.rows.length === 0) {
      console.log('Área no encontrada');
      return res.status(404).json({ error: 'Área no encontrada' });
    }
    
    console.log('Área encontrada:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener el área:', err);
    res.status(500).json({ error: 'Error al obtener el área' });
  }
});

// Ruta para crear una nueva área
app.post('/api/areas', async (req, res) => {
  console.log('Body recibido:', req.body); // Ver el body completo
  const { nombre } = req.body;
  
  if (!nombre) {
    console.log('Error: Nombre no proporcionado');
    return res.status(400).json({ error: 'El nombre del área es requerido' });
  }
  
  try {
    console.log('Intentando insertar área:', nombre);
    const query = 'INSERT INTO areas(nombre) VALUES($1) RETURNING id_area as id, nombre';
    console.log('Query a ejecutar:', query, 'con valores:', [nombre]);
    
    const result = await db.query(query, [nombre]);
    console.log('Resultado de la inserción:', result.rows[0]);
    
    // Verificar si la tabla realmente tiene datos
    const checkQuery = await db.query('SELECT * FROM areas');
    console.log('Contenido actual de la tabla areas:', checkQuery.rows);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear área:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Error al crear el área',
      details: err.message 
    });
  }
});

// Ruta para actualizar un área
app.put('/api/areas/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  
  console.log('Actualizando área ID:', id, 'con datos:', { nombre });
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del área es requerido' });
  }
  
  try {
    const result = await db.query(
      'UPDATE areas SET nombre = $1 WHERE id_area = $2 RETURNING id_area as id, nombre',
      [nombre, id]
    );
    
    console.log('Resultado de la actualización:', result.rows[0]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Área no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar área:', {
      message: err.message,
      code: err.code,
      detail: err.detail
    });
    res.status(500).json({ 
      error: 'Error al actualizar el área',
      details: err.message 
    });
  }
});

// Ruta para eliminar un área
app.delete('/api/areas/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Solicitud para eliminar área ID:', id);
  
  try {
    console.log('Ejecutando DELETE en la base de datos...');
    const result = await db.query(
      'DELETE FROM areas WHERE id_area = $1 RETURNING id_area as id, nombre',
      [id]
    );
    
    console.log('Resultado de la eliminación:', result.rows[0]);
    
    if (result.rowCount === 0) {
      console.log('No se encontró el área con ID:', id);
      return res.status(404).json({ error: 'Área no encontrada' });
    }
    
    // Verificar si la tabla realmente se actualizó
    const remainingAreas = await db.query('SELECT * FROM areas');
    console.log('Áreas restantes en la base de datos:', remainingAreas.rows);
    
    res.json({ 
      message: 'Área eliminada correctamente',
      deleted: result.rows[0]
    });
  } catch (err) {
    console.error('Error al eliminar área:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack
    });
    
    // Verificar si es un error de restricción de clave foránea
    if (err.code === '23503') {
      return res.status(400).json({ 
        error: 'No se puede eliminar el área porque tiene registros relacionados',
        details: err.detail
      });
    }
    
    res.status(500).json({ 
      error: 'Error al eliminar el área',
      details: err.message 
    });
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++SUCURSALES++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Ruta para obtener todas las sucursales
app.get('/api/sucursales', async (req, res) => {
  try {
    const result = await db.query('SELECT id_area as id, nombre FROM sucursales');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener sucursales:', err);
    res.status(500).json({ error: 'Error al obtener las sucursales' });
  }
});

// Obtener una sucursal por ID
app.get('/api/sucursales/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT id_area as id, nombre FROM sucursales WHERE id_area = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sucursal no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener la sucursal:', err);
    res.status(500).json({ error: 'Error al obtener la sucursal' });
  }
});

// Ruta para crear una nueva sucursal
app.post('/api/sucursales', async (req, res) => {
  const { nombre } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la sucursal es requerido' });
  }
  
  try {
    const query = 'INSERT INTO sucursales(nombre) VALUES($1) RETURNING id_area as id, nombre';
    const result = await db.query(query, [nombre]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear sucursal:', {
      message: err.message,
      code: err.code,
      detail: err.detail
    });
    res.status(500).json({ 
      error: 'Error al crear la sucursal',
      details: err.message 
    });
  }
});

// Ruta para actualizar una sucursal
app.put('/api/sucursales/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la sucursal es requerido' });
  }
  
  try {
    const result = await db.query(
      'UPDATE sucursales SET nombre = $1 WHERE id_area = $2 RETURNING id_area as id, nombre',
      [nombre, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Sucursal no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar sucursal:', {
      message: err.message,
      code: err.code,
      detail: err.detail
    });
    res.status(500).json({ 
      error: 'Error al actualizar la sucursal',
      details: err.message 
    });
  }
});

// Ruta para eliminar una sucursal
app.delete('/api/sucursales/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query(
      'DELETE FROM sucursales WHERE id_area = $1 RETURNING id_area as id, nombre',
      [id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Sucursal no encontrada' });
    }
    
    res.json({ 
      message: 'Sucursal eliminada correctamente',
      deleted: result.rows[0]
    });
  } catch (err) {
    console.error('Error al eliminar sucursal:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack
    });
    
    if (err.code === '23503') {
      return res.status(400).json({ 
        error: 'No se puede eliminar la sucursal porque tiene registros relacionados',
        details: err.detail
      });
    }
    
    res.status(500).json({ 
      error: 'Error al eliminar la sucursal',
      details: err.message 
    });
  }
});


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++DEPARTAMENTOS+++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Obtener todos los departamentos
app.get('/api/departamentos', async (req, res) => {
  try {
    const result = await db.query('SELECT id_departamento as id, nombre, correo, extension FROM departamentos');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener departamentos:', err);
    res.status(500).json({ error: 'Error al obtener los departamentos' });
  }
});

// Obtener un departamento por ID
app.get('/api/departamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT id_departamento as id, nombre, correo, extension FROM departamentos WHERE id_departamento = $1', 
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener el departamento:', err);
    res.status(500).json({ error: 'Error al obtener el departamento' });
  }
});

// Crear un nuevo departamento
app.post('/api/departamentos', async (req, res) => {
  const { nombre, correo, extension, contraseña } = req.body;
  
  if (!nombre || !contraseña) {
    return res.status(400).json({ error: 'El nombre y la contraseña son campos requeridos' });
  }
  
  try {
    const query = `
      INSERT INTO departamentos(nombre, correo, extension, contraseña) 
      VALUES($1, $2, $3, $4) 
      RETURNING id_departamento as id, nombre, correo, extension
    `;
    
    const result = await db.query(query, [nombre, correo || null, extension || null, contraseña]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear departamento:', {
      message: err.message,
      code: err.code,
      detail: err.detail
    });
    res.status(500).json({ 
      error: 'Error al crear el departamento',
      details: err.message 
    });
  }
});

// Actualizar un departamento
app.put('/api/departamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, extension, contraseña } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del departamento es requerido' });
  }
  
  try {
    let query;
    let params;
    
    if (contraseña) {
      query = `
        UPDATE departamentos 
        SET nombre = $1, correo = $2, extension = $3, contraseña = $4 
        WHERE id_departamento = $5 
        RETURNING id_departamento as id, nombre, correo, extension
      `;
      params = [nombre, correo || null, extension || null, contraseña, id];
    } else {
      query = `
        UPDATE departamentos 
        SET nombre = $1, correo = $2, extension = $3 
        WHERE id_departamento = $4 
        RETURNING id_departamento as id, nombre, correo, extension
      `;
      params = [nombre, correo || null, extension || null, id];
    }
    
    const result = await db.query(query, params);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar departamento:', {
      message: err.message,
      code: err.code,
      detail: err.detail
    });
    res.status(500).json({ 
      error: 'Error al actualizar el departamento',
      details: err.message 
    });
  }
});

// Eliminar un departamento
app.delete('/api/departamentos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query(
      'DELETE FROM departamentos WHERE id_departamento = $1 RETURNING id_departamento as id, nombre',
      [id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }
    
    res.json({ 
      message: 'Departamento eliminado correctamente',
      deleted: result.rows[0]
    });
  } catch (err) {
    console.error('Error al eliminar departamento:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack
    });
    
    if (err.code === '23503') {
      return res.status(400).json({ 
        error: 'No se puede eliminar el departamento porque tiene registros relacionados',
        details: err.detail
      });
    }
    
    res.status(500).json({ 
      error: 'Error al eliminar el departamento',
      details: err.message 
    });
  }
});


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++SUPERVISORES++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Obtener todos los supervisores
app.get('/api/supervisores', async (req, res) => {
  try {
    const result = await db.query('SELECT id_supervisor as id, nombre, correo, extension FROM supervisores');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener supervisores:', err);
    res.status(500).json({ error: 'Error al obtener los supervisores' });
  }
});

// Obtener un supervisor por ID
app.get('/api/supervisores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT id_supervisor as id, nombre, correo, extension FROM supervisores WHERE id_supervisor = $1', 
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supervisor no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener el supervisor:', err);
    res.status(500).json({ error: 'Error al obtener el supervisor' });
  }
});

// Crear un nuevo supervisor
app.post('/api/supervisores', async (req, res) => {
  const { nombre, correo, extension, contraseña } = req.body;
  
  if (!nombre || !contraseña) {
    return res.status(400).json({ error: 'El nombre y la contraseña son campos requeridos' });
  }
  
  try {
    const query = `
      INSERT INTO supervisores(nombre, correo, extension, contraseña) 
      VALUES($1, $2, $3, $4) 
      RETURNING id_supervisor as id, nombre, correo, extension
    `;
    
    const result = await db.query(query, [nombre, correo || null, extension || null, contraseña]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear supervisor:', {
      message: err.message,
      code: err.code,
      detail: err.detail
    });
    res.status(500).json({ 
      error: 'Error al crear el supervisor',
      details: err.message 
    });
  }
});

// Actualizar un supervisor
app.put('/api/supervisores/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, extension, contraseña } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del supervisor es requerido' });
  }
  
  try {
    let query;
    let params;
    
    if (contraseña) {
      query = `
        UPDATE supervisores 
        SET nombre = $1, correo = $2, extension = $3, contraseña = $4 
        WHERE id_supervisor = $5 
        RETURNING id_supervisor as id, nombre, correo, extension
      `;
      params = [nombre, correo || null, extension || null, contraseña, id];
    } else {
      query = `
        UPDATE supervisores 
        SET nombre = $1, correo = $2, extension = $3 
        WHERE id_supervisor = $4 
        RETURNING id_supervisor as id, nombre, correo, extension
      `;
      params = [nombre, correo || null, extension || null, id];
    }
    
    const result = await db.query(query, params);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Supervisor no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar supervisor:', {
      message: err.message,
      code: err.code,
      detail: err.detail
    });
    res.status(500).json({ 
      error: 'Error al actualizar el supervisor',
      details: err.message 
    });
  }
});

// Eliminar un supervisor
app.delete('/api/supervisores/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query(
      'DELETE FROM supervisores WHERE id_supervisor = $1 RETURNING id_supervisor as id, nombre',
      [id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Supervisor no encontrado' });
    }
    
    res.json({ 
      message: 'Supervisor eliminado correctamente',
      deleted: result.rows[0]
    });
  } catch (err) {
    console.error('Error al eliminar supervisor:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack
    });
    
    if (err.code === '23503') {
      return res.status(400).json({ 
        error: 'No se puede eliminar el supervisor porque tiene registros relacionados',
        details: err.detail
      });
    }
    
    res.status(500).json({ 
      error: 'Error al eliminar el supervisor',
      details: err.message 
    });
  }
});


