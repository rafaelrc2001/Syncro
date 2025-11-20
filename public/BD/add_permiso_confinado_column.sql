-- Agregar la columna numero_permiso_confinado a la tabla pt_excavacion
-- Esta columna almacenará el número del permiso de espacio confinado cuando aplique

ALTER TABLE pt_excavacion 
ADD COLUMN numero_permiso_confinado VARCHAR(50);

-- Agregar comentario a la columna para documentación
COMMENT ON COLUMN pt_excavacion.numero_permiso_confinado IS 'Número del permiso de espacio confinado cuando la excavación se considera como tal';