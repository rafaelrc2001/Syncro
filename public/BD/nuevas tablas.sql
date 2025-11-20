CREATE TABLE pt_izaje (
     id SERIAL PRIMARY KEY,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Campos que mencionaste que faltaban
    id_permiso INT,
    tipo_mantenimiento VARCHAR(100),
    ot_numero VARCHAR(100),
    tag VARCHAR(100),
    hora_inicio TIME,
    equipo_intervenir VARCHAR(255),
    descripcion_trabajo TEXT,
    nombre_solicitante VARCHAR(255),
    empresa VARCHAR(255),

    -- datos 1
    hora_inicio_prevista TIME,
    responsable_operacion VARCHAR(255),
    hora_fin_prevista TIME,

    -- datos 2
    empresa_grua VARCHAR(255),
    identificacion_grua VARCHAR(100),
    declaracion_conformidad VARCHAR(5),
    inspeccion_periodica VARCHAR(5),
    mantenimiento_preventivo VARCHAR(5),
    inspeccion_diaria VARCHAR(5),
    diagrama_cargas VARCHAR(5),
    libro_instrucciones VARCHAR(5),
    limitador_carga VARCHAR(5),
    final_carrera VARCHAR(5),

    -- datos 3
    nombre_operador VARCHAR(255),
    empresa_operador VARCHAR(255),
    licencia_operador VARCHAR(5),
    numero_licencia VARCHAR(100),
    fecha_emision_licencia DATE,
    vigencia_licencia VARCHAR(100),
    tipo_licencia VARCHAR(100),
    comentarios_operador TEXT,

    -- datos 4
    estrobos_eslingas VARCHAR(5),
    grilletes VARCHAR(5),
    otros_elementos_auxiliares VARCHAR(5),
    especificacion_otros_elementos VARCHAR(255),
    requiere_eslingado_especifico VARCHAR(5),
    especificacion_eslingado VARCHAR(255),

    -- dato 5
    extension_gatos VARCHAR(5),
    sobre_ruedas VARCHAR(8),
    especificacion_sobre_ruedas VARCHAR(255),
    utiliza_plumin_si VARCHAR(5),
    especificacion_plumin VARCHAR(255),
    longitud_pluma VARCHAR(15),
    radio_trabajo VARCHAR(15),

    -- dato 6
    contrapeso VARCHAR(15),
    sector_trabajo VARCHAR(30),
    carga_segura_diagrama VARCHAR(15),
    peso_carga VARCHAR(15),
    determinada_por VARCHAR(255),
    carga_trabajo VARCHAR(100),

    -- dato 7
    peso_gancho_eslingas VARCHAR(10),
    relacion_carga_carga_segura VARCHAR(10),
    asentamiento VARCHAR(5),
    calzado VARCHAR(5),
    extension_gatos_check VARCHAR(5),
    nivelacion VARCHAR(5),
    contrapeso_check VARCHAR(5),
    sector_trabajo_check VARCHAR(5),
    comprobado_por VARCHAR(255),

    -- ultimos
    balizamiento_operacion VARCHAR(5),
    reunion_previa VARCHAR(5),
    especificacion_reunion_previa VARCHAR(255),
    presentacion_supervisor VARCHAR(5),
    nombre_supervisor VARCHAR(255),
    permiso_adicional VARCHAR(5),
    especificacion_permiso_adicional VARCHAR(255),
    otras_medidas_seguridad VARCHAR(5),
    especificacion_otras_medidas VARCHAR(255),
    observaciones_generales TEXT,
    
    -- Relación con la tabla principal de permisos_trabajo
    FOREIGN KEY (id_permiso) REFERENCES permisos_trabajo(id_permiso)
);





CREATE TABLE pt_cesta (
    id SERIAL PRIMARY KEY,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Campos que mencionaste que faltaban
    id_permiso INT,
    tipo_mantenimiento VARCHAR(100),
    ot_numero VARCHAR(100),
    tag VARCHAR(100),
    hora_inicio TIME,
    equipo_intervenir VARCHAR(255),
    descripcion_trabajo TEXT,
    nombre_solicitante VARCHAR(255),
    empresa VARCHAR(255),

    -- Datos de la grúa con cesta
    identificacion_grua_cesta VARCHAR(100),
    empresa_grua_cesta VARCHAR(255),
    identificacion_cesta VARCHAR(100),
    carga_maxima_cesta VARCHAR(10),
    empresa_cesta VARCHAR(255),
    peso_cesta VARCHAR(10),
    ultima_revision_cesta DATE,

    -- Parte 2 - Condiciones de elevación
    condicion VARCHAR(25),
    especificacion_ext_gatos VARCHAR(255),
    utiliza_plumin_cesta VARCHAR(5),
    especificacion_plumin_cesta VARCHAR(255),
    longitud_pluma_cesta VARCHAR(25),
    radio_trabajo_cesta VARCHAR(25),
    carga_segura_cesta VARCHAR(25),

    -- Datos de carga
    peso_carga_cesta VARCHAR(25),
    peso_gancho_elementos VARCHAR(25),
    carga_trabajo_cesta VARCHAR(25),
    relacion_carga_segura_cesta VARCHAR(25),

    -- PRUEBA PREVIA A SUSPENSIÓN
    carga_prueba VARCHAR(10),
    prueba_realizada VARCHAR(5),
    prueba_presenciada_por VARCHAR(255),
    firma_prueba VARCHAR(255),
    fecha_prueba DATE,

    -- Medidas de seguridad
    mascaras_escape_cesta VARCHAR(5),
    especificacion_mascaras VARCHAR(255),
    equipo_proteccion_cesta VARCHAR(5),
    especificacion_equipo_proteccion VARCHAR(255),
    equipo_contra_incendios_cesta VARCHAR(5),
    especificacion_equipo_incendios VARCHAR(255),
    final_carrera_cesta VARCHAR(5),
    otras_medidas_cesta VARCHAR(5),
    especificacion_otras_medidas_cesta VARCHAR(255),
    observaciones_generales_cesta TEXT,

	 FOREIGN KEY (id_permiso) REFERENCES permisos_trabajo(id_permiso)
);





CREATE TABLE pt_excavacion (
    id SERIAL PRIMARY KEY,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Campos que mencionaste que faltaban
    id_permiso INT,
    tipo_mantenimiento VARCHAR(100),
    ot_numero VARCHAR(100),
    tag VARCHAR(100),
    hora_inicio TIME,
    equipo_intervenir VARCHAR(255),
    descripcion_trabajo TEXT,
    nombre_solicitante VARCHAR(255),
    empresa VARCHAR(255),

    -- parte 1
    profundidad_media VARCHAR(20),
    profundidad_maxima VARCHAR(20),
    anchura VARCHAR(20),
    longitud VARCHAR(20),
    tipo_terreno VARCHAR(100),

    -- parte 2
    tuberia_gas VARCHAR(5),
    tipo_gas VARCHAR(100),
    comprobado_gas VARCHAR(255),
    fecha_gas DATE,
    
    linea_electrica VARCHAR(5),
    voltaje_linea VARCHAR(10),
    comprobado_electrica VARCHAR(255),
    fecha_electrica DATE,
    
    tuberia_incendios VARCHAR(5),
    presion_incendios VARCHAR(10),
    comprobado_incendios VARCHAR(255),
    fecha_incendios DATE,
    
    alcantarillado VARCHAR(5),
    diametro_alcantarillado VARCHAR(10),
    comprobado_alcantarillado VARCHAR(255),
    fecha_alcantarillado DATE,
    
    otras_instalaciones VARCHAR(5),
    especificacion_otras_instalaciones VARCHAR(255),
    comprobado_otras VARCHAR(255),
    fecha_otras DATE,

    -- parte 3
    requiere_talud VARCHAR(5),
    angulo_talud VARCHAR(10),
    
    requiere_bermas VARCHAR(5),
    longitud_meseta VARCHAR(10),
    altura_contrameseta VARCHAR(10),
    
    requiere_entibacion VARCHAR(5),
    tipo_entibacion VARCHAR(100),
    condiciones_terreno_entibacion TEXT,
    
    otros_requerimientos VARCHAR(5),
    especificacion_otros_requerimientos VARCHAR(255),
    
    distancia_seguridad_estatica VARCHAR(10),
    distancia_seguridad_dinamica VARCHAR(10),

    -- parte 4
    requiere_balizamiento VARCHAR(5),
    distancia_balizamiento VARCHAR(10),
    
    requiere_proteccion_rigida VARCHAR(5),
    distancia_proteccion_rigida VARCHAR(10),
    
    requiere_senalizacion_especial VARCHAR(5),
    especificacion_senalizacion VARCHAR(255),
    
    requiere_proteccion_anticaida VARCHAR(5),
    tipo_proteccion_anticaida VARCHAR(100),
    tipo_anclaje VARCHAR(100),

    -- parte 5
    excavacion_espacio_confinado VARCHAR(5),
    numero_permiso_confinado VARCHAR(50),
    
    excavacion_manual_aproximacion VARCHAR(5),
    medidas_aproximacion TEXT,
    
    herramienta_antichispa VARCHAR(5),
    guantes_calzado_dielectrico VARCHAR(5),
    epp_especial VARCHAR(5),
    otras_medidas_especiales VARCHAR(5),
    especificacion_otras_medidas_especiales VARCHAR(255),

    -- parte 6
    aplicar_bloqueo_fisico VARCHAR(5),
    especificacion_bloqueo_fisico VARCHAR(255),
    drenar_limpiar_lavar VARCHAR(5),
    inundar_anegar_atmosfera_inerte VARCHAR(5),
    vigilante_continuo VARCHAR(5),
    especificacion_vigilante_continuo VARCHAR(255),
    otras_medidas_adicionales VARCHAR(5),
    especificacion_otras_medidas_adicionales VARCHAR(255),
    observaciones_generales_excavacion TEXT,

    FOREIGN KEY (id_permiso) REFERENCES permisos_trabajo(id_permiso)
);











-- drop table pt_cesta





select * from permisos_trabajo

select * from permisos_trabajo