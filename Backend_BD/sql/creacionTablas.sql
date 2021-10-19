CREATE SEQUENCE conteo_estado_documento START WITH 1;
CREATE SEQUENCE conteo_formato START WITH 1;
CREATE SEQUENCE conteo_estado_expediente START WITH 1;
CREATE SEQUENCE conteo_requisito START WITH 1;
CREATE SEQUENCE conteo_departamento START WITH 1;
CREATE SEQUENCE conteo_puesto START WITH 1;
CREATE SEQUENCE conteo_rol START WITH 1;
CREATE SEQUENCE conteo_categoria START WITH 1;
CREATE SEQUENCE conteo_documento START WITH 1;
CREATE SEQUENCE conteo_expediente START WITH 1;
CREATE SEQUENCE conteo_detalle_formato START WITH 1;
CREATE SEQUENCE conteo_id_detalle_puesto START WITH 1;
CREATE SEQUENCE conteo_id_detalle_requisito START WITH 1;
CREATE SEQUENCE conteo_id_detalle_departamento START WITH 1;
CREATE SEQUENCE conteo_id_detalle_documento START WITH 1;
CREATE SEQUENCE conteo_id_usuario START WITH 1;
CREATE SEQUENCE conteo_id_calificacion START WITH 1;


--TABLAS MORADAS
CREATE TABLE estado_documento (
    id_estado_documento NUMERIC(10) DEFAULT conteo_estado_documento.nextval NOT NULL PRIMARY KEY,
    nombre_estado_documento VARCHAR(50) NOT NULL
);

CREATE TABLE formato (
    id_formato NUMERIC(10) DEFAULT conteo_formato.nextval NOT NULL PRIMARY KEY,
    nombre_formato VARCHAR(50) NOT NULL
);

CREATE TABLE estado_expediente (
    id_estado_expediente NUMERIC(10) DEFAULT conteo_estado_expediente.nextval NOT NULL PRIMARY KEY,
    nombre_estado_expediente VARCHAR(100) NOT NULL
);

CREATE TABLE requisito (
    id_requisito NUMERIC(10) DEFAULT conteo_requisito.nextval NOT NULL PRIMARY KEY,
    nombre_requisito VARCHAR(50) NOT NULL,
    tamano NUMERIC(10) NOT NULL,
    obligatorio NUMERIC(10) NOT NULL
);

CREATE TABLE departamento (
    id_departamento NUMERIC(10) DEFAULT conteo_departamento.nextval NOT NULL PRIMARY KEY,
    nombre_departamento VARCHAR(100) NOT NULL,
    capital FLOAT NOT NULL
);

CREATE TABLE puesto (
    id_puesto NUMERIC(10) DEFAULT conteo_puesto.nextval NOT NULL PRIMARY KEY,
    nombre_puesto VARCHAR(100) NOT NULL,
    puesto VARCHAR(200),
    salario FLOAT NOT NULL
);

CREATE TABLE rol (
    id_rol NUMERIC(10) DEFAULT conteo_rol.nextval NOT NULL PRIMARY KEY,
    nombre_rol VARCHAR(100) NOT NULL
);

CREATE TABLE categoria (
    id_categoria NUMERIC(10) DEFAULT conteo_categoria.nextval NOT NULL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);

-- TABLAS ROJAS

CREATE TABLE documento (
    id_documento NUMERIC(10) DEFAULT conteo_documento.nextval NOT NULL PRIMARY KEY,
    nombre_documento VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(200),
    id_formato NUMERIC(10) NOT NULL,
    id_estado_documento NUMERIC(10) NOT NULL,
    CONSTRAINT fk_id_formato
        FOREIGN KEY (id_formato)
        REFERENCES formato(id_formato),
    CONSTRAINT fk_id_estado_documento
        FOREIGN KEY (id_estado_documento)
        REFERENCES estado_documento(id_estado_documento)
);

CREATE TABLE expediente (
    id_expediente NUMERIC(10) DEFAULT conteo_expediente.nextval NOT NULL PRIMARY KEY,
    cui NUMERIC(10) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    telefono NUMERIC(10) NOT NULL,
    cv VARCHAR(500) NOT NULL,
    id_estado_expediente NUMERIC(10) NOT NULL,
    CONSTRAINT fk_id_estado_expediente
        FOREIGN KEY (id_estado_expediente)
        REFERENCES estado_expediente(id_estado_expediente)
);

CREATE TABLE detalle_formato (
    id_detalle_formato NUMERIC(10) DEFAULT conteo_detalle_formato.nextval NOT NULL PRIMARY KEY,
    id_requisito NUMERIC(10) NOT NULL,
    id_formato NUMERIC(10) NOT NULL,
    CONSTRAINT fk_id_requisito_formato
        FOREIGN KEY (id_requisito)
        REFERENCES requisito(id_requisito),
    CONSTRAINT fk_id_formato_detalle
        FOREIGN KEY (id_formato)
        REFERENCES formato(id_formato)
);

CREATE TABLE detalle_puesto (
    id_detalle_puesto NUMERIC(10) DEFAULT conteo_id_detalle_puesto.nextval NOT NULL PRIMARY KEY,
    id_departamento NUMERIC(10) NOT NULL,
    id_puesto NUMERIC(10) NOT NULL,
    CONSTRAINT fk_id_departamento
        FOREIGN KEY (id_departamento)
        REFERENCES departamento(id_departamento),
    CONSTRAINT fk_id_puesto
        FOREIGN KEY (id_puesto)
        REFERENCES puesto(id_puesto)
);

CREATE TABLE detalle_requisito (
    id_detalle_requisito NUMERIC(10) DEFAULT conteo_id_detalle_requisito.nextval NOT NULL PRIMARY KEY,
    id_puesto NUMERIC(10) NOT NULL,
    id_requisito NUMERIC(10) NOT NULL,
    CONSTRAINT fk_id_puesto_requisito
        FOREIGN KEY (id_puesto)
        REFERENCES puesto(id_puesto),
    CONSTRAINT fk_id_requisito_detalle
        FOREIGN KEY (id_requisito)
        REFERENCES requisito(id_requisito)
);

CREATE TABLE detalle_departamento (
    id_detalle_departamento NUMERIC(10) DEFAULT conteo_id_detalle_departamento.nextval NOT NULL PRIMARY KEY,
    id_departamento_padre NUMERIC(10) NOT NULL,
    id_departamento_hijo NUMERIC(10) NOT NULL,
    CONSTRAINT fk_id_departamento_padre
        FOREIGN KEY (id_departamento_padre)
        REFERENCES departamento(id_departamento),
    CONSTRAINT fk_id_departamento_hijo
        FOREIGN KEY (id_departamento_hijo)
        REFERENCES departamento (id_departamento)
);

CREATE TABLE detalle_categoria (
    id_detalle_categoria NUMERIC(10) DEFAULT conteo_id_detalle_departamento.nextval NOT NULL PRIMARY KEY,
    id_puesto NUMERIC(10) NOT NULL,
    id_categoria NUMERIC(10) NOT NULL,
    CONSTRAINT fk_id_puesto_categoria
        FOREIGN KEY (id_puesto)
        REFERENCES puesto(id_puesto),
    CONSTRAINT fk_id_categoria_detalle
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
);

--TABLAS AMARILLAS

CREATE TABLE detalle_documento (
    id_detalle_documento NUMERIC(10) DEFAULT conteo_id_detalle_documento.nextval NOT NULL PRIMARY KEY,
    id_expediente NUMERIC(10) NOT NULL,
    id_documento NUMERIC(10) NOT NULL,
    CONSTRAINT fk_id_expediente
        FOREIGN KEY (id_expediente)
        REFERENCES expediente(id_expediente),
    CONSTRAINT fk_id_documento
        FOREIGN KEY (id_documento)
        REFERENCES documento(id_documento)
);

CREATE TABLE usuario (
    id_usuario NUMERIC(10) DEFAULT conteo_id_usuario.nextval NOT NULL PRIMARY KEY,
    id_rol NUMERIC(10),
    id_departamento NUMERIC(10),
    nombre_usuario VARCHAR(50) NOT NULL,
    pass_usuario VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado_usuario NUMERIC(10) NOT NULL,
    id_expediente NUMERIC(10) NOT NULL,
    CONSTRAINT fk_id_rol_usuario
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol),    
    CONSTRAINT fk_id_departamento_usuario
        FOREIGN KEY (id_departamento)
        REFERENCES departamento(id_departamento),
    CONSTRAINT fk_id_expediente_usuario
        FOREIGN KEY (id_expediente)
        REFERENCES expediente(id_expediente)          
);

--TABLAS NARANJAS 

CREATE TABLE calificacion(
    id_calificacion NUMERIC(10) DEFAULT conteo_id_calificacion.nextval NOT NULL PRIMARY KEY,
    valor NUMERIC(10) NOT NULL,
    id_usuario NUMERIC(10) NOT NULL,
    id_puesto NUMERIC(10) NOT NULL,
    CONSTRAINT fk_id_usuario_calificacion
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),
    CONSTRAINT fk_id_puesto_calificacion
        FOREIGN KEY (id_puesto)
        REFERENCES puesto(id_puesto) 
);

--DATOS DE TABLAS MORADAS



drop table calificacion;
drop table usuario;
drop table detalle_documento;
drop table detalle_categoria;
drop table detalle_departamento;
drop table detalle_requisito;
drop table detalle_puesto;
drop table detalle_formato;
drop table expediente;
drop table documento;
drop table categoria;
drop table rol;
drop table puesto;
drop table departamento;
drop table requisito;
drop table estado_expediente;
drop table formato;
drop table estado_documento;

DROP SEQUENCE conteo_estado_documento;
DROP SEQUENCE conteo_formato;
DROP SEQUENCE conteo_estado_expediente;
DROP SEQUENCE conteo_requisito;
DROP SEQUENCE conteo_departamento;
DROP SEQUENCE conteo_puesto;
DROP SEQUENCE conteo_rol;
DROP SEQUENCE conteo_categoria;
DROP SEQUENCE conteo_documento;
DROP SEQUENCE conteo_expediente;
DROP SEQUENCE conteo_detalle_formato;
DROP SEQUENCE conteo_id_detalle_puesto;
DROP SEQUENCE conteo_id_detalle_requisito;
DROP SEQUENCE conteo_id_detalle_departamento;
DROP SEQUENCE conteo_id_detalle_documento;
DROP SEQUENCE conteo_id_usuario;
DROP SEQUENCE conteo_id_calificacion;




