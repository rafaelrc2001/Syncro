-- Tabla: categorias_seguridad
-- Descripción: Catálogo de categorías de seguridad aplicables a los trabajos.
-- Funcionalidad: Clasifica los permisos según el nivel de riesgo o medidas de seguridad requeridas.
CREATE TABLE categorias_seguridad (
    id_categoria INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);


-- Tabla: areas
-- Descripción: Registra las áreas físicas o funcionales dentro de la organización.
-- Funcionalidad: Facilita la identificación y localización donde se realizarán los trabajos solicitados en los permisos.
CREATE TABLE areas (
    id_area INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);




-- Tabla: sucursales
-- Descripción: Almacena las diferentes sucursales o ubicaciones físicas de la empresa.
-- Funcionalidad: Permite clasificar los permisos de trabajo según la ubicación donde se ejecutarán.
CREATE TABLE sucursales (
   id_sucursal INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);


-- Tabla: departamentos
-- Descripción: Contiene información sobre los departamentos de la organización.
-- Funcionalidad: Permite gestionar y organizar los diferentes departamentos que solicitan permisos de trabajo, con sus datos de contacto y autenticación.
CREATE TABLE departamentos (
    id_departamento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100),
    "extension" VARCHAR(20),
    contraseña VARCHAR(255) NOT NULL
);



-- Tabla: supervisores
-- Descripción: Contiene la información de los supervisores autorizados.
-- Funcionalidad: Gestiona los usuarios con rol de supervisor que pueden autorizar permisos de trabajo, incluyendo sus credenciales de acceso.
CREATE TABLE supervisores (
    id_supervisor INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100),
    "extension" VARCHAR(20),
    contraseña VARCHAR(255) NOT NULL
);





-- Tabla: tipos_permisos
-- Descripción: Almacena los diferentes tipos de permisos de trabajo disponibles en el sistema.
-- Funcionalidad: Sirve como catálogo de clasificación para los permisos de trabajo (ej: permiso no peligroso, permiso de equipo en línea, etc.).
CREATE TABLE tipos_permisos (
    id_tipo_permiso INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);









-- Tabla: estatus 
-- Descripción: Catálogo de posibles estados de los registros en el sistema.
-- Funcionalidad: Permite gestionar el ciclo de vida de los permisos y participantes (ej: pendiente, aprobado, rechazado, completado).
CREATE TABLE estatus (
    id_estatus INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    estatus VARCHAR(100) NOT NULL
);




-- Tabla: autorizaciones
-- Tiene FK's de supervisores y categorias
-- Descripción: Registra las autorizaciones emitidas por supervisores para permisos de trabajo.
-- Funcionalidad: Relaciona supervisores con categorías de seguridad y establece el responsable del área para cada autorización.
CREATE TABLE autorizaciones (
    id_autorizacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	 id_permiso INT ,
    id_supervisor INT ,  -- Cambiado a INT para que coincida
    id_categoria  INT ,
    responsable_area  VARCHAR(100),
    FOREIGN KEY (id_supervisor) REFERENCES supervisores(id_supervisor),
    FOREIGN KEY (id_categoria) REFERENCES categorias_seguridad(id_categoria),
	FOREIGN KEY (id_permiso) REFERENCES categorias_seguridad( id_permiso)
	
);





-- Tabla: ast_participan 
-- Descripción: Almacena información sobre los participantes en los Análisis de Seguridad en el Trabajo (AST).
-- Funcionalidad: Registra el personal involucrado en actividades con permisos, sus credenciales, funciones y estado de participación.
CREATE TABLE ast_participan (
    id_ast_participan INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nombre VARCHAR(250),
	credencial VARCHAR(100),
	cargo VARCHAR(100),
	funcion VARCHAR(50),	
	id_estatus INT NOT NULL,
	FOREIGN KEY (id_estatus) REFERENCES estatus(id_estatus)
);

-- Tabla: ast
-- Descripción: Contiene los Análisis de Seguridad en el Trabajo (AST) asociados a permisos.
-- Funcionalidad: Almacena información sobre equipos de protección, maquinaria y materiales requeridos para trabajos con permisos. 
CREATE TABLE ast (
    id_ast INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    epp TEXT,
    maquinaria_equipo_herramientas TEXT,
    materiales_accesorios TEXT
);




select * from categorias_seguridad --1
select * from areas --2
select * from sucursales  --3
select * from departamentos  --4
select * from tipos_permisos  --5
select * from supervisores  --6
select * from estatus  --7  BIEN!!
select * from autorizaciones  --8
select * from ast_participan --9  
select * from ast --10
select * from ast_actividades --11 ESTA FALTA
select * from permisos_trabajo --12 
select * from pt_no_peligroso -- 13


-- Tabla: ast_actividades
-- Descripción: Detalla las actividades específicas dentro de un Análisis de Seguridad en el Trabajo.
-- Funcionalidad: Permite desglosar trabajos complejos en actividades secuenciales con sus riesgos y medidas preventivas correspondientes.
CREATE TABLE ast_actividades (
    id_ast_actividades INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ast INT NOT NULL,
	num_actividad VARCHAR(5),
	secuencia_actividad VARCHAR(50),
	personal_ejecutor VARCHAR(150),
	peligros_potenciales VARCHAR(350),
	acciones_preventivas VARCHAR(350),
	responsable VARCHAR(150),
	FOREIGN KEY (id_ast) REFERENCES permisos_trabajo(id_ast)
);



-- Tabla: permisos_trabajo
-- Descripción: Tabla principal que registra todos los permisos de trabajo solicitados.
-- Funcionalidad: Centraliza la información de permisos, relacionando áreas, departamentos, tipos de permiso, estatus y análisis de seguridad correspondientes.
CREATE TABLE permisos_trabajo (
    id_permiso INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_area INT NOT NULL,
    id_departamento INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_tipo_permiso INT NOT NULL,
    id_estatus INT NOT NULL,
	id_autorizacion INT NOT NULL,
    FOREIGN KEY (id_area) REFERENCES areas(id_area),
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
    FOREIGN KEY (id_tipo_permiso) REFERENCES tipos_permisos(id_tipo_permiso),
    FOREIGN KEY (id_estatus) REFERENCES estatus(id_estatus),
	FOREIGN KEY  (id_autorizacion) REFERENCES autorizaciones(id_autorizacion)
   
);


-- Tabla: pt_no_peligroso
-- Descripción: Almacena información específica para permisos de trabajo no peligrosos.
-- Funcionalidad: Extiende la información de permisos_trabajo con detalles técnicos y operacionales para trabajos de bajo riesgo.
CREATE TABLE pt_no_peligroso (
    id_ptnp INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_permiso INT NOT NULL,
    nombre_solicitante VARCHAR(100) NOT NULL,
	descripcion_trabajo VARCHAR(350) NOT NULL,
	tipo_mantenimiento VARCHAR(50) NOT NULL,
	ot_no VARCHAR(50),
	equipo_intervencion VARCHAR(100) NOT NULL,
	hora_inicio TIMESTAMP NOT NULL,
	tag VARCHAR(50),
	fluido VARCHAR(50),
	presion VARCHAR(20),
	temperatura VARCHAR(20),
	FOREIGN KEY (id_permiso) REFERENCES permisos_trabajo(id_permiso)
);









-- Tabla: pt_equipo_linea
-- Descripción: Contiene información detallada para permisos de trabajo en equipos en línea o peligrosos.
-- Funcionalidad: Extiende permisos_trabajo con exhaustivas medidas de seguridad, condiciones operativas y protocolos para trabajos de alto riesgo.
CREATE TABLE pt_equipo_linea (
    id_ptel VARCHAR(50) PRIMARY KEY,
	id_permiso VARCHAR(50),
	nombre_solicitante VARCHAR(100) NOT NULL,
	tipo_mantenimiento VARCHAR(50) NOT NULL,
	ot_no VARCHAR(50),
	equipo_intervencion VARCHAR(100) NOT NULL,
	hora_inicio TIMESTAMP NOT NULL,
	tag VARCHAR(50),
	descripcion_trabajo VARCHAR(350) NOT NULL,
	fluido VARCHAR(50),
	presion VARCHAR(20),
	temperatura VARCHAR(20),
	antecedentes VARCHAR(320),
	equipo_fuera_operación  VARCHAR(320),
	despresionado_purgado VARCHAR(320),
    necesita_aislamiento VARCHAR(5),
    con_valvulas VARCHAR(5),
    con_juntas_ciegas VARCHAR(5),
    producto_entrampado VARCHAR(5),
    requiere_lavado VARCHAR(5),
    requiere_neutralizado VARCHAR(5),
    requiere_vaporizado VARCHAR(5),
    suspender_trabajos_adyacentes VARCHAR(5),
    acordonar_area VARCHAR(5),
    prueba_gas_toxico_inflamable VARCHAR(5),
    equipo_electrico_desenergizado VARCHAR(5),
    tapar_purgas_drenajes VARCHAR(5),
    porcentaje_co2 VARCHAR(5),
    porcentaje_amoniaco VARCHAR(5),
    porcentaje_oxigeno VARCHAR(5),
    porcentaje_explosividad VARCHAR(5),
    observaciones TEXT,
	FOREIGN KEY (id_permiso) REFERENCES permisos_trabajo(id_permiso)
);





select * from estatus  --7  27
select * from autorizaciones  --8 28
select * from ast_participan --9  13
select * from ast --10 14
select * from ast_actividades --1
select * from permisos_trabajo --27 
select * from pt_no_peligroso -- 23


