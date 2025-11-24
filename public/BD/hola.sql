select * from categorias_seguridad;
select * from areas;
select * from supervisores;
select * from departamentos;
select * from sucursales;


UPDATE departamentos
SET visibilidad = true
WHERE nombre = 'Sistemas';

-- Agregar columna visibilidad a categorias_seguridad
ALTER TABLE categorias_seguridad ADD COLUMN visibilidad BOOLEAN DEFAULT TRUE;

-- Agregar columna visibilidad a areas
ALTER TABLE areas ADD COLUMN visibilidad BOOLEAN DEFAULT TRUE;

-- Agregar columna visibilidad a supervisores
ALTER TABLE supervisores ADD COLUMN visibilidad BOOLEAN DEFAULT TRUE;

-- Agregar columna visibilidad a departamentos
ALTER TABLE departamentos ADD COLUMN visibilidad BOOLEAN DEFAULT TRUE;

-- Agregar columna visibilidad a sucursales
ALTER TABLE sucursales ADD COLUMN visibilidad BOOLEAN DEFAULT TRUE;






ALTER TABLE pt_excavacion 
ADD COLUMN numero_permiso_confinado VARCHAR(50);














24-11-2025
ALTER TABLE pt_no_peligroso
ADD COLUMN verificacion_epp VARCHAR(10),
ADD COLUMN verificacion_herramientas VARCHAR(10),
ADD COLUMN verificacion_observaciones TEXT;






