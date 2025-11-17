--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-11-17 10:25:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 25997)
-- Name: areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.areas (
    id_area integer NOT NULL,
    nombre character varying(100) NOT NULL,
    id_departamento integer
);


ALTER TABLE public.areas OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 26000)
-- Name: areas_id_area_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.areas ALTER COLUMN id_area ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.areas_id_area_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 26001)
-- Name: ast; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ast (
    id_ast integer NOT NULL,
    epp text,
    maquinaria_equipo_herramientas text,
    materiales_accesorios text
);


ALTER TABLE public.ast OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 26006)
-- Name: ast_actividades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ast_actividades (
    id_ast_actividades integer NOT NULL,
    id_ast integer NOT NULL,
    num_actividad character varying(200),
    secuencia_actividad character varying(300),
    personal_ejecutor character varying(150),
    peligros_potenciales character varying(350),
    acciones_preventivas character varying(350),
    responsable character varying(150)
);


ALTER TABLE public.ast_actividades OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 26011)
-- Name: ast_actividades_id_ast_actividades_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ast_actividades ALTER COLUMN id_ast_actividades ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ast_actividades_id_ast_actividades_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 26012)
-- Name: ast_id_ast_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ast ALTER COLUMN id_ast ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ast_id_ast_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 26013)
-- Name: ast_participan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ast_participan (
    id_ast_participan integer NOT NULL,
    nombre character varying(250),
    credencial character varying(100),
    cargo character varying(100),
    funcion character varying(50),
    id_estatus integer NOT NULL
);


ALTER TABLE public.ast_participan OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 26018)
-- Name: ast_participan_id_ast_participan_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ast_participan ALTER COLUMN id_ast_participan ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ast_participan_id_ast_participan_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 26019)
-- Name: autorizaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.autorizaciones (
    id_autorizacion integer NOT NULL,
    id_permiso integer,
    id_supervisor integer,
    id_categoria integer,
    responsable_area character varying(100),
    operador_area character varying(150),
    fecha_hora_area timestamp without time zone,
    fecha_hora_supervisor timestamp without time zone
);


ALTER TABLE public.autorizaciones OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 26022)
-- Name: autorizaciones_id_autorizacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.autorizaciones ALTER COLUMN id_autorizacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.autorizaciones_id_autorizacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 26023)
-- Name: categorias_seguridad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias_seguridad (
    id_categoria integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.categorias_seguridad OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 26026)
-- Name: categorias_seguridad_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.categorias_seguridad ALTER COLUMN id_categoria ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categorias_seguridad_id_categoria_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 26027)
-- Name: departamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamentos (
    id_departamento integer NOT NULL,
    nombre character varying(100) NOT NULL,
    correo character varying(100),
    extension character varying(20),
    "contraseña" character varying(255) NOT NULL
);


ALTER TABLE public.departamentos OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 26030)
-- Name: departamentos_id_departamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.departamentos ALTER COLUMN id_departamento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.departamentos_id_departamento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 26031)
-- Name: estatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estatus (
    id_estatus integer NOT NULL,
    estatus character varying(100) NOT NULL,
    comentarios text
);


ALTER TABLE public.estatus OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 26036)
-- Name: estatus_id_estatus_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.estatus ALTER COLUMN id_estatus ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estatus_id_estatus_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 26037)
-- Name: jefe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jefe (
    id_jefe integer NOT NULL,
    usuario character varying(50),
    "contraseña" character varying(100)
);


ALTER TABLE public.jefe OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 26040)
-- Name: jefe_id_jefe_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jefe_id_jefe_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jefe_id_jefe_seq OWNER TO postgres;

--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 234
-- Name: jefe_id_jefe_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jefe_id_jefe_seq OWNED BY public.jefe.id_jefe;


--
-- TOC entry 235 (class 1259 OID 26041)
-- Name: permisos_trabajo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permisos_trabajo (
    id_permiso integer NOT NULL,
    fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_area integer NOT NULL,
    id_departamento integer NOT NULL,
    id_sucursal integer NOT NULL,
    id_tipo_permiso integer NOT NULL,
    id_estatus integer NOT NULL,
    id_ast integer NOT NULL,
    prefijo character varying(50),
    contrato character varying(300)
);


ALTER TABLE public.permisos_trabajo OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 26045)
-- Name: permisos_trabajo_id_permiso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.permisos_trabajo ALTER COLUMN id_permiso ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.permisos_trabajo_id_permiso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 26046)
-- Name: pt_altura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pt_altura (
    id integer NOT NULL,
    id_permiso integer NOT NULL,
    tipo_mantenimiento character varying(50),
    ot_numero character varying(50),
    tag character varying(100),
    hora_inicio time without time zone,
    equipo_intervenir character varying(200),
    descripcion_trabajo text,
    nombre_solicitante character varying(150),
    empresa character varying(150),
    requiere_escalera character varying(3),
    requiere_canastilla_grua character varying(3),
    aseguramiento_estrobo character varying(3),
    requiere_andamio_cama_completa character varying(3),
    otro_tipo_acceso character varying(3),
    acceso_libre_obstaculos character varying(3),
    canastilla_asegurada character varying(3),
    andamio_completo character varying(3),
    andamio_seguros_zapatas character varying(3),
    escaleras_buen_estado character varying(3),
    linea_vida_segura character varying(3),
    arnes_completo_buen_estado character varying(3),
    suspender_trabajos_adyacentes character varying(3),
    numero_personas_autorizadas character varying(3),
    trabajadores_aptos_evaluacion character varying(3),
    requiere_barreras character varying(3),
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now(),
    fluido character varying(50),
    presion character varying(50),
    temperatura character varying(50),
    proteccion_especial character varying(5),
    proteccion_especial_cual character varying(255),
    equipo_caidas character varying(5),
    equipo_caidas_cual character varying(255),
    linea_amortiguador character varying(5),
    punto_fijo character varying(5),
    linea_vida character varying(5),
    andamio_completo_opcion character varying(5),
    tarjeta_andamio character varying(5),
    viento_permitido character varying(5),
    escalera_condicion character varying(5),
    tipo_escalera text,
    cual_acceso text,
    equipo_intervencion text
);


ALTER TABLE public.pt_altura OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 26053)
-- Name: pt_altura_id_altura_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pt_altura_id_altura_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pt_altura_id_altura_seq OWNER TO postgres;

--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 238
-- Name: pt_altura_id_altura_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pt_altura_id_altura_seq OWNED BY public.pt_altura.id;


--
-- TOC entry 239 (class 1259 OID 26054)
-- Name: pt_apertura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pt_apertura (
    id integer NOT NULL,
    id_permiso integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo_mantenimiento character varying(50),
    otro_tipo_mantenimiento character varying(100),
    ot_numero character varying(50),
    tag character varying(100),
    hora_inicio time without time zone,
    tiene_equipo_intervenir character varying(50),
    descripcion_equipo text,
    fluido character varying(100),
    presion character varying(50),
    temperatura character varying(50),
    antecedentes text,
    requiere_herramientas_especiales character varying(10),
    tipo_herramientas_especiales character varying(255),
    herramientas_adecuadas character varying(10),
    requiere_verificacion_previa character varying(10),
    requiere_conocer_riesgos character varying(10),
    observaciones_medidas text,
    fuera_operacion character varying(10),
    despresurizado_purgado character varying(10),
    necesita_aislamiento character varying(10),
    con_valvulas character varying(10),
    con_juntas_ciegas character varying(10),
    producto_entrampado character varying(10),
    requiere_lavado character varying(10),
    requiere_neutralizado character varying(10),
    requiere_vaporizado character varying(10),
    suspender_trabajos_adyacentes character varying(10),
    acordonar_area character varying(10),
    prueba_gas_toxico_inflamable character varying(10),
    equipo_electrico_desenergizado character varying(10),
    tapar_purgas_drenajes character varying(10),
    proteccion_especial_recomendada character varying(10),
    proteccion_piel_cuerpo character varying(10),
    proteccion_respiratoria character varying(10),
    proteccion_ocular character varying(10),
    proteccion_contraincendio character varying(10),
    tipo_proteccion_contraincendio character varying(255),
    instalacion_barreras character varying(10),
    observaciones_riesgos text,
    co2_nivel character varying(20),
    nh3_nivel character varying(20),
    oxigeno_nivel character varying(20),
    lel_nivel character varying(20),
    descripcion_trabajo text,
    nombre_solicitante character varying(150),
    empresa character varying(150),
    aprobado_co2 character varying(4),
    aprobado_nh3 character varying(4),
    aprobado_oxigeno character varying(4),
    aprobado_lel character varying(4),
    CONSTRAINT pt_apertura_acordonar_area_check CHECK (((acordonar_area)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_con_juntas_ciegas_check CHECK (((con_juntas_ciegas)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_con_valvulas_check CHECK (((con_valvulas)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_despresurizado_purgado_check CHECK (((despresurizado_purgado)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_equipo_electrico_desenergizado_check CHECK (((equipo_electrico_desenergizado)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_fuera_operacion_check CHECK (((fuera_operacion)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_herramientas_adecuadas_check CHECK (((herramientas_adecuadas)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_instalacion_barreras_check CHECK (((instalacion_barreras)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_necesita_aislamiento_check CHECK (((necesita_aislamiento)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_producto_entrampado_check CHECK (((producto_entrampado)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_proteccion_contraincendio_check CHECK (((proteccion_contraincendio)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_proteccion_especial_recomendada_check CHECK (((proteccion_especial_recomendada)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_proteccion_ocular_check CHECK (((proteccion_ocular)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_proteccion_piel_cuerpo_check CHECK (((proteccion_piel_cuerpo)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_proteccion_respiratoria_check CHECK (((proteccion_respiratoria)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_prueba_gas_toxico_inflamable_check CHECK (((prueba_gas_toxico_inflamable)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_requiere_conocer_riesgos_check CHECK (((requiere_conocer_riesgos)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_requiere_herramientas_especiales_check CHECK (((requiere_herramientas_especiales)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_requiere_lavado_check CHECK (((requiere_lavado)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_requiere_neutralizado_check CHECK (((requiere_neutralizado)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_requiere_vaporizado_check CHECK (((requiere_vaporizado)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_requiere_verificacion_previa_check CHECK (((requiere_verificacion_previa)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_suspender_trabajos_adyacentes_check CHECK (((suspender_trabajos_adyacentes)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text]))),
    CONSTRAINT pt_apertura_tapar_purgas_drenajes_check CHECK (((tapar_purgas_drenajes)::text = ANY (ARRAY[('SI'::character varying)::text, ('NO'::character varying)::text, ('N/A'::character varying)::text])))
);


ALTER TABLE public.pt_apertura OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 26085)
-- Name: pt_apertura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pt_apertura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pt_apertura_id_seq OWNER TO postgres;

--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 240
-- Name: pt_apertura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pt_apertura_id_seq OWNED BY public.pt_apertura.id;


--
-- TOC entry 260 (class 1259 OID 34204)
-- Name: pt_cesta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pt_cesta (
    id integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_permiso integer,
    tipo_mantenimiento character varying(100),
    ot_numero character varying(100),
    tag character varying(100),
    hora_inicio time without time zone,
    equipo_intervenir character varying(255),
    descripcion_trabajo text,
    nombre_solicitante character varying(255),
    empresa character varying(255),
    identificacion_grua_cesta character varying(100),
    empresa_grua_cesta character varying(255),
    identificacion_cesta character varying(100),
    carga_maxima_cesta character varying(10),
    empresa_cesta character varying(255),
    peso_cesta character varying(10),
    ultima_revision_cesta date,
    condicion character varying(25),
    especificacion_ext_gatos character varying(255),
    utiliza_plumin_cesta character varying(15),
    especificacion_plumin_cesta character varying(50),
    longitud_pluma_cesta character varying(25),
    radio_trabajo_cesta character varying(25),
    carga_segura_cesta character varying(25),
    peso_carga_cesta character varying(25),
    peso_gancho_elementos character varying(25),
    carga_trabajo_cesta character varying(25),
    relacion_carga_segura_cesta character varying(50),
    carga_prueba character varying(10),
    prueba_realizada character varying(15),
    prueba_presenciada_por character varying(255),
    firma_prueba character varying(255),
    fecha_prueba date,
    mascaras_escape_cesta character varying(50),
    especificacion_mascaras character varying(255),
    equipo_proteccion_cesta character varying(50),
    especificacion_equipo_proteccion character varying(255),
    equipo_contra_incendios_cesta character varying(50),
    especificacion_equipo_incendios character varying(255),
    final_carrera_cesta character varying(15),
    otras_medidas_cesta character varying(50),
    especificacion_otras_medidas_cesta character varying(255),
    observaciones_generales_cesta text,
    asentamiento character varying(5),
    calzado character varying(5),
    nivelacion character varying(5),
    ext_gatos character varying(5)
);


ALTER TABLE public.pt_cesta OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 34203)
-- Name: pt_cesta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pt_cesta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pt_cesta_id_seq OWNER TO postgres;

--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 259
-- Name: pt_cesta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pt_cesta_id_seq OWNED BY public.pt_cesta.id;


--
-- TOC entry 241 (class 1259 OID 26086)
-- Name: pt_confinados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pt_confinados (
    id integer NOT NULL,
    id_permiso integer,
    tipo_mantenimiento character varying(50),
    ot_numero character varying(100),
    tag character varying(100),
    hora_inicio time without time zone,
    equipo_intervenir text,
    avisos_trabajos character varying(5),
    iluminacion_prueba_explosion character varying(5),
    ventilacion_forzada character varying(5),
    evaluacion_medica_aptos character varying(5),
    cable_vida_trabajadores character varying(5),
    vigilancia_exterior character varying(5),
    nombre_vigilante character varying(100),
    personal_rescatista character varying(5),
    nombre_rescatista character varying(100),
    instalar_barreras character varying(5),
    equipo_especial character varying(5),
    tipo_equipo_especial character varying(100),
    numero_personas_autorizadas character varying(50),
    tiempo_permanencia_min character varying(50),
    tiempo_recuperacion_min character varying(50),
    clase_espacio_confinado character varying(350),
    observaciones_adicionales text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    descripcion_trabajo character varying(350),
    nombre_solicitante character varying(100),
    verificar_explosividad character varying(5),
    verificar_gas_toxico character varying(5),
    verificar_deficiencia_oxigeno character varying(5),
    verificar_enriquecimiento_oxigeno character varying(5),
    verificar_polvo_humos_fibras character varying(5),
    verificar_amoniaco character varying(5),
    verificar_material_piel character varying(5),
    verificar_temperatura character varying(5),
    verificar_lel character varying(5),
    suspender_trabajos_adyacentes character varying(5),
    acordonar_area character varying(5),
    prueba_gas_toxico_inflamable character varying(5),
    porcentaje_lel character varying(50),
    nh3 character varying(50),
    porcentaje_oxigeno character varying(50),
    equipo_despresionado_fuera_operacion character varying(5),
    equipo_aislado character varying(5),
    equipo_aislado_valvula character varying(50),
    equipo_aislado_junta_ciega character varying(50),
    equipo_lavado character varying(5),
    equipo_neutralizado character varying(5),
    equipo_vaporizado character varying(5),
    aislar_purgas_drenaje_venteo character varying(5),
    abrir_registros_necesarios character varying(5),
    observaciones_requisitos text,
    fluido character varying(100),
    presion character varying(50),
    temperatura character varying(50),
    empresa character varying(255),
    vigilancia_exterior_opcion character varying(5),
    proteccion_piel_cuerpo character varying(5),
    proteccion_piel_detalle text,
    proteccion_respiratoria character varying(5),
    proteccion_respiratoria_detalle text,
    proteccion_ocular character varying(5),
    proteccion_ocular_detalle text,
    arnes_seguridad character varying(5),
    cable_vida character varying(5),
    ventilacion_forzada_opcion character varying(5),
    ventilacion_forzada_detalle text,
    iluminacion_explosion character varying(5),
    prueba_gas_aprobado character varying(5),
    param_co2 character varying(5),
    valor_co2 character varying(50),
    param_amoniaco character varying(5),
    valor_amoniaco character varying(50),
    param_oxigeno character varying(5),
    valor_oxigeno character varying(50),
    param_explosividad_lel character varying(5),
    valor_explosividad_lel character varying(50),
    param_otro character varying(5),
    param_otro_detalle text,
    valor_otro character varying(50),
    observaciones text,
    contrato character varying(50)
);


ALTER TABLE public.pt_confinados OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 26095)
-- Name: pt_confinados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pt_confinados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pt_confinados_id_seq OWNER TO postgres;

--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 242
-- Name: pt_confinados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pt_confinados_id_seq OWNED BY public.pt_confinados.id;


--
-- TOC entry 243 (class 1259 OID 26096)
-- Name: pt_electrico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pt_electrico (
    id integer NOT NULL,
    id_permiso integer,
    tipo_mantenimiento character varying(50),
    tipo_mantenimiento_otro character varying(255),
    ot_numero character varying(100),
    tag character varying(100),
    hora_inicio time without time zone,
    equipo_intervenir text,
    empresa character varying(255),
    descripcion_trabajo text,
    nombre_solicitante character varying(255),
    equipo_desenergizado character varying(10),
    interruptores_abiertos character varying(10),
    verificar_ausencia_voltaje character varying(10),
    candados_equipo character varying(10),
    tarjetas_alerta character varying(10),
    aviso_personal_area character varying(10),
    tapetes_dielectricos character varying(10),
    herramienta_aislante character varying(10),
    pertiga_telescopica character varying(10),
    equipo_proteccion_especial character varying(10),
    tipo_equipo_proteccion character varying(255),
    aterrizar_equipo character varying(10),
    barricadas_area character varying(10),
    observaciones_adicionales text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    identifico_equipo character varying(5),
    verifico_identifico_equipo character varying(5),
    fuera_operacion_desenergizado character varying(5),
    verifico_fuera_operacion_desenergizado character varying(5),
    candado_etiqueta character varying(5),
    verifico_candado_etiqueta character varying(5),
    suspender_adyacentes character varying(5),
    verifico_suspender_adyacentes character varying(5),
    area_limpia_libre_obstaculos character varying(5),
    verifico_area_limpia_libre_obstaculos character varying(5),
    libranza_electrica character varying(5),
    verifico_libranza_electrica character varying(5),
    nivel_tension character varying(100),
    equipo_proteccion_especial_supervisor character varying(10),
    cual_equipo_proteccion text,
    observaciones_medidas text
);


ALTER TABLE public.pt_electrico OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 26103)
-- Name: pt_electrico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pt_electrico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pt_electrico_id_seq OWNER TO postgres;

--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 244
-- Name: pt_electrico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pt_electrico_id_seq OWNED BY public.pt_electrico.id;


--
-- TOC entry 262 (class 1259 OID 34219)
-- Name: pt_excavacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pt_excavacion (
    id integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_permiso integer,
    tipo_mantenimiento character varying(100),
    ot_numero character varying(100),
    tag character varying(100),
    hora_inicio time without time zone,
    equipo_intervenir character varying(255),
    descripcion_trabajo text,
    nombre_solicitante character varying(255),
    empresa character varying(255),
    profundidad_media character varying(20),
    profundidad_maxima character varying(20),
    anchura character varying(20),
    longitud character varying(20),
    tipo_terreno character varying(100),
    tuberia_gas character varying(5),
    tipo_gas character varying(100),
    comprobado_gas character varying(255),
    fecha_gas date,
    linea_electrica character varying(5),
    voltaje_linea character varying(10),
    comprobado_electrica character varying(255),
    fecha_electrica date,
    tuberia_incendios character varying(5),
    presion_incendios character varying(10),
    comprobado_incendios character varying(255),
    fecha_incendios date,
    alcantarillado character varying(5),
    diametro_alcantarillado character varying(10),
    comprobado_alcantarillado character varying(255),
    fecha_alcantarillado date,
    otras_instalaciones character varying(5),
    especificacion_otras_instalaciones character varying(255),
    comprobado_otras character varying(255),
    fecha_otras date,
    requiere_talud character varying(5),
    angulo_talud character varying(10),
    requiere_bermas character varying(5),
    longitud_meseta character varying(10),
    altura_contrameseta character varying(10),
    requiere_entibacion character varying(5),
    tipo_entibacion character varying(100),
    condiciones_terreno_entibacion text,
    otros_requerimientos character varying(5),
    especificacion_otros_requerimientos character varying(255),
    distancia_seguridad_estatica character varying(10),
    distancia_seguridad_dinamica character varying(10),
    requiere_balizamiento character varying(5),
    distancia_balizamiento character varying(10),
    requiere_proteccion_rigida character varying(5),
    distancia_proteccion_rigida character varying(10),
    requiere_senalizacion_especial character varying(5),
    especificacion_senalizacion character varying(255),
    requiere_proteccion_anticaida character varying(5),
    tipo_proteccion_anticaida character varying(100),
    tipo_anclaje character varying(100),
    excavacion_espacio_confinado character varying(5),
    excavacion_manual_aproximacion character varying(5),
    medidas_aproximacion text,
    herramienta_antichispa character varying(5),
    guantes_calzado_dielectrico character varying(5),
    epp_especial character varying(5),
    otras_medidas_especiales character varying(5),
    especificacion_otras_medidas_especiales character varying(255),
    aplicar_bloqueo_fisico character varying(5),
    especificacion_bloqueo_fisico character varying(255),
    drenar_limpiar_lavar character varying(5),
    inundar_anegar_atmosfera_inerte character varying(5),
    vigilante_continuo character varying(5),
    especificacion_vigilante_continuo character varying(255),
    otras_medidas_adicionales character varying(5),
    especificacion_otras_medidas_adicionales character varying(255),
    observaciones_generales_excavacion text
);


ALTER TABLE public.pt_excavacion OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 34218)
-- Name: pt_excavacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pt_excavacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pt_excavacion_id_seq OWNER TO postgres;

--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 261
-- Name: pt_excavacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pt_excavacion_id_seq OWNED BY public.pt_excavacion.id;


--
-- TOC entry 245 (class 1259 OID 26104)
-- Name: pt_fuego; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pt_fuego (
    id integer NOT NULL,
    id_permiso integer,
    tipo_mantenimiento character varying(50),
    tipo_mantenimiento_otro character varying(255),
    ot_numero character varying(100),
    tag character varying(100),
    hora_inicio time without time zone,
    equipo_intervenir text,
    empresa character varying(255),
    descripcion_trabajo text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    nombre_solicitante character varying(255),
    fuera_operacion character varying(50),
    despresurizado_purgado character varying(50),
    producto_entrampado character varying(50),
    necesita_aislamiento character varying(50),
    con_valvulas character varying(50),
    con_juntas_ciegas character varying(50),
    requiere_lavado character varying(50),
    requiere_neutralizado character varying(50),
    requiere_vaporizado character varying(50),
    suspender_trabajos_adyacentes character varying(50),
    acordonar_area character varying(50),
    prueba_gas_toxico_inflamable character varying(50),
    equipo_electrico_desenergizado character varying(50),
    tapar_purgas_drenajes character varying(50),
    ventilacion_forzada character varying(50),
    limpieza_interior character varying(50),
    instalo_ventilacion_forzada character varying(50),
    equipo_conectado_tierra character varying(50),
    cables_pasan_drenajes character varying(50),
    cables_uniones_intermedias character varying(50),
    equipo_proteccion_personal character varying(50),
    fluido character varying(100),
    presion character varying(50),
    temperatura character varying(50),
    explosividad_interior character varying(2),
    explosividad_exterior character varying(2),
    vigia_contraincendio character varying(2),
    manguera_contraincendio character varying(2),
    cortina_agua character varying(2),
    extintor_contraincendio character varying(2),
    cubrieron_drenajes character varying(2),
    co2 character varying(2),
    amoniaco character varying(2),
    oxigeno character varying(2),
    explosividad_lel character varying(2),
    otro_gas_cual character varying(255),
    observaciones_gas text
);


ALTER TABLE public.pt_fuego OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 26111)
-- Name: pt_fuego_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pt_fuego_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pt_fuego_id_seq OWNER TO postgres;

--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 246
-- Name: pt_fuego_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pt_fuego_id_seq OWNED BY public.pt_fuego.id;


--
-- TOC entry 258 (class 1259 OID 34189)
-- Name: pt_izaje; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pt_izaje (
    id integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_permiso integer,
    tipo_mantenimiento character varying(100),
    ot_numero character varying(100),
    tag character varying(100),
    hora_inicio time without time zone,
    equipo_intervenir character varying(255),
    descripcion_trabajo text,
    nombre_solicitante character varying(255),
    empresa character varying(255),
    hora_inicio_prevista time without time zone,
    responsable_operacion character varying(255),
    hora_fin_prevista time without time zone,
    empresa_grua character varying(255),
    identificacion_grua character varying(100),
    declaracion_conformidad character varying(5),
    inspeccion_periodica character varying(5),
    mantenimiento_preventivo character varying(5),
    inspeccion_diaria character varying(5),
    diagrama_cargas character varying(5),
    libro_instrucciones character varying(5),
    limitador_carga character varying(5),
    final_carrera character varying(5),
    nombre_operador character varying(255),
    empresa_operador character varying(255),
    licencia_operador character varying(5),
    numero_licencia character varying(100),
    fecha_emision_licencia date,
    vigencia_licencia character varying(100),
    tipo_licencia character varying(100),
    comentarios_operador text,
    estrobos_eslingas character varying(5),
    grilletes character varying(5),
    otros_elementos_auxiliares character varying(5),
    especificacion_otros_elementos character varying(255),
    requiere_eslingado_especifico character varying(5),
    especificacion_eslingado character varying(255),
    extension_gatos character varying(5),
    sobre_ruedas character varying(8),
    especificacion_sobre_ruedas character varying(255),
    utiliza_plumin_si character varying(5),
    especificacion_plumin character varying(255),
    longitud_pluma character varying(15),
    radio_trabajo character varying(15),
    contrapeso character varying(15),
    sector_trabajo character varying(30),
    carga_segura_diagrama character varying(15),
    peso_carga character varying(15),
    determinada_por character varying(255),
    carga_trabajo character varying(100),
    peso_gancho_eslingas character varying(10),
    relacion_carga_carga_segura character varying(10),
    asentamiento character varying(5),
    calzado character varying(5),
    extension_gatos_check character varying(5),
    nivelacion character varying(5),
    contrapeso_check character varying(5),
    sector_trabajo_check character varying(5),
    comprobado_por character varying(255),
    balizamiento_operacion character varying(5),
    reunion_previa character varying(5),
    especificacion_reunion_previa character varying(255),
    presentacion_supervisor character varying(5),
    nombre_supervisor character varying(255),
    permiso_adicional character varying(5),
    especificacion_permiso_adicional character varying(255),
    otras_medidas_seguridad character varying(5),
    especificacion_otras_medidas character varying(255),
    observaciones_generales text
);


ALTER TABLE public.pt_izaje OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 34188)
-- Name: pt_izaje_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pt_izaje_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pt_izaje_id_seq OWNER TO postgres;

--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 257
-- Name: pt_izaje_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pt_izaje_id_seq OWNED BY public.pt_izaje.id;


--
-- TOC entry 247 (class 1259 OID 26112)
-- Name: pt_no_peligroso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pt_no_peligroso (
    id_ptnp integer NOT NULL,
    id_permiso integer NOT NULL,
    nombre_solicitante character varying(100) NOT NULL,
    descripcion_trabajo character varying(350) NOT NULL,
    tipo_mantenimiento character varying(50) NOT NULL,
    ot_no character varying(50),
    equipo_intervencion character varying(100),
    hora_inicio timestamp without time zone NOT NULL,
    tag character varying(50),
    fluido character varying(50),
    presion character varying(20),
    temperatura character varying(20),
    empresa character varying(250),
    trabajo_area_riesgo_controlado character varying(2),
    necesita_entrega_fisica character varying(2),
    necesita_ppe_adicional character varying(2),
    area_circundante_riesgo character varying(2),
    necesita_supervision character varying(2),
    observaciones_analisis_previo text
);


ALTER TABLE public.pt_no_peligroso OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 26117)
-- Name: pt_no_peligroso_id_ptnp_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pt_no_peligroso ALTER COLUMN id_ptnp ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pt_no_peligroso_id_ptnp_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 249 (class 1259 OID 26118)
-- Name: pt_radiacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pt_radiacion (
    id integer NOT NULL,
    id_permiso integer,
    tipo_mantenimiento character varying(50),
    tipo_mantenimiento_otro character varying(255),
    ot_numero character varying(100),
    tag character varying(100),
    hora_inicio time without time zone,
    equipo_intervenir text,
    empresa character varying(255),
    descripcion_trabajo text,
    nombre_solicitante character varying(255),
    tipo_fuente_radiactiva character varying(255),
    actividad_radiactiva character varying(100),
    numero_serial_fuente character varying(100),
    distancia_trabajo character varying(50),
    tiempo_exposicion character varying(50),
    dosis_estimada character varying(50),
    equipo_proteccion_radiologica character varying(10),
    dosimetros_personales character varying(10),
    monitores_radiacion_area character varying(10),
    senalizacion_area character varying(10),
    barricadas character varying(10),
    protocolo_emergencia character varying(10),
    personal_autorizado character varying(10),
    observaciones_radiacion text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fluido character varying(10),
    presion character varying(10),
    temperatura character varying(10),
    marca_modelo text,
    marca_modelo_check character varying(3),
    tipo_isotopo text,
    tipo_isotopo_check character varying(3),
    numero_fuente text,
    numero_fuente_check character varying(3),
    actividad_fuente text,
    actividad_fuente_check character varying(3),
    fecha_dia character varying(3),
    fecha_mes character varying(3),
    fecha_anio character varying(3)
);


ALTER TABLE public.pt_radiacion OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 26125)
-- Name: pt_radiacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pt_radiacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pt_radiacion_id_seq OWNER TO postgres;

--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 250
-- Name: pt_radiacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pt_radiacion_id_seq OWNED BY public.pt_radiacion.id;


--
-- TOC entry 251 (class 1259 OID 26126)
-- Name: sucursales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sucursales (
    id_sucursal integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.sucursales OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 26129)
-- Name: sucursales_id_sucursal_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sucursales ALTER COLUMN id_sucursal ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sucursales_id_sucursal_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 253 (class 1259 OID 26130)
-- Name: supervisores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supervisores (
    id_supervisor integer NOT NULL,
    nombre character varying(100) NOT NULL,
    correo character varying(100),
    extension character varying(20),
    "contraseña" character varying(255) NOT NULL,
    usuario character varying(150)
);


ALTER TABLE public.supervisores OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 26135)
-- Name: supervisores_id_supervisor_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.supervisores ALTER COLUMN id_supervisor ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.supervisores_id_supervisor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 255 (class 1259 OID 26136)
-- Name: tipos_permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_permisos (
    id_tipo_permiso integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.tipos_permisos OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 26139)
-- Name: tipos_permisos_id_tipo_permiso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipos_permisos ALTER COLUMN id_tipo_permiso ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipos_permisos_id_tipo_permiso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4852 (class 2604 OID 26149)
-- Name: jefe id_jefe; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jefe ALTER COLUMN id_jefe SET DEFAULT nextval('public.jefe_id_jefe_seq'::regclass);


--
-- TOC entry 4854 (class 2604 OID 26150)
-- Name: pt_altura id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_altura ALTER COLUMN id SET DEFAULT nextval('public.pt_altura_id_altura_seq'::regclass);


--
-- TOC entry 4857 (class 2604 OID 26151)
-- Name: pt_apertura id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_apertura ALTER COLUMN id SET DEFAULT nextval('public.pt_apertura_id_seq'::regclass);


--
-- TOC entry 4874 (class 2604 OID 34207)
-- Name: pt_cesta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_cesta ALTER COLUMN id SET DEFAULT nextval('public.pt_cesta_id_seq'::regclass);


--
-- TOC entry 4860 (class 2604 OID 26152)
-- Name: pt_confinados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_confinados ALTER COLUMN id SET DEFAULT nextval('public.pt_confinados_id_seq'::regclass);


--
-- TOC entry 4863 (class 2604 OID 26153)
-- Name: pt_electrico id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_electrico ALTER COLUMN id SET DEFAULT nextval('public.pt_electrico_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 34222)
-- Name: pt_excavacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_excavacion ALTER COLUMN id SET DEFAULT nextval('public.pt_excavacion_id_seq'::regclass);


--
-- TOC entry 4866 (class 2604 OID 26154)
-- Name: pt_fuego id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_fuego ALTER COLUMN id SET DEFAULT nextval('public.pt_fuego_id_seq'::regclass);


--
-- TOC entry 4872 (class 2604 OID 34192)
-- Name: pt_izaje id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_izaje ALTER COLUMN id SET DEFAULT nextval('public.pt_izaje_id_seq'::regclass);


--
-- TOC entry 4869 (class 2604 OID 26155)
-- Name: pt_radiacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_radiacion ALTER COLUMN id SET DEFAULT nextval('public.pt_radiacion_id_seq'::regclass);


--
-- TOC entry 5114 (class 0 OID 25997)
-- Dependencies: 217
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.areas (id_area, nombre, id_departamento) FROM stdin;
1	Site	1
2	CCI u2	1
3	Oficina Opip	2
4	Muelle	2
5	areax	3
\.


--
-- TOC entry 5116 (class 0 OID 26001)
-- Dependencies: 219
-- Data for Name: ast; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ast (id_ast, epp, maquinaria_equipo_herramientas, materiales_accesorios) FROM stdin;
361	sdf	dfs	sdf
362	sfd	sdfds	s fddsffd
363	x	x	x
364	x	x	x
365	x	x	x
366	x	x	x
367	x	x	x
368	s	s	s
369	s	s	s
370	s	s	s
371	s	s	s
372	x	x	x
373	s	s	s
374	s	s	s
375	x	x	x
376	s	s	s
377	x	x	x
378	x	x	x
379	x	x	x
380	s	s	s
381	x	x	x
382	x	x	x
383	s	s	s
\.


--
-- TOC entry 5117 (class 0 OID 26006)
-- Dependencies: 220
-- Data for Name: ast_actividades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ast_actividades (id_ast_actividades, id_ast, num_actividad, secuencia_actividad, personal_ejecutor, peligros_potenciales, acciones_preventivas, responsable) FROM stdin;
359	361	1	fsd	418	sdf	dsf	418
360	362	1	fsd	419	sdf	sdf	419
361	363	1	x	420	x	x	420
362	364	1	x	421	x	x	421
363	365	1	x	422	x	x	422
364	366	1	x	423	x	x	423
365	367	1	x	425	x	x	425
366	368	1	s	426	s	s	426
367	369	1	s	427	ss	s	427
368	370	1	s	428	s	s	428
369	374	1	s	432	s	s	432
370	375	1	x	433	x	x	433
371	376	1	s	434	s	s	434
372	378	1	x	436	x	x	436
373	379	1	x	437	x	x	437
374	380	1	s	438	s	s	438
375	381	1	x	439	x	x	439
376	382	1	x	440	x	x	440
377	383	1	s	441	s	s	441
\.


--
-- TOC entry 5120 (class 0 OID 26013)
-- Dependencies: 223
-- Data for Name: ast_participan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ast_participan (id_ast_participan, nombre, credencial, cargo, funcion, id_estatus) FROM stdin;
418	dsf	dsf	sdf	PARTICIPA	594
419	sdf	dsf	dsf	PARTICIPA	595
420	x	x	x	PARTICIPA	596
421	x	x	x	PARTICIPA	597
422	x	x	x	REVISA	598
423	x	x	x	PARTICIPA	599
424	x	x	x	REVISA	600
425	x	x	x	PARTICIPA	601
426	s	s	s	PARTICIPA	602
427	s	s	s	REVISA	604
428	s	s	s	PARTICIPA	605
429	s	s	s	PARTICIPA	615
430	x	x	x	PARTICIPA	616
431	s	s	s	PARTICIPA	617
432	s	s	s	PARTICIPA	618
433	x	x	x	PARTICIPA	619
434	s	s	s	PARTICIPA	620
435	x	x	x	ANALIZA	621
436	x	x	x	PARTICIPA	622
437	x	x	x	REVISA	628
438	s	s	s	PARTICIPA	629
439	x	x	x	PARTICIPA	630
440	x	x	x	REVISA	631
441	s	s	s	PARTICIPA	632
\.


--
-- TOC entry 5122 (class 0 OID 26019)
-- Dependencies: 225
-- Data for Name: autorizaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.autorizaciones (id_autorizacion, id_permiso, id_supervisor, id_categoria, responsable_area, operador_area, fecha_hora_area, fecha_hora_supervisor) FROM stdin;
189	2	\N	\N	dfdf	ggggggg	2025-11-13 18:00:46.305	\N
190	1	\N	\N	ffffffffff	\N	2025-11-13 18:01:28.452	\N
191	10	\N	\N	Ingeniero Diego Rafael Ramirez Contreras	\N	2025-11-15 17:18:32.334	\N
192	11	\N	\N	s	\N	2025-11-15 17:22:07.843	\N
193	15	\N	\N	Ingeniero Diego Rafael Ramirez Contreras xd	nombre2	2025-11-16 16:27:42.282	\N
195	21	\N	\N	z	y	2025-11-16 17:22:02.183	\N
194	17	3	1	ss	sss	2025-11-16 23:00:27.654	2025-11-17 05:49:16.207
196	19	3	2	prueba1	prueba2	2025-11-16 23:50:39.101	2025-11-17 05:50:55.632
\.


--
-- TOC entry 5124 (class 0 OID 26023)
-- Dependencies: 227
-- Data for Name: categorias_seguridad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias_seguridad (id_categoria, nombre) FROM stdin;
1	SAMP
2	APT
\.


--
-- TOC entry 5126 (class 0 OID 26027)
-- Dependencies: 229
-- Data for Name: departamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departamentos (id_departamento, nombre, correo, extension, "contraseña") FROM stdin;
1	Sistemas	mauricio.lopez@proagroindustria.com	141	cursoN8N25*
2	Opip	isic21.dramirezc@itesco.edu.mx	456	cursoN8N25*
3	X	x@rr.com	x@x.com	12345
\.


--
-- TOC entry 5128 (class 0 OID 26031)
-- Dependencies: 231
-- Data for Name: estatus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estatus (id_estatus, estatus, comentarios) FROM stdin;
11	espera seguridad	\N
131	en espera del área	\N
35	no autorizado	\N
12	espera seguridad	\N
42	terminado	dhgdf
85	terminado	\N
78	activo	\N
17	en espera del área	\N
41	no autorizado	\N
38	activo	\N
34	no autorizado	\N
37	activo	\N
43	espera seguridad	\N
91	en espera del área	\N
48	activo	\N
92	en espera del área	\N
93	en espera del área	\N
94	en espera del área	\N
95	en espera del área	\N
49	activo	\N
50	en espera del área	\N
96	en espera del área	\N
22	no autorizado	\N
23	no autorizado	\N
97	en espera del área	\N
1	Espera seguridad	\N
2	Espera seguridad	\N
7	Espera seguridad	\N
8	Espera seguridad	\N
9	Espera seguridad	\N
10	Espera seguridad	\N
6	Espera seguridad	\N
27	espera seguridad	\N
26	no autorizado	\N
25	no autorizado	\N
28	espera seguridad	\N
29	no autorizado	\N
30	no autorizado	\N
31	no autorizado	\N
32	no autorizado	\N
33	no autorizado	\N
100	en espera del área	\N
51	en espera del área	\N
52	en espera del área	\N
54	en espera del área	\N
56	en espera del área	\N
57	en espera del área	\N
58	en espera del área	\N
59	en espera del área	\N
60	en espera del área	\N
61	en espera del área	\N
62	en espera del área	\N
63	en espera del área	\N
64	en espera del área	\N
65	en espera del área	\N
66	en espera del área	\N
67	en espera del área	\N
68	en espera del área	\N
69	en espera del área	\N
70	en espera del área	\N
71	en espera del área	\N
72	en espera del área	\N
73	en espera del área	\N
74	en espera del área	\N
77	en espera del área	\N
80	en espera del área	\N
82	en espera del área	\N
86	en espera del área	\N
87	en espera del área	\N
134	en espera del área	\N
114	no autorizado	dsgsfgdsfgdfgfsgfsgsgsdiego
117	en espera del área	\N
84	cancelado	\N
83	cancelado	\N
81	cancelado	\N
89	activo	\N
99	activo	\N
136	en espera del área	\N
88	activo	\N
76	cancelado	\N
102	activo	\N
101	activo	\N
137	en espera del área	\N
4	cancelado	\N
13	cancelado	\N
103	cancelado	permiso cancelado equipo linea
138	en espera del área	\N
16	terminado	\N
18	terminado	\N
104	no autorizado	\N
55	terminado	\N
53	no autorizado	\N
46	no autorizado	\N
45	no autorizado	\N
47	terminado	hola
36	no autorizado	gfsdddgsdfgsfd
105	en espera del área	\N
20	cancelado	\N
108	en espera del área	\N
19	cancelado	\N
21	terminado	\N
110	en espera del área	\N
98	no autorizado	\N
111	en espera del área	\N
15	cancelado	\N
14	cancelado	\N
139	en espera del área	\N
140	en espera del área	\N
24	no autorizado	ttrr7788867
90	terminado	ghfh
75	no autorizado	\N
141	en espera del área	\N
79	no autorizado	\N
113	no autorizado	\N
115	en espera del área	\N
118	en espera del área	\N
116	activo	\N
119	en espera del área	\N
121	en espera del área	\N
122	en espera del área	\N
123	en espera del área	\N
124	en espera del área	\N
125	en espera del área	\N
126	en espera del área	\N
127	en espera del área	\N
128	en espera del área	\N
129	en espera del área	\N
130	en espera del área	\N
142	en espera del área	\N
144	en espera del área	\N
145	en espera del área	\N
147	en espera del área	\N
148	en espera del área	\N
149	en espera del área	\N
150	en espera del área	\N
151	en espera del área	\N
152	en espera del área	\N
146	espera seguridad	\N
143	espera seguridad	\N
153	en espera del área	\N
135	activo	\N
154	en espera del área	\N
155	en espera del área	\N
120	espera seguridad	\N
40	espera seguridad	\N
112	terminado	terminado
44	terminado	motivo del cierrre
156	en espera del área	\N
157	en espera del área	\N
158	en espera del área	\N
159	en espera del área	\N
160	espera seguridad	\N
133	espera seguridad	\N
161	en espera del área	\N
162	en espera del área	\N
5	no autorizado	asdsa
132	no autorizado	xcdsfsd
109	no autorizado	dfsf
163	en espera del área	\N
164	en espera del área	\N
165	en espera del área	\N
166	en espera del área	\N
169	en espera del área	\N
171	en espera del área	\N
173	en espera del área	\N
174	en espera del área	\N
168	espera seguridad	\N
176	espera seguridad	\N
177	espera seguridad	\N
178	no autorizado	\N
257	espera seguridad	\N
180	no autorizado	dfdsfdsfdsfdsfds
181	espera seguridad	\N
182	espera seguridad	\N
183	espera seguridad	\N
184	espera seguridad	\N
179	espera seguridad	\N
185	espera seguridad	\N
186	espera seguridad	\N
187	no autorizado	dsfdsfdsfsdf
228	no autorizado	No lo autorizo este es el permiso 2 y necesito probar que efectivamente la parte de no autorizar no sirva
188	no autorizado	dfsdfsdf
190	espera seguridad	\N
189	espera seguridad	\N
191	en espera del área	\N
192	espera seguridad	\N
193	espera seguridad	\N
107	no autorizado	nomas no lo autorizo para checar el comentario
194	en espera del área	\N
195	en espera del área	\N
196	en espera del área	\N
197	en espera del área	\N
198	en espera del área	\N
199	en espera del área	\N
200	en espera del área	\N
201	en espera del área	\N
202	en espera del área	\N
203	en espera del área	\N
204	en espera del área	\N
205	en espera del área	\N
206	en espera del área	\N
207	en espera del área	\N
208	en espera del área	\N
209	en espera del área	\N
210	en espera del área	\N
211	en espera del área	\N
212	en espera del área	\N
213	en espera del área	\N
214	en espera del área	\N
215	en espera del área	\N
216	en espera del área	\N
217	en espera del área	\N
218	en espera del área	\N
219	en espera del área	\N
220	en espera del área	\N
221	en espera del área	\N
222	en espera del área	\N
223	en espera del área	\N
224	en espera del área	\N
225	en espera del área	\N
226	en espera del área	\N
227	en espera del área	\N
229	en espera del área	\N
230	en espera del área	\N
231	en espera del área	\N
234	en espera del área	\N
236	en espera del área	\N
237	en espera del área	\N
238	en espera del área	\N
239	en espera del área	\N
240	en espera del área	\N
241	en espera del área	\N
242	en espera del área	\N
244	en espera del área	\N
245	en espera del área	\N
246	en espera del área	\N
247	en espera del área	\N
248	en espera del área	\N
249	en espera del área	\N
250	en espera del área	\N
252	en espera del área	\N
258	terminado	permiso terminado apertura equipo linea
253	no autorizado	No pudimos autorizar el permiso 159 de permiso no peligroso porque x
175	activo	\N
273	en espera del área	\N
254	no autorizado	No lo Autorizamos porque no nos gusto
255	en espera del área	\N
167	activo	\N
274	en espera del área	\N
259	activo	\N
265	espera seguridad	\N
260	activo	\N
261	en espera del área	\N
275	activo	\N
262	activo	\N
263	espera seguridad	\N
172	espera seguridad	\N
278	activo	probar el no autorizar numero 5 de fuego
266	en espera del área	\N
267	en espera del área	\N
268	en espera del área	\N
269	en espera del área	\N
270	en espera del área	\N
235	no autorizado	el motivo es la prueba de no autorizar de la parte 3
280	terminado	sdgsdgsd
277	activo	nadamas para probar el 4
276	activo	xd xd xd
251	espera seguridad	\N
243	espera seguridad	\N
281	activo	\N
283	activo	\N
284	activo	\N
285	activo	\N
286	activo	\N
288	activo	\N
287	no autorizado	dfdssdf d sf
279	no autorizado	PRUEBA DE NO AUTORIZAR EN EL PT DE ELECTRICO
290	en espera del área	\N
289	activo	\N
292	en espera del área	\N
293	en espera del área	\N
233	activo	\N
295	activo	\N
296	activo	\N
298	en espera del área	\N
297	activo	\N
264	espera seguridad	\N
299	terminado	jkjh
271	terminado	dfgfdgfd
272	terminado	permiso terminado
170	terminado	permiso terminado
282	activo	\N
256	activo	\N
301	en espera del área	\N
302	en espera del área	\N
304	en espera del área	\N
305	espera seguridad	\N
307	en espera del área	\N
308	en espera del área	\N
310	en espera del área	\N
311	en espera del área	\N
312	en espera del área	\N
437	en espera del área	\N
438	activo	\N
309	activo	\N
313	en espera del área	\N
314	en espera del área	\N
315	en espera del área	\N
316	en espera del área	\N
317	en espera del área	\N
318	en espera del área	\N
319	en espera del área	\N
320	en espera del área	\N
321	en espera del área	\N
322	en espera del área	\N
323	en espera del área	\N
324	en espera del área	\N
325	en espera del área	\N
326	en espera del área	\N
327	en espera del área	\N
328	en espera del área	\N
329	en espera del área	\N
330	en espera del área	\N
331	en espera del área	\N
332	en espera del área	\N
333	en espera del área	\N
334	en espera del área	\N
335	en espera del área	\N
336	en espera del área	\N
337	en espera del área	\N
338	en espera del área	\N
339	en espera del área	\N
340	en espera del área	\N
341	en espera del área	\N
342	en espera del área	\N
343	en espera del área	\N
344	en espera del área	\N
345	en espera del área	\N
346	en espera del área	\N
347	en espera del área	\N
348	en espera del área	\N
349	en espera del área	\N
350	en espera del área	\N
351	en espera del área	\N
352	en espera del área	\N
353	en espera del área	\N
354	en espera del área	\N
355	en espera del área	\N
356	en espera del área	\N
357	en espera del área	\N
358	en espera del área	\N
359	en espera del área	\N
360	en espera del área	\N
361	en espera del área	\N
362	en espera del área	\N
363	en espera del área	\N
364	en espera del área	\N
365	en espera del área	\N
366	en espera del área	\N
367	en espera del área	\N
368	en espera del área	\N
369	en espera del área	\N
370	en espera del área	\N
371	en espera del área	\N
372	en espera del área	\N
373	en espera del área	\N
374	en espera del área	\N
375	en espera del área	\N
376	en espera del área	\N
377	en espera del área	\N
378	en espera del área	\N
379	en espera del área	\N
380	en espera del área	\N
381	en espera del área	\N
382	en espera del área	\N
383	en espera del área	\N
384	en espera del área	\N
385	en espera del área	\N
386	en espera del área	\N
387	en espera del área	\N
388	en espera del área	\N
389	en espera del área	\N
390	en espera del área	\N
391	en espera del área	\N
392	en espera del área	\N
393	en espera del área	\N
394	en espera del área	\N
395	en espera del área	\N
396	en espera del área	\N
397	en espera del área	\N
398	en espera del área	\N
399	en espera del área	\N
400	en espera del área	\N
401	en espera del área	\N
402	en espera del área	\N
403	en espera del área	\N
404	en espera del área	\N
405	en espera del área	\N
406	en espera del área	\N
407	en espera del área	\N
408	en espera del área	\N
409	en espera del área	\N
410	en espera del área	\N
411	en espera del área	\N
412	en espera del área	\N
413	en espera del área	\N
414	en espera del área	\N
415	en espera del área	\N
416	en espera del área	\N
417	en espera del área	\N
418	en espera del área	\N
419	en espera del área	\N
420	en espera del área	\N
421	en espera del área	\N
422	en espera del área	\N
423	en espera del área	\N
425	en espera del área	\N
426	en espera del área	\N
427	en espera del área	\N
428	en espera del área	\N
429	en espera del área	\N
431	en espera del área	\N
432	en espera del área	\N
433	en espera del área	\N
434	en espera del área	\N
435	en espera del área	\N
439	en espera del área	\N
440	en espera del área	\N
441	en espera del área	\N
442	espera seguridad	\N
443	espera seguridad	\N
451	espera seguridad	\N
444	espera seguridad	\N
303	espera seguridad	\N
232	espera seguridad	\N
452	en espera del área	\N
453	en espera del área	\N
454	en espera del área	\N
455	en espera del área	\N
300	terminado	fdfdfdhfdh
450	terminado	Esta es la prueba del permiso 2
448	terminado	permiso cancelado
447	terminado	permiso cancelado
436	activo	\N
456	en espera del área	\N
458	en espera del área	\N
459	en espera del área	\N
460	en espera del área	\N
461	en espera del área	\N
462	en espera del área	\N
463	en espera del área	\N
465	en espera del área	\N
541	terminado	Se culminó con la actividad
306	terminado	prueba de permiso no peligro terminado
499	cancelado	dsfsdf
516	cancelado	prueba de permiso peligroso cancelado
474	cancelado	permiso apertura peurba de cancelacion pt4
526	terminado	prueba del pt4 terminado
494	terminado	permiso terminado por lluvia
515	cancelado	permiso cancelado prueba del permiso numero 4 altura
527	espera seguridad	\N
500	terminado	de cancelado a terminado pt1
518	terminado	dfds
479	cancelado	de terminado a cancelado
457	terminado	sddsfdsfds
485	terminado	dgdfgdfg
503	en espera del área	\N
530	en espera del área	\N
294	terminado	esta prueba es a mi correo
560	activo	\N
519	cancelado	cancelado
502	cancelado	f
445	terminado	kjjkkjkjk
486	en espera del área	\N
487	en espera del área	\N
488	en espera del área	\N
424	terminado	dfgfdg fdfdgdfg
291	terminado	este permiso esta en opip
491	en espera del área	\N
469	terminado	gfhgf
471	en espera del área	\N
529	activo	\N
467	espera seguridad	\N
466	espera seguridad	\N
106	terminado	dsgdsg
542	cancelado	Comenzó a llover
472	en espera del área	\N
473	en espera del área	\N
520	cancelado	permiso cancelado
446	terminado	ffdg
470	cancelado	gdffgfd
464	espera seguridad	\N
501	espera seguridad	\N
504	terminado	jghhg
476	en espera del área	\N
477	en espera del área	\N
521	espera seguridad	\N
506	en espera del área	\N
478	terminado	JJJHJH
522	espera seguridad	\N
495	terminado	fgdfg
449	terminado	esta es la prueba del cierre del permiso
480	espera seguridad	\N
481	espera seguridad	\N
468	espera seguridad	\N
483	espera seguridad	\N
561	activo	\N
39	cancelado	permiso cancelado pt no peligroso
532	activo	\N
493	terminado	terminado
505	activo	\N
507	activo	\N
482	terminado	permiso terminado
489	espera seguridad	\N
534	en espera del área	\N
508	cancelado	sdfdsf
490	terminado	dfgfdg
543	terminado	Todo OK
509	en espera del área	\N
510	en espera del área	\N
496	en espera del área	\N
512	en espera del área	\N
484	terminado	sdsdfds
523	cancelado	cancelado comentario de prueba
535	espera seguridad	\N
498	terminado	permiso terminado sistemas pt1 prueba1
513	terminado	cierre de prueaba
514	en espera del área	\N
497	terminado	dfdsfds
536	espera seguridad	\N
544	en espera del área	\N
511	espera seguridad	\N
517	activo	\N
545	en espera del área	\N
524	cancelado	cancelado
492	terminado	dffdg
546	en espera del área	\N
533	cancelado	permiso cancelado
547	en espera del área	\N
548	en espera del área	\N
549	en espera del área	\N
525	cancelado	permiso cancelado
531	cancelado	permiso cancelado por lluvia
537	en espera del área	\N
538	en espera del área	\N
539	en espera del área	\N
540	activo	\N
552	en espera del área	\N
553	en espera del área	\N
554	en espera del área	\N
555	en espera del área	\N
556	en espera del área	\N
557	en espera del área	\N
558	espera seguridad	\N
562	activo	\N
551	activo	\N
528	activo	\N
559	activo	\N
563	espera seguridad	\N
565	en espera del área	\N
566	en espera del área	\N
567	en espera del área	\N
568	en espera del área	\N
570	en espera del área	\N
571	en espera del área	\N
572	en espera del área	\N
564	espera seguridad	\N
573	espera seguridad	\N
569	espera seguridad	\N
550	espera seguridad	\N
475	no autorizado	dssaf ds sfdd
575	no autorizado	No se autorizo porque no cumple los requisitos
577	espera seguridad	\N
589	en espera del área	\N
576	no autorizado	No se autorizo por falta de empleados
578	espera seguridad	\N
579	espera seguridad	\N
580	espera seguridad	\N
581	en espera del área	\N
584	no autorizado	x
590	en espera del área	\N
582	espera seguridad	\N
583	en espera del área	\N
574	no autorizado	dsdfdsfsdf
585	en espera del área	\N
591	en espera del área	\N
586	activo	\N
587	en espera del área	\N
588	en espera del área	\N
430	espera seguridad	\N
3	no autorizado	ZCCZ
592	en espera del área	\N
593	en espera del área	\N
596	espera seguridad	\N
599	no autorizado	\N
598	no autorizado	no autorizar
597	activo	\N
600	en espera del área	\N
601	espera seguridad	\N
602	espera seguridad	\N
594	espera seguridad	\N
595	no autorizado	no autorizo
603	en espera del área	\N
604	espera seguridad	\N
605	espera seguridad	\N
606	en espera del área	\N
607	en espera del área	\N
608	en espera del área	\N
609	en espera del área	\N
610	en espera del área	\N
611	en espera del área	\N
612	en espera del área	\N
613	en espera del área	\N
614	en espera del área	\N
615	en espera del área	\N
616	en espera del área	\N
617	en espera del área	\N
621	en espera del área	\N
623	en espera del área	\N
624	en espera del área	\N
625	en espera del área	\N
626	en espera del área	\N
627	en espera del área	\N
628	en espera del área	\N
618	no autorizado	no se autorizo xd
619	espera seguridad	\N
629	espera seguridad	\N
620	no autorizado	el mpotivo es la prueba
622	activo	\N
630	en espera del área	\N
631	en espera del área	\N
632	en espera del área	\N
\.


--
-- TOC entry 5130 (class 0 OID 26037)
-- Dependencies: 233
-- Data for Name: jefe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jefe (id_jefe, usuario, "contraseña") FROM stdin;
1	admin.jefe	cursoN8N25*
\.


--
-- TOC entry 5132 (class 0 OID 26041)
-- Dependencies: 235
-- Data for Name: permisos_trabajo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permisos_trabajo (id_permiso, fecha_hora, id_area, id_departamento, id_sucursal, id_tipo_permiso, id_estatus, id_ast, prefijo, contrato) FROM stdin;
1	2025-11-13 20:10:14.461	1	1	2	8	594	361	GSI-PT-N1	s
2	2025-11-13 20:11:55.808	1	1	1	8	595	362	GSI-PT-N2	ds
3	2025-11-13 20:30:49.416	1	1	2	8	596	363	GSI-PT-N3	contrato
4	2025-11-13 21:23:39.381	1	1	2	8	597	364	GSI-PT-N4	s
5	2025-11-13 21:32:22.884	1	1	2	8	598	365	GSI-PT-N5	contrato
6	2025-11-13 23:27:21.817	1	1	2	8	599	366	GSI-PT-N6	contrato
8	2025-11-13 23:54:57.3	5	1	2	8	601	367	GSI-PT-N8	x
9	2025-11-13 23:57:39.463	1	3	2	8	602	368	GSI-PT-N9	s
10	2025-11-15 23:18:05.647	1	1	2	1	604	369	GSI-PT-N10	a
11	2025-11-15 23:21:56.514	1	1	2	2	605	370	GSI-PT-N11	s
13	2025-11-16 20:14:00.638	1	1	2	9	616	372	GSI-PT-N13	numero
14	2025-11-16 20:22:30.271	1	1	1	9	617	373	GSI-PT-N14	s
15	2025-11-16 20:27:17.232	1	1	2	9	618	374	GSI-PT-N15	s
16	2025-11-16 20:43:44.382	1	1	2	9	619	375	GSI-PT-N16	s
17	2025-11-16 20:46:48.541	1	1	2	9	620	376	GSI-PT-N17	contrato
18	2025-11-16 20:57:32.012	1	1	2	9	621	377	GSI-PT-N18	contrato
19	2025-11-16 21:11:06.155	1	1	1	9	622	378	GSI-PT-N19	contrato
20	2025-11-16 21:52:11.551	1	1	2	9	628	379	GSI-PT-N20	\N
21	2025-11-16 23:21:52.56	1	1	2	8	629	380	GSI-PT-N21	s
22	2025-11-16 23:57:13.997	1	1	2	10	630	381	GSI-PT-N22	s
23	2025-11-17 00:20:59.438	1	1	1	10	631	382	GSI-PT-N23	s
24	2025-11-17 00:39:13.873	1	1	2	10	632	383	GSI-PT-N24	s
\.


--
-- TOC entry 5134 (class 0 OID 26046)
-- Dependencies: 237
-- Data for Name: pt_altura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pt_altura (id, id_permiso, tipo_mantenimiento, ot_numero, tag, hora_inicio, equipo_intervenir, descripcion_trabajo, nombre_solicitante, empresa, requiere_escalera, requiere_canastilla_grua, aseguramiento_estrobo, requiere_andamio_cama_completa, otro_tipo_acceso, acceso_libre_obstaculos, canastilla_asegurada, andamio_completo, andamio_seguros_zapatas, escaleras_buen_estado, linea_vida_segura, arnes_completo_buen_estado, suspender_trabajos_adyacentes, numero_personas_autorizadas, trabajadores_aptos_evaluacion, requiere_barreras, observaciones, fecha_creacion, fecha_actualizacion, fluido, presion, temperatura, proteccion_especial, proteccion_especial_cual, equipo_caidas, equipo_caidas_cual, linea_amortiguador, punto_fijo, linea_vida, andamio_completo_opcion, tarjeta_andamio, viento_permitido, escalera_condicion, tipo_escalera, cual_acceso, equipo_intervencion) FROM stdin;
\.


--
-- TOC entry 5136 (class 0 OID 26054)
-- Dependencies: 239
-- Data for Name: pt_apertura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pt_apertura (id, id_permiso, fecha_creacion, fecha_actualizacion, tipo_mantenimiento, otro_tipo_mantenimiento, ot_numero, tag, hora_inicio, tiene_equipo_intervenir, descripcion_equipo, fluido, presion, temperatura, antecedentes, requiere_herramientas_especiales, tipo_herramientas_especiales, herramientas_adecuadas, requiere_verificacion_previa, requiere_conocer_riesgos, observaciones_medidas, fuera_operacion, despresurizado_purgado, necesita_aislamiento, con_valvulas, con_juntas_ciegas, producto_entrampado, requiere_lavado, requiere_neutralizado, requiere_vaporizado, suspender_trabajos_adyacentes, acordonar_area, prueba_gas_toxico_inflamable, equipo_electrico_desenergizado, tapar_purgas_drenajes, proteccion_especial_recomendada, proteccion_piel_cuerpo, proteccion_respiratoria, proteccion_ocular, proteccion_contraincendio, tipo_proteccion_contraincendio, instalacion_barreras, observaciones_riesgos, co2_nivel, nh3_nivel, oxigeno_nivel, lel_nivel, descripcion_trabajo, nombre_solicitante, empresa, aprobado_co2, aprobado_nh3, aprobado_oxigeno, aprobado_lel) FROM stdin;
64	11	2025-11-15 23:21:56.555346	2025-11-15 23:21:56.555346	PREDICTIVO	\N	\N	\N	23:19:00	\N	\N	-	-	-	\N	N/A	\N	NO	NO	SI	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	s	s	s	\N	\N	\N	\N
\.


--
-- TOC entry 5157 (class 0 OID 34204)
-- Dependencies: 260
-- Data for Name: pt_cesta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pt_cesta (id, fecha_creacion, id_permiso, tipo_mantenimiento, ot_numero, tag, hora_inicio, equipo_intervenir, descripcion_trabajo, nombre_solicitante, empresa, identificacion_grua_cesta, empresa_grua_cesta, identificacion_cesta, carga_maxima_cesta, empresa_cesta, peso_cesta, ultima_revision_cesta, condicion, especificacion_ext_gatos, utiliza_plumin_cesta, especificacion_plumin_cesta, longitud_pluma_cesta, radio_trabajo_cesta, carga_segura_cesta, peso_carga_cesta, peso_gancho_elementos, carga_trabajo_cesta, relacion_carga_segura_cesta, carga_prueba, prueba_realizada, prueba_presenciada_por, firma_prueba, fecha_prueba, mascaras_escape_cesta, especificacion_mascaras, equipo_proteccion_cesta, especificacion_equipo_proteccion, equipo_contra_incendios_cesta, especificacion_equipo_incendios, final_carrera_cesta, otras_medidas_cesta, especificacion_otras_medidas_cesta, observaciones_generales_cesta, asentamiento, calzado, nivelacion, ext_gatos) FROM stdin;
1	2025-11-16 20:27:17.269353	15	CORRECTIVO	ot no	tag	\N	Equipo a intervenir	s	s	s	identificacion	perteneciente	identi. cesta	322	perteneciente	23	2025-11-17		especificar	no	relacion carga	23	44	23	33	53	32	relacion carga	12	no	prueba presenciada	firma	2025-11-17	1	especificar mascara	1	especificar cesta	1	especificar cesta incendio	1	1	otras medidas	observaciones	\N	\N	\N	\N
2	2025-11-16 20:43:44.411112	16	CORRECTIVO	ot no	tag	\N	equipo intervenir	s	s	empresa	identificacion	perteneciente grua	identi. cesta	34	perteneciente grua	34	2025-11-17		especificar	no	sin plumin	122	21	12	123	23	33	sin plumin	12	no	prueba presenciada	firma	2025-11-17	si	especificar mascara	no	especificar cesta	si	especificar cesta incendio	no	si	otras medidas	observaciones generales	\N	\N	\N	\N
3	2025-11-16 20:46:48.610669	17	CORRECTIVO	ot no	TAG	\N	equipo intervenir	descripcion	nombre de quien solicita	empresa	identificacion	perteneciente	identi. cesta	43	perteneciente	4	2025-11-17		especificar	no	relacion carga	3	4	5	6	7	8	relacion carga	67	si	prueba presenciada	firma	2025-11-17	si	especificar mascara	no	especificar cesta	si	especificar cesta incendio	no	si	otras medidas	observacion	SI		SI	SI
4	2025-11-16 21:11:06.182668	19	PREVENTIVO	ot no	TAG	00:00:00	equipo intervenir	descruipcion	nombre de quien solicita	empresa	identificacion	perteneciente	identi. cesta	2	perteneciente	1	2025-11-17		especificar	no	plumin	4	5	6	7	8	9	plumin	10	no	prueba presenciada	firma	2025-11-17	si	especificar mascara	no		si	especificar cesta incendio	no	si	otras medidas	observaciones	SI	NO	SI	NO
5	2025-11-16 21:52:11.591844	20	APOYO	ot no	tag	21:50:00	s	descripcion	nombre de quien solicita	empresa	identificacion	perteneciente grua	identi. cesta	2	perteneciente grua	1	2025-11-17		especificar	no	afirmativo	2	3	4	5	6	7	afirmativo	4	no	5	firma	2025-11-17	si	especificar mascara	no	especificar cesta	si	especificar cesta incendio	no	si	otras medidas	observaciones	SI	NO	SI	NO
\.


--
-- TOC entry 5138 (class 0 OID 26086)
-- Dependencies: 241
-- Data for Name: pt_confinados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pt_confinados (id, id_permiso, tipo_mantenimiento, ot_numero, tag, hora_inicio, equipo_intervenir, avisos_trabajos, iluminacion_prueba_explosion, ventilacion_forzada, evaluacion_medica_aptos, cable_vida_trabajadores, vigilancia_exterior, nombre_vigilante, personal_rescatista, nombre_rescatista, instalar_barreras, equipo_especial, tipo_equipo_especial, numero_personas_autorizadas, tiempo_permanencia_min, tiempo_recuperacion_min, clase_espacio_confinado, observaciones_adicionales, fecha_creacion, fecha_actualizacion, descripcion_trabajo, nombre_solicitante, verificar_explosividad, verificar_gas_toxico, verificar_deficiencia_oxigeno, verificar_enriquecimiento_oxigeno, verificar_polvo_humos_fibras, verificar_amoniaco, verificar_material_piel, verificar_temperatura, verificar_lel, suspender_trabajos_adyacentes, acordonar_area, prueba_gas_toxico_inflamable, porcentaje_lel, nh3, porcentaje_oxigeno, equipo_despresionado_fuera_operacion, equipo_aislado, equipo_aislado_valvula, equipo_aislado_junta_ciega, equipo_lavado, equipo_neutralizado, equipo_vaporizado, aislar_purgas_drenaje_venteo, abrir_registros_necesarios, observaciones_requisitos, fluido, presion, temperatura, empresa, vigilancia_exterior_opcion, proteccion_piel_cuerpo, proteccion_piel_detalle, proteccion_respiratoria, proteccion_respiratoria_detalle, proteccion_ocular, proteccion_ocular_detalle, arnes_seguridad, cable_vida, ventilacion_forzada_opcion, ventilacion_forzada_detalle, iluminacion_explosion, prueba_gas_aprobado, param_co2, valor_co2, param_amoniaco, valor_amoniaco, param_oxigeno, valor_oxigeno, param_explosividad_lel, valor_explosividad_lel, param_otro, param_otro_detalle, valor_otro, observaciones, contrato) FROM stdin;
\.


--
-- TOC entry 5140 (class 0 OID 26096)
-- Dependencies: 243
-- Data for Name: pt_electrico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pt_electrico (id, id_permiso, tipo_mantenimiento, tipo_mantenimiento_otro, ot_numero, tag, hora_inicio, equipo_intervenir, empresa, descripcion_trabajo, nombre_solicitante, equipo_desenergizado, interruptores_abiertos, verificar_ausencia_voltaje, candados_equipo, tarjetas_alerta, aviso_personal_area, tapetes_dielectricos, herramienta_aislante, pertiga_telescopica, equipo_proteccion_especial, tipo_equipo_proteccion, aterrizar_equipo, barricadas_area, observaciones_adicionales, fecha_creacion, fecha_actualizacion, identifico_equipo, verifico_identifico_equipo, fuera_operacion_desenergizado, verifico_fuera_operacion_desenergizado, candado_etiqueta, verifico_candado_etiqueta, suspender_adyacentes, verifico_suspender_adyacentes, area_limpia_libre_obstaculos, verifico_area_limpia_libre_obstaculos, libranza_electrica, verifico_libranza_electrica, nivel_tension, equipo_proteccion_especial_supervisor, cual_equipo_proteccion, observaciones_medidas) FROM stdin;
\.


--
-- TOC entry 5159 (class 0 OID 34219)
-- Dependencies: 262
-- Data for Name: pt_excavacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pt_excavacion (id, fecha_creacion, id_permiso, tipo_mantenimiento, ot_numero, tag, hora_inicio, equipo_intervenir, descripcion_trabajo, nombre_solicitante, empresa, profundidad_media, profundidad_maxima, anchura, longitud, tipo_terreno, tuberia_gas, tipo_gas, comprobado_gas, fecha_gas, linea_electrica, voltaje_linea, comprobado_electrica, fecha_electrica, tuberia_incendios, presion_incendios, comprobado_incendios, fecha_incendios, alcantarillado, diametro_alcantarillado, comprobado_alcantarillado, fecha_alcantarillado, otras_instalaciones, especificacion_otras_instalaciones, comprobado_otras, fecha_otras, requiere_talud, angulo_talud, requiere_bermas, longitud_meseta, altura_contrameseta, requiere_entibacion, tipo_entibacion, condiciones_terreno_entibacion, otros_requerimientos, especificacion_otros_requerimientos, distancia_seguridad_estatica, distancia_seguridad_dinamica, requiere_balizamiento, distancia_balizamiento, requiere_proteccion_rigida, distancia_proteccion_rigida, requiere_senalizacion_especial, especificacion_senalizacion, requiere_proteccion_anticaida, tipo_proteccion_anticaida, tipo_anclaje, excavacion_espacio_confinado, excavacion_manual_aproximacion, medidas_aproximacion, herramienta_antichispa, guantes_calzado_dielectrico, epp_especial, otras_medidas_especiales, especificacion_otras_medidas_especiales, aplicar_bloqueo_fisico, especificacion_bloqueo_fisico, drenar_limpiar_lavar, inundar_anegar_atmosfera_inerte, vigilante_continuo, especificacion_vigilante_continuo, otras_medidas_adicionales, especificacion_otras_medidas_adicionales, observaciones_generales_excavacion) FROM stdin;
1	2025-11-16 23:57:14.040458	22	CORRECTIVO	ot no	TAG	23:53:00	\N	s	s	s	1	2	3	4	5	no	\N	\N	\N	no	\N	\N	\N	no	\N	\N	\N	no	\N	\N	\N	no	\N	\N	\N	no	1	no	23	\N	no	Semicuajada	\N	no	\N	\N	\N	no	2	no	\N	\N	\N	no	sin tipo	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	2025-11-17 00:20:59.506697	23	PREDICTIVO	ot no	TAG	00:18:00	\N	s	s	s	1	2	3	4	5	si	\N	\N	\N	si	\N	\N	\N	si	\N	\N	\N	si	\N	\N	\N	si	\N	\N	\N	si		si		\N	si		\N	si	\N	\N	\N	no	1	no	\N	\N	\N	no	sin tipo	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	2025-11-17 00:39:13.91522	24	PREVENTIVO	ot no	TAG	00:37:00	equipo intervenir	s	s	s	1	3	2	4	5	no	GAS	NOMBREGAS	2025-11-18	no	1	NOMBREelectrico	2025-11-18	no	2	NOMBREincendio	2025-11-19	no	3	NOMBREalcanta	2025-11-20	no	tipo	NOMBREOTROS	2025-11-18	no	1	no	2	3	no	Ligera	sd	no	ss	11	22	no	2	no	3	no	sin especificar	no	sin tipo	anclaje	no	no	no 	true	false	true	false	otros medidas	true	bloqueo	false	true	false	vigilanta	true	adicionales	sdd
\.


--
-- TOC entry 5142 (class 0 OID 26104)
-- Dependencies: 245
-- Data for Name: pt_fuego; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pt_fuego (id, id_permiso, tipo_mantenimiento, tipo_mantenimiento_otro, ot_numero, tag, hora_inicio, equipo_intervenir, empresa, descripcion_trabajo, fecha_creacion, fecha_actualizacion, nombre_solicitante, fuera_operacion, despresurizado_purgado, producto_entrampado, necesita_aislamiento, con_valvulas, con_juntas_ciegas, requiere_lavado, requiere_neutralizado, requiere_vaporizado, suspender_trabajos_adyacentes, acordonar_area, prueba_gas_toxico_inflamable, equipo_electrico_desenergizado, tapar_purgas_drenajes, ventilacion_forzada, limpieza_interior, instalo_ventilacion_forzada, equipo_conectado_tierra, cables_pasan_drenajes, cables_uniones_intermedias, equipo_proteccion_personal, fluido, presion, temperatura, explosividad_interior, explosividad_exterior, vigia_contraincendio, manguera_contraincendio, cortina_agua, extintor_contraincendio, cubrieron_drenajes, co2, amoniaco, oxigeno, explosividad_lel, otro_gas_cual, observaciones_gas) FROM stdin;
\.


--
-- TOC entry 5155 (class 0 OID 34189)
-- Dependencies: 258
-- Data for Name: pt_izaje; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pt_izaje (id, fecha_creacion, id_permiso, tipo_mantenimiento, ot_numero, tag, hora_inicio, equipo_intervenir, descripcion_trabajo, nombre_solicitante, empresa, hora_inicio_prevista, responsable_operacion, hora_fin_prevista, empresa_grua, identificacion_grua, declaracion_conformidad, inspeccion_periodica, mantenimiento_preventivo, inspeccion_diaria, diagrama_cargas, libro_instrucciones, limitador_carga, final_carrera, nombre_operador, empresa_operador, licencia_operador, numero_licencia, fecha_emision_licencia, vigencia_licencia, tipo_licencia, comentarios_operador, estrobos_eslingas, grilletes, otros_elementos_auxiliares, especificacion_otros_elementos, requiere_eslingado_especifico, especificacion_eslingado, extension_gatos, sobre_ruedas, especificacion_sobre_ruedas, utiliza_plumin_si, especificacion_plumin, longitud_pluma, radio_trabajo, contrapeso, sector_trabajo, carga_segura_diagrama, peso_carga, determinada_por, carga_trabajo, peso_gancho_eslingas, relacion_carga_carga_segura, asentamiento, calzado, extension_gatos_check, nivelacion, contrapeso_check, sector_trabajo_check, comprobado_por, balizamiento_operacion, reunion_previa, especificacion_reunion_previa, presentacion_supervisor, nombre_supervisor, permiso_adicional, especificacion_permiso_adicional, otras_medidas_seguridad, especificacion_otras_medidas, observaciones_generales) FROM stdin;
1	2025-11-13 20:10:14.534482	1	CORRECTIVO	s	s	20:09:00	s	s	s	s	20:09:00	s	20:09:00	s	s	si	no	si	no	si	no	si	no	s	s	no	s	2025-11-14	s			si	no	si	s	no	s			s		s	23	23	23	360°	23	23	sdf	fasds	23		si	no	si	no	si	no	23dsf	si	no	sdf	si	fsd	no	sdf	si	fds	dsfdsf
2	2025-11-13 20:11:55.850972	2	PREVENTIVO	sdfs	sdf	20:10:00	sfd	sd	sd	ds	20:10:00	sdf	20:10:00	sdf	dfs	si	no	no	no	no	si	no	si	sdf	sfd	no	sdf	2025-11-15	sdf			si	no	si	dsf	no	sdf			dsf		dsf	34	234	234	360°	342	43	sdf	sdf	43	sdf	si	no	no	no	no	si	sdf	si	no	dfs	si	sfd	no	dsf	si	dfs	dsf
3	2025-11-13 20:30:49.447467	3	PREVENTIVO	ot no	tag	20:14:00	equipo intervenir	desripcion 	nombre de quien solicita	empresa	20:14:00	responsable empresa	20:14:00	empresa	identificacion	si	no	no	si	no	no	si	si	nombre	empresa	si	numero	2025-11-14	vigencia			si	no	si	especificar	no	indicarlo			especificar		especificar	12	23	23	360°	35	34	determinada	carga trabajo	34	afirmativo	si	no	no	si	no	no	comprobado por	si	no	reunion previa	si	nombre presentacion	no	permiso adicional	no	otras medidas	OBSERVACIONES GENERALES
4	2025-11-13 21:23:39.413895	4	PREVENTIVO	ot no	TAG	21:18:00	equipo a intervenir	s	s	s	21:18:00	responsable empresa	21:18:00	empresa	identificacion	no	si	no	si	no	si	no	si	nombre	empresa	no	numero lic	2025-11-14	vigencia	tipo	comentarios	si	no	si	especificar	no	indicarlo			especificar		especificar	2	34	34	360°	34	34	por mi	carga trabajo	34	afirmativo	si	si	no	si	no	si	Comprobado por:	si	no	reunion previa	si	indicar nombre	no	adicional	si	medidas	OBSERVACIONES GENERALES
5	2025-11-13 21:32:22.916938	5	CORRECTIVO	ot no	TAG	21:27:00	equipo intervenir	descripcion	nombre de quien solicita	empresa	21:27:00	diego ramirez	21:27:00	empresa	identificacion	si	no	si	no	si	no	si	no	nombre	empresa	no	numero lic	2025-11-14	vigencia	tipo	comentarios	si	no	si	especificar	no	indicarlo			especificar		especificar	45	5644	56	360°	67	85	determinada	carga trabajo	85	afirmativo	si	no	si	no	si	no	comprobado por	si	no	reunion previa	si	nombre presentacion	no	permiso adicional	si	otras medidas	observaciones
6	2025-11-13 23:27:21.859604	6	PREVENTIVO	ot no	TAG	23:25:00	equipo intervenir	descripcion	nombre de quien solicita	empresa	23:25:00	responsable empresa	23:25:00	empresa	identificacion	no	si	no	no	si	no	no	si	nombre	empresa	no	numero	2025-11-14	vigencia	tipo	comentarios	no	no	si	especificar	si	indicarlo	50%	50%	especificar	si		45	43	23	Por Detrás	55	22	determinada	carga trabajo	67	77	no	no	no	si	si	si	Comprobado por:	si	si	reunion previa	no	nombre presentacion	no	permiso adicional	si	otras medidas	OBSERVACIONES GENERALES
7	2025-11-13 23:54:57.329389	8	PREVENTIVO	x	x	23:54:00	x	x	x	x	23:54:00	x	23:54:00	x	x	no	no	si	no	no	no	no	no			no		2025-11-14				no	no	no		no			no		no												no	no	no	no	no	no		no	no		no		no		no		
8	2025-11-13 23:57:39.491371	9		s	s	23:00:00	s	s	s	s	23:00:00	s	23:57:00			no	no	no	no	no	no	no	no			no		2025-11-14				no	no	no		no			no		no												no	no	no	no	no	no		no	no		no		no		no		
9	2025-11-16 23:21:52.602058	21	CORRECTIVO	s	s	23:21:00	s	s	s	s	23:21:00	s	23:21:00	s	s	no	si	no	no	si	no	no	no			no		2025-11-17				no	no	no		no			no		no												no	no	no	no	no	no		no	no		no		no		no		
\.


--
-- TOC entry 5144 (class 0 OID 26112)
-- Dependencies: 247
-- Data for Name: pt_no_peligroso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pt_no_peligroso (id_ptnp, id_permiso, nombre_solicitante, descripcion_trabajo, tipo_mantenimiento, ot_no, equipo_intervencion, hora_inicio, tag, fluido, presion, temperatura, empresa, trabajo_area_riesgo_controlado, necesita_entrega_fisica, necesita_ppe_adicional, area_circundante_riesgo, necesita_supervision, observaciones_analisis_previo) FROM stdin;
163	10	a	a	CORRECTIVO	s	s	2025-11-16 23:17:00	s				a						
\.


--
-- TOC entry 5146 (class 0 OID 26118)
-- Dependencies: 249
-- Data for Name: pt_radiacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pt_radiacion (id, id_permiso, tipo_mantenimiento, tipo_mantenimiento_otro, ot_numero, tag, hora_inicio, equipo_intervenir, empresa, descripcion_trabajo, nombre_solicitante, tipo_fuente_radiactiva, actividad_radiactiva, numero_serial_fuente, distancia_trabajo, tiempo_exposicion, dosis_estimada, equipo_proteccion_radiologica, dosimetros_personales, monitores_radiacion_area, senalizacion_area, barricadas, protocolo_emergencia, personal_autorizado, observaciones_radiacion, fecha_creacion, fecha_actualizacion, fluido, presion, temperatura, marca_modelo, marca_modelo_check, tipo_isotopo, tipo_isotopo_check, numero_fuente, numero_fuente_check, actividad_fuente, actividad_fuente_check, fecha_dia, fecha_mes, fecha_anio) FROM stdin;
\.


--
-- TOC entry 5148 (class 0 OID 26126)
-- Dependencies: 251
-- Data for Name: sucursales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sucursales (id_sucursal, nombre) FROM stdin;
1	Pajaritos
2	Area 6
\.


--
-- TOC entry 5150 (class 0 OID 26130)
-- Dependencies: 253
-- Data for Name: supervisores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supervisores (id_supervisor, nombre, correo, extension, "contraseña", usuario) FROM stdin;
1	José Garcia Vidal	jose.garcia@proagroindustria.com	595	cursoN8N25*	jose.garcia
3	Carol Dalina del Angel	carol@proagroindustria.com	345	cursoN8N25*	carol.dalina
\.


--
-- TOC entry 5152 (class 0 OID 26136)
-- Dependencies: 255
-- Data for Name: tipos_permisos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipos_permisos (id_tipo_permiso, nombre) FROM stdin;
1	PT No Peligroso
2	PT para Apertura Equipo Línea
3	PT de Entrada a Espacio Confinado
4	PT en Altura
5	PT de Fuego Abierto
6	PT con Energía Eléctrica
7	PT con Fuentes Radioactivas
8	PT para Izaje con Hiab con Grúa
9	PT con Cesta Izada
10	PT de Excavacion
\.


--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 218
-- Name: areas_id_area_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.areas_id_area_seq', 5, true);


--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 221
-- Name: ast_actividades_id_ast_actividades_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ast_actividades_id_ast_actividades_seq', 377, true);


--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 222
-- Name: ast_id_ast_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ast_id_ast_seq', 383, true);


--
-- TOC entry 5178 (class 0 OID 0)
-- Dependencies: 224
-- Name: ast_participan_id_ast_participan_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ast_participan_id_ast_participan_seq', 441, true);


--
-- TOC entry 5179 (class 0 OID 0)
-- Dependencies: 226
-- Name: autorizaciones_id_autorizacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.autorizaciones_id_autorizacion_seq', 196, true);


--
-- TOC entry 5180 (class 0 OID 0)
-- Dependencies: 228
-- Name: categorias_seguridad_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_seguridad_id_categoria_seq', 2, true);


--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 230
-- Name: departamentos_id_departamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departamentos_id_departamento_seq', 3, true);


--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 232
-- Name: estatus_id_estatus_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estatus_id_estatus_seq', 632, true);


--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 234
-- Name: jefe_id_jefe_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jefe_id_jefe_seq', 1, true);


--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 236
-- Name: permisos_trabajo_id_permiso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permisos_trabajo_id_permiso_seq', 24, true);


--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 238
-- Name: pt_altura_id_altura_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pt_altura_id_altura_seq', 15, true);


--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 240
-- Name: pt_apertura_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pt_apertura_id_seq', 64, true);


--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 259
-- Name: pt_cesta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pt_cesta_id_seq', 5, true);


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 242
-- Name: pt_confinados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pt_confinados_id_seq', 26, true);


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 244
-- Name: pt_electrico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pt_electrico_id_seq', 16, true);


--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 261
-- Name: pt_excavacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pt_excavacion_id_seq', 3, true);


--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 246
-- Name: pt_fuego_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pt_fuego_id_seq', 15, true);


--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 257
-- Name: pt_izaje_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pt_izaje_id_seq', 9, true);


--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 248
-- Name: pt_no_peligroso_id_ptnp_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pt_no_peligroso_id_ptnp_seq', 163, true);


--
-- TOC entry 5194 (class 0 OID 0)
-- Dependencies: 250
-- Name: pt_radiacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pt_radiacion_id_seq', 9, true);


--
-- TOC entry 5195 (class 0 OID 0)
-- Dependencies: 252
-- Name: sucursales_id_sucursal_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sucursales_id_sucursal_seq', 2, true);


--
-- TOC entry 5196 (class 0 OID 0)
-- Dependencies: 254
-- Name: supervisores_id_supervisor_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supervisores_id_supervisor_seq', 3, true);


--
-- TOC entry 5197 (class 0 OID 0)
-- Dependencies: 256
-- Name: tipos_permisos_id_tipo_permiso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_permisos_id_tipo_permiso_seq', 10, true);


--
-- TOC entry 4903 (class 2606 OID 26157)
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id_area);


--
-- TOC entry 4907 (class 2606 OID 26159)
-- Name: ast_actividades ast_actividades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ast_actividades
    ADD CONSTRAINT ast_actividades_pkey PRIMARY KEY (id_ast_actividades);


--
-- TOC entry 4909 (class 2606 OID 26161)
-- Name: ast_participan ast_participan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ast_participan
    ADD CONSTRAINT ast_participan_pkey PRIMARY KEY (id_ast_participan);


--
-- TOC entry 4905 (class 2606 OID 26163)
-- Name: ast ast_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ast
    ADD CONSTRAINT ast_pkey PRIMARY KEY (id_ast);


--
-- TOC entry 4911 (class 2606 OID 26165)
-- Name: autorizaciones autorizaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizaciones
    ADD CONSTRAINT autorizaciones_pkey PRIMARY KEY (id_autorizacion);


--
-- TOC entry 4913 (class 2606 OID 26167)
-- Name: categorias_seguridad categorias_seguridad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_seguridad
    ADD CONSTRAINT categorias_seguridad_pkey PRIMARY KEY (id_categoria);


--
-- TOC entry 4915 (class 2606 OID 26169)
-- Name: departamentos departamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT departamentos_pkey PRIMARY KEY (id_departamento);


--
-- TOC entry 4917 (class 2606 OID 26171)
-- Name: estatus estatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus
    ADD CONSTRAINT estatus_pkey PRIMARY KEY (id_estatus);


--
-- TOC entry 4919 (class 2606 OID 26173)
-- Name: jefe jefe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jefe
    ADD CONSTRAINT jefe_pkey PRIMARY KEY (id_jefe);


--
-- TOC entry 4921 (class 2606 OID 26175)
-- Name: permisos_trabajo permisos_trabajo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos_trabajo
    ADD CONSTRAINT permisos_trabajo_pkey PRIMARY KEY (id_permiso);


--
-- TOC entry 4923 (class 2606 OID 26177)
-- Name: pt_altura pt_altura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_altura
    ADD CONSTRAINT pt_altura_pkey PRIMARY KEY (id);


--
-- TOC entry 4925 (class 2606 OID 26179)
-- Name: pt_apertura pt_apertura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_apertura
    ADD CONSTRAINT pt_apertura_pkey PRIMARY KEY (id);


--
-- TOC entry 4945 (class 2606 OID 34212)
-- Name: pt_cesta pt_cesta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_cesta
    ADD CONSTRAINT pt_cesta_pkey PRIMARY KEY (id);


--
-- TOC entry 4927 (class 2606 OID 26181)
-- Name: pt_confinados pt_confinados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_confinados
    ADD CONSTRAINT pt_confinados_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 26183)
-- Name: pt_electrico pt_electrico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_electrico
    ADD CONSTRAINT pt_electrico_pkey PRIMARY KEY (id);


--
-- TOC entry 4947 (class 2606 OID 34227)
-- Name: pt_excavacion pt_excavacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_excavacion
    ADD CONSTRAINT pt_excavacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4931 (class 2606 OID 26185)
-- Name: pt_fuego pt_fuego_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_fuego
    ADD CONSTRAINT pt_fuego_pkey PRIMARY KEY (id);


--
-- TOC entry 4943 (class 2606 OID 34197)
-- Name: pt_izaje pt_izaje_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_izaje
    ADD CONSTRAINT pt_izaje_pkey PRIMARY KEY (id);


--
-- TOC entry 4933 (class 2606 OID 26187)
-- Name: pt_no_peligroso pt_no_peligroso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_no_peligroso
    ADD CONSTRAINT pt_no_peligroso_pkey PRIMARY KEY (id_ptnp);


--
-- TOC entry 4935 (class 2606 OID 26189)
-- Name: pt_radiacion pt_radiacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_radiacion
    ADD CONSTRAINT pt_radiacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4937 (class 2606 OID 26191)
-- Name: sucursales sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_pkey PRIMARY KEY (id_sucursal);


--
-- TOC entry 4939 (class 2606 OID 26193)
-- Name: supervisores supervisores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisores
    ADD CONSTRAINT supervisores_pkey PRIMARY KEY (id_supervisor);


--
-- TOC entry 4941 (class 2606 OID 26195)
-- Name: tipos_permisos tipos_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_permisos
    ADD CONSTRAINT tipos_permisos_pkey PRIMARY KEY (id_tipo_permiso);


--
-- TOC entry 4949 (class 2606 OID 26196)
-- Name: ast_actividades ast_actividades_id_ast_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ast_actividades
    ADD CONSTRAINT ast_actividades_id_ast_fkey FOREIGN KEY (id_ast) REFERENCES public.ast(id_ast);


--
-- TOC entry 4950 (class 2606 OID 26201)
-- Name: ast_participan ast_participan_id_estatus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ast_participan
    ADD CONSTRAINT ast_participan_id_estatus_fkey FOREIGN KEY (id_estatus) REFERENCES public.estatus(id_estatus);


--
-- TOC entry 4951 (class 2606 OID 26206)
-- Name: autorizaciones autorizaciones_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizaciones
    ADD CONSTRAINT autorizaciones_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias_seguridad(id_categoria);


--
-- TOC entry 4952 (class 2606 OID 26211)
-- Name: autorizaciones autorizaciones_id_supervisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizaciones
    ADD CONSTRAINT autorizaciones_id_supervisor_fkey FOREIGN KEY (id_supervisor) REFERENCES public.supervisores(id_supervisor);


--
-- TOC entry 4948 (class 2606 OID 26216)
-- Name: areas fk_areas_departamentos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT fk_areas_departamentos FOREIGN KEY (id_departamento) REFERENCES public.departamentos(id_departamento);


--
-- TOC entry 4959 (class 2606 OID 26221)
-- Name: pt_altura fk_permiso_altura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_altura
    ADD CONSTRAINT fk_permiso_altura FOREIGN KEY (id_permiso) REFERENCES public.permisos_trabajo(id_permiso) ON DELETE CASCADE;


--
-- TOC entry 4953 (class 2606 OID 26226)
-- Name: permisos_trabajo permisos_trabajo_id_area_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos_trabajo
    ADD CONSTRAINT permisos_trabajo_id_area_fkey FOREIGN KEY (id_area) REFERENCES public.areas(id_area);


--
-- TOC entry 4954 (class 2606 OID 26231)
-- Name: permisos_trabajo permisos_trabajo_id_ast_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos_trabajo
    ADD CONSTRAINT permisos_trabajo_id_ast_fkey FOREIGN KEY (id_ast) REFERENCES public.ast(id_ast);


--
-- TOC entry 4955 (class 2606 OID 26236)
-- Name: permisos_trabajo permisos_trabajo_id_departamento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos_trabajo
    ADD CONSTRAINT permisos_trabajo_id_departamento_fkey FOREIGN KEY (id_departamento) REFERENCES public.departamentos(id_departamento);


--
-- TOC entry 4956 (class 2606 OID 26241)
-- Name: permisos_trabajo permisos_trabajo_id_estatus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos_trabajo
    ADD CONSTRAINT permisos_trabajo_id_estatus_fkey FOREIGN KEY (id_estatus) REFERENCES public.estatus(id_estatus);


--
-- TOC entry 4957 (class 2606 OID 26246)
-- Name: permisos_trabajo permisos_trabajo_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos_trabajo
    ADD CONSTRAINT permisos_trabajo_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES public.sucursales(id_sucursal);


--
-- TOC entry 4958 (class 2606 OID 26251)
-- Name: permisos_trabajo permisos_trabajo_id_tipo_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos_trabajo
    ADD CONSTRAINT permisos_trabajo_id_tipo_permiso_fkey FOREIGN KEY (id_tipo_permiso) REFERENCES public.tipos_permisos(id_tipo_permiso);


--
-- TOC entry 4960 (class 2606 OID 26256)
-- Name: pt_apertura pt_apertura_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_apertura
    ADD CONSTRAINT pt_apertura_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permisos_trabajo(id_permiso);


--
-- TOC entry 4967 (class 2606 OID 34213)
-- Name: pt_cesta pt_cesta_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_cesta
    ADD CONSTRAINT pt_cesta_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permisos_trabajo(id_permiso);


--
-- TOC entry 4961 (class 2606 OID 26261)
-- Name: pt_confinados pt_confinados_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_confinados
    ADD CONSTRAINT pt_confinados_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permisos_trabajo(id_permiso);


--
-- TOC entry 4962 (class 2606 OID 26266)
-- Name: pt_electrico pt_electrico_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_electrico
    ADD CONSTRAINT pt_electrico_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permisos_trabajo(id_permiso);


--
-- TOC entry 4968 (class 2606 OID 34228)
-- Name: pt_excavacion pt_excavacion_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_excavacion
    ADD CONSTRAINT pt_excavacion_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permisos_trabajo(id_permiso);


--
-- TOC entry 4963 (class 2606 OID 26271)
-- Name: pt_fuego pt_fuego_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_fuego
    ADD CONSTRAINT pt_fuego_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permisos_trabajo(id_permiso);


--
-- TOC entry 4966 (class 2606 OID 34198)
-- Name: pt_izaje pt_izaje_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_izaje
    ADD CONSTRAINT pt_izaje_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permisos_trabajo(id_permiso);


--
-- TOC entry 4964 (class 2606 OID 26276)
-- Name: pt_no_peligroso pt_no_peligroso_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_no_peligroso
    ADD CONSTRAINT pt_no_peligroso_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permisos_trabajo(id_permiso);


--
-- TOC entry 4965 (class 2606 OID 26281)
-- Name: pt_radiacion pt_radiacion_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pt_radiacion
    ADD CONSTRAINT pt_radiacion_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permisos_trabajo(id_permiso);


-- Completed on 2025-11-17 10:25:48

--
-- PostgreSQL database dump complete
--

