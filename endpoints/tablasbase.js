
const db = require('./database');

// ================= CATEGORIAS =================
exports.getCategorias = async (req, res) => {
  try {
    const result = await db.query('SELECT id_categoria as id, nombre FROM categorias_seguridad');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

exports.createCategoria = async (req, res) => {
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
};

exports.updateCategoria = async (req, res) => {
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
};

exports.deleteCategoria = async (req, res) => {
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
};

// ================= AREAS =================
exports.getAreas = async (req, res) => {
  try {
    const result = await db.query('SELECT id_area as id, nombre FROM areas');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener áreas:', err);
    res.status(500).json({ error: 'Error al obtener las áreas' });
  }
    try {
      const result = await db.query('SELECT id_area as id, nombre, id_departamento FROM areas');
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener áreas:', err);
      res.status(500).json({ error: 'Error al obtener las áreas' });
    }
};

exports.getAreaById = async (req, res) => {
  const { id } = req.params;
  console.log('[getAreaById] id recibido:', id);
  // Validar que id sea un entero válido
  const idInt = parseInt(id, 10);
  if (isNaN(idInt)) {
    console.warn('[getAreaById] ID de área inválido:', id);
    return res.status(400).json({ error: 'ID de área inválido' });
  }
  try {
    const result = await db.query('SELECT id_area as id, nombre, id_departamento FROM areas WHERE id_area = $1', [idInt]);
    if (result.rows.length === 0) {
      console.warn('[getAreaById] Área no encontrada para id:', idInt);
      return res.status(404).json({ error: 'Área no encontrada' });
    }
    console.log('[getAreaById] Área encontrada:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener el área:', err);
    res.status(500).json({ error: 'Error al obtener el área' });
  }
};

exports.createArea = async (req, res) => {
  const { nombre, id_departamento } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del área es requerido' });
  }
  if (!id_departamento) {
    return res.status(400).json({ error: 'El departamento es requerido' });
  }
  try {
    const query = 'INSERT INTO areas(nombre, id_departamento) VALUES($1, $2) RETURNING id_area as id, nombre, id_departamento';
    const result = await db.query(query, [nombre, id_departamento]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear área:', err);
    res.status(500).json({ error: 'Error al crear el área' });
  }
};

exports.updateArea = async (req, res) => {
  const { id } = req.params;
  const { nombre, id_departamento } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del área es requerido' });
  }
  if (!id_departamento) {
    return res.status(400).json({ error: 'El departamento es requerido' });
  }
  try {
    const result = await db.query(
      'UPDATE areas SET nombre = $1, id_departamento = $2 WHERE id_area = $3 RETURNING id_area as id, nombre, id_departamento',
      [nombre, id_departamento, id]
    );
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
};

exports.deleteArea = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM areas WHERE id_area = $1 RETURNING id_area as id, nombre',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Área no encontrada' });
    }
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
};

// ================= SUCURSALES =================
exports.getSucursales = async (req, res) => {
  try {
    const result = await db.query('SELECT id_sucursal as id, nombre FROM sucursales');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener sucursales:', err);
    res.status(500).json({ error: 'Error al obtener las sucursales' });
  }
};

exports.getSucursalById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT id_sucursal as id, nombre FROM sucursales WHERE id_sucursal = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sucursal no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener la sucursal:', err);
    res.status(500).json({ error: 'Error al obtener la sucursal' });
  }
};

exports.createSucursal = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la sucursal es requerido' });
  }
  try {
    const query = 'INSERT INTO sucursales(nombre) VALUES($1) RETURNING id_sucursal as id, nombre';
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
};

exports.updateSucursal = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la sucursal es requerido' });
  }
  try {
    const result = await db.query(
      'UPDATE sucursales SET nombre = $1 WHERE id_sucursal = $2 RETURNING id_sucursal as id, nombre',
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
};

exports.deleteSucursal = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM sucursales WHERE id_sucursal = $1 RETURNING id_sucursal as id, nombre',
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
};

// ================= DEPARTAMENTOS =================
exports.getDepartamentos = async (req, res) => {
  try {
    const result = await db.query('SELECT id_departamento as id, nombre, correo, extension FROM departamentos');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener departamentos:', err);
    res.status(500).json({ error: 'Error al obtener los departamentos' });
  }
};

exports.getDepartamentoById = async (req, res) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt)) {
    return res.status(400).json({ error: 'ID de departamento inválido' });
  }
  try {
    const result = await db.query(
      'SELECT id_departamento as id, nombre, correo, extension FROM departamentos WHERE id_departamento = $1', 
      [idInt]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener el departamento:', err);
    res.status(500).json({ error: 'Error al obtener el departamento' });
  }
};

exports.createDepartamento = async (req, res) => {
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
};

exports.updateDepartamento = async (req, res) => {
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
};

exports.deleteDepartamento = async (req, res) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt)) {
    return res.status(400).json({ error: 'ID de departamento inválido' });
  }
  try {
    const result = await db.query(
      'DELETE FROM departamentos WHERE id_departamento = $1 RETURNING id_departamento as id, nombre',
      [idInt]
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
};

// ================= SUPERVISORES =================
exports.getSupervisores = async (req, res) => {
  try {
    const result = await db.query('SELECT id_supervisor as id, nombre, correo, extension FROM supervisores');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener supervisores:', err);
    res.status(500).json({ error: 'Error al obtener los supervisores' });
  }
};

exports.getSupervisorById = async (req, res) => {
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
};

exports.createSupervisor = async (req, res) => {
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
};

exports.updateSupervisor = async (req, res) => {
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
};

exports.deleteSupervisor = async (req, res) => {
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
};
