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







ALTER TABLE pt_apertura
ADD COLUMN fuera_operacion_nombre VARCHAR(255),
ADD COLUMN despresurizado_purgado_nombre VARCHAR(255),
ADD COLUMN necesita_aislamiento_nombre VARCHAR(255),
ADD COLUMN con_valvulas_nombre VARCHAR(255),
ADD COLUMN con_juntas_ciegas_nombre VARCHAR(255),
ADD COLUMN producto_entrampado_nombre VARCHAR(255),
ADD COLUMN requiere_lavado_nombre VARCHAR(255),
ADD COLUMN requiere_neutralizado_nombre VARCHAR(255),
ADD COLUMN requiere_vaporizado_nombre VARCHAR(255),
ADD COLUMN suspender_trabajos_adyacentes_nombre VARCHAR(255),
ADD COLUMN acordonar_area_nombre VARCHAR(255),
ADD COLUMN prueba_gas_toxico_inflamable_nombre VARCHAR(255),
ADD COLUMN equipo_electrico_desenergizado_nombre VARCHAR(255),
ADD COLUMN tapar_purgas_drenajes_nombre VARCHAR(255);




select * from pt_no_peligroso


select * from tipos_permisos



ALTER TABLE tu_tabla_de_permisos
  ALTER COLUMN nombre TYPE varchar(100);

UPDATE tu_tabla_de_permisos
SET nombre = 'PT para Apertura Equipo Línea'
WHERE id_tipo_permiso = 2;



UPDATE tipos_permisos
SET nombre = 'PT para Apertura Equipo o Línea'
WHERE nombre = 'PT para Apertura Equipo Línea';



select * from pt_electrico


ALTER TABLE pt_apertura
  ADD COLUMN gas_lel VARCHAR(20),
  ADD COLUMN gas_co2 VARCHAR(20),
  ADD COLUMN gas_nh3 VARCHAR(20),
  ADD COLUMN gas_oxigeno VARCHAR(20);



SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'pt_electrico' 
AND (COLUMN_NAME LIKE '%verifico%' OR COLUMN_NAME LIKE '%verific%')
ORDER BY COLUMN_NAME;



ALTER TABLE pt_electrico
ALTER COLUMN verifico_identifico_equipo TYPE VARCHAR(150),
ALTER COLUMN verifico_fuera_operacion_desenergizado TYPE VARCHAR(150),
ALTER COLUMN verifico_candado_etiqueta TYPE VARCHAR(150),
ALTER COLUMN verifico_suspender_adyacentes TYPE VARCHAR(150),
ALTER COLUMN verifico_area_limpia_libre_obstaculos TYPE VARCHAR(150),
ALTER COLUMN verifico_libranza_electrica TYPE VARCHAR(150);



ALTER TABLE pt_electrico
ALTER COLUMN verifico_identifico_equipo TYPE VARCHAR(150),
ALTER COLUMN verifico_fuera_operacion_desenergizado TYPE VARCHAR(150),
ALTER COLUMN verifico_candado_etiqueta TYPE VARCHAR(150),
ALTER COLUMN verifico_suspender_adyacentes TYPE VARCHAR(150),
ALTER COLUMN verifico_area_limpia_libre_obstaculos TYPE VARCHAR(150),
ALTER COLUMN verifico_libranza_electrica TYPE VARCHAR(150);



  ALTER TABLE pt_radiacion 
ADD COLUMN observaciones TEXT;


select * from pt_radiacion



ALTER TABLE pt_excavacion
add columns numero_permiso_confinado TYPE VARCHAR(50)




  ALTER TABLE pt_excavacion
ADD COLUMN numero_permiso_confinado VARCHAR(50);


