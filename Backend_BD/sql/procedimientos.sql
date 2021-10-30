create or replace procedure insertRol  
(nombre IN VARCHAR2, id_respuesta OUT NUMBER)    
is    
begin    
insert into ROL (nombre_rol) VALUES (nombre)
returning id_rol into id_respuesta;   
end;    


create or replace procedure insertFormato  
(nombre IN VARCHAR2, id_respuesta OUT INTEGER)    
is   
id_repetido NUMBER;
begin    
    SELECT id_formato INTO id_repetido FROM FORMATO WHERE nombre_formato = nombre;
    exception
        when NO_DATA_FOUND then
            insert into FORMATO (nombre_formato) VALUES (nombre);
            SELECT id_formato INTO id_respuesta FROM FORMATO WHERE nombre_formato = nombre; 
    IF id_repetido IS NOT NULL THEN
        id_respuesta := id_repetido;
    END IF;
end;    


--------CREAR FORMATOS
create or replace procedure crearFormato  
(nombre IN VARCHAR2)    
is   
id_repetido NUMBER;
begin    
    SELECT id_formato INTO id_repetido FROM FORMATO WHERE nombre_formato = nombre;
    exception
        when NO_DATA_FOUND then
            insert into FORMATO (nombre_formato) VALUES (nombre);
end;   

--------CREAR ROLES
create or replace procedure crearRol  
(nombre IN VARCHAR2)    
is   
id_repetido NUMBER;
begin    
    SELECT id_rol INTO id_repetido FROM ROL WHERE nombre_rol = nombre;
    exception
        when NO_DATA_FOUND then
            insert into ROL (nombre_rol) VALUES (nombre);
end;   

--------CREAR REQUISITOS
create or replace procedure crearRequisito  
(
nombre IN VARCHAR2,
tamano_in NUMBER,
obligatorio_in NUMBER
)    
is   
id_repetido NUMBER;
begin    
    SELECT id_requisito INTO id_repetido FROM REQUISITO WHERE nombre_requisito = nombre AND tamano_in = tamano AND
    obligatorio_in = obligatorio;
    exception
        when NO_DATA_FOUND then
            insert into REQUISITO (nombre_requisito,tamano,obligatorio) VALUES (nombre,tamano_in,obligatorio_in);
end; 

--------CREAR PUESTOS
create or replace procedure crearPuesto  
(
nombre IN VARCHAR2,
imagen_in IN VARCHAR2,
salario_in IN FLOAT,
estado_in NUMBER
)    
is   
id_repetido NUMBER;
begin    
    SELECT id_puesto INTO id_repetido FROM PUESTO WHERE nombre_puesto = nombre AND imagen = imagen_in;
    exception
        when NO_DATA_FOUND then
            insert into PUESTO (nombre_puesto,imagen,salario,id_estado_puesto) VALUES (nombre,imagen_in,salario_in,estado_in);
end;

--------CREAR CATEGORIAS
create or replace procedure crearCategoria  
(
nombre IN VARCHAR2
)    
is   
id_repetido NUMBER;
begin    
    SELECT id_categoria INTO id_repetido FROM CATEGORIA WHERE nombre_categoria = nombre;
    exception
        when NO_DATA_FOUND then
            insert into CATEGORIA (nombre_categoria) VALUES (nombre);
end; 



--------CREAR DEPARTAMENTOS
create or replace procedure crearDepartamento  
(
nombre IN VARCHAR2,
capital_in IN VARCHAR2
)    
is   
id_repetido NUMBER;
begin    
    SELECT id_departamento INTO id_repetido FROM DEPARTAMENTO WHERE nombre_departamento = nombre;
    exception
        when NO_DATA_FOUND then
            insert into DEPARTAMENTO (nombre_departamento,capital) VALUES (nombre,capital_in);
end; 


--------LLENAR DETALLE CATEGORIA
create or replace procedure puesto_categoria  
(
puesto_in IN VARCHAR2,
categoria_in IN VARCHAR2
)    
is   
id_puesto_in NUMBER;
id_categoria_in NUMBER;
id_detalle_categoria_in NUMBER;
begin    
    SELECT PUESTO.id_puesto INTO id_puesto_in FROM PUESTO WHERE nombre_puesto = puesto_in;
    SELECT CATEGORIA.id_categoria INTO id_categoria_in FROM CATEGORIA WHERE nombre_categoria = categoria_in;
    SELECT id_detalle_Categoria INTO id_detalle_categoria_in FROM DETALLE_CATEGORIA 
    WHERE DETALLE_CATEGORIA.id_puesto = id_puesto_in AND
    DETALLE_CATEGORIA.id_categoria = id_categoria_in;
    exception
        when NO_DATA_FOUND then
            INSERT INTO DETALLE_CATEGORIA (id_puesto,id_categoria) VALUES (id_puesto_in,id_categoria_in);
end; 



select a.id_departamento, a.id_puesto,b.nombre_departamento,c.nombre_puesto from DETALLE_PUESTO a
INNER JOIN DEPARTAMENTO b
ON a.id_departamento = b.id_departamento
INNER JOIN PUESTO c
ON c.id_puesto = a.id_puesto;


--------LLENAR DETALLE PUESTO
create or replace procedure puesto_departamento 
(
puesto_in IN VARCHAR2,
departamento_in IN VARCHAR2
)    
is   
id_puesto_in NUMBER;
id_departamento_in NUMBER;
id_detalle_puesto_in NUMBER;
begin    
    SELECT PUESTO.id_puesto INTO id_puesto_in FROM PUESTO WHERE nombre_puesto = puesto_in;
    SELECT DEPARTAMENTO.id_departamento INTO id_departamento_in FROM DEPARTAMENTO WHERE nombre_departamento = departamento_in;
    SELECT id_detalle_puesto INTO id_detalle_puesto_in FROM DETALLE_PUESTO 
    WHERE DETALLE_PUESTO.id_puesto = id_puesto_in AND
    DETALLE_PUESTO.id_departamento = id_departamento_in;
    exception
        when NO_DATA_FOUND then
            INSERT INTO DETALLE_PUESTO (id_departamento,id_puesto) VALUES (id_departamento_in,id_puesto_in);
end; 



--------LLENAR DETALLE FORMATO
create or replace procedure formato_requisito 
(
formato_in IN VARCHAR2,
requisito_in IN VARCHAR2
)    
is   
id_formato_in NUMBER;
id_requisito_in NUMBER;
id_dellate_formato_in NUMBER;
begin    
    SELECT FORMATO.id_formato INTO id_formato_in FROM FORMATO WHERE nombre_formato = formato_in;
    SELECT REQUISITO.id_requisito INTO id_requisito_in FROM REQUISITO WHERE nombre_requisito = requisito_in;
    SELECT id_detalle_formato INTO id_dellate_formato_in FROM DETALLE_FORMATO 
    WHERE DETALLE_FORMATO.id_formato = id_formato_in AND
    DETALLE_FORMATO.id_requisito = id_requisito_in;
    exception
        when NO_DATA_FOUND then
            INSERT INTO DETALLE_FORMATO (id_requisito,id_formato) VALUES (id_requisito_in,id_formato_in);
end; 

select a.id_detalle_formato,b.nombre_formato,c.nombre_requisito from detalle_formato a
inner join formato b
on a.id_formato = b.id_formato
inner join requisito c
on c.id_requisito = a.id_requisito;


--------LLENAR DETALLE REQUISITO
create or replace procedure puesto_requisito 
(
puesto_in IN VARCHAR2,
requisito_in IN VARCHAR2
)    
is   
id_puesto_in NUMBER;
id_requisito_in NUMBER;
id_detalle_requisito_in NUMBER;
begin    
    SELECT PUESTO.id_puesto INTO id_puesto_in FROM PUESTO WHERE nombre_puesto = puesto_in;
    SELECT REQUISITO.id_requisito INTO id_requisito_in FROM REQUISITO WHERE nombre_requisito = requisito_in;
    SELECT id_detalle_requisito INTO id_detalle_requisito_in FROM DETALLE_REQUISITO 
    WHERE DETALLE_REQUISITO.id_puesto = id_puesto_in AND
    DETALLE_REQUISITO.id_requisito = id_requisito_in;
    exception
        when NO_DATA_FOUND then
            INSERT INTO DETALLE_REQUISITO (id_puesto,id_requisito) VALUES (id_puesto_in,id_requisito_in);
end; 

select a.id_detalle_requisito,b.nombre_puesto,c.nombre_requisito from detalle_requisito a
inner join puesto b
on a.id_puesto = b.id_puesto
inner join requisito c
on a.id_requisito = c.id_requisito;



--------LLENAR DETALLE REQUISITO
create or replace procedure departamento_departamento 
(
departamento_padre_in IN VARCHAR2,
departamento_hijo_in IN VARCHAR2
)    
is   
id_departamento_padre_in NUMBER;
id_departamento_hijo_in NUMBER;
id_detalle_departamento_in NUMBER;
begin    
    SELECT DEPARTAMENTO.id_departamento INTO id_departamento_padre_in FROM DEPARTAMENTO WHERE nombre_departamento = departamento_padre_in;
    SELECT DEPARTAMENTO.id_departamento INTO id_departamento_hijo_in FROM DEPARTAMENTO WHERE nombre_departamento = departamento_hijo_in;
    SELECT id_detalle_departamento INTO id_detalle_departamento_in FROM DETALLE_DEPARTAMENTO 
    WHERE DETALLE_DEPARTAMENTO.id_departamento_padre = id_departamento_padre_in AND
    DETALLE_DEPARTAMENTO.id_departamento_hijo = id_departamento_hijo_in;
    exception
        when NO_DATA_FOUND then
            INSERT INTO DETALLE_DEPARTAMENTO (id_departamento_padre,id_departamento_hijo) VALUES 
            (id_departamento_padre_in,id_departamento_hijo_in);
end;

select a.id_detalle_departamento,b.nombre_departamento,c.nombre_departamento from detalle_departamento a
inner join departamento b
on a.id_departamento_padre = b.id_departamento
inner join departamento c
on a.id_departamento_hijo = c.id_departamento;




--------CREAR DOCUMENTO
set serveroutput on;
create or replace procedure crearDocumento 
(
nombre_in IN VARCHAR2,
ubicacion_in IN VARCHAR2,
formato_in IN VARCHAR2,
estado_in IN NUMBER,
respuesta_out OUT NUMBER 
)    
is   
id_documento_in NUMBER;
id_formato_in NUMBER;
id_estado_in NUMBER;
begin   
    SELECT FORMATO.id_formato INTO id_formato_in FROM FORMATO WHERE nombre_formato = formato_in;
    SELECT ESTADO_DOCUMENTO.id_estado_documento INTO id_estado_in FROM ESTADO_DOCUMENTO WHERE id_estado_documento = estado_in;
    SELECT DOCUMENTO.id_documento INTO id_documento_in FROM DOCUMENTO WHERE ubicacion = ubicacion_in;
    respuesta_out := 0;
    exception
        when NO_DATA_FOUND 
            then
                INSERT INTO DOCUMENTO (nombre_documento,ubicacion,id_formato,id_estado_documento) 
                VALUES (nombre_in,ubicacion_in,id_formato_in,id_estado_in);
                respuesta_out := 1;              
end;

DECLARE 
    respuesta NUMBER;
BEGIN
    crearDocumento('doc1','suUbicacion','txt',1,respuesta);
    dbms_output.put_line(respuesta);
END;




--------CREAR EXPEDIENTE
set serveroutput on;
create or replace procedure crearExpediente 
(
nombre_in IN VARCHAR2,
apellido_in IN VARCHAR2,
direccion_in IN VARCHAR2,
email_in IN VARCHAR2,
dpi_in IN NUMBER,
telefono_in IN NUMBER,
cv_in IN VARCHAR2,
estado_in IN NUMBER,
puesto_in IN NUMBER,
pass_in IN VARCHAR2,
respuesta_out OUT NUMBER 
)    
is   
id_documento_in NUMBER;
id_expediente_in NUMBER;
fecha_actual DATE :=SYSDATE;
id_usuario_in NUMBER;
begin   
    
    SELECT DOCUMENTO.id_documento INTO id_documento_in FROM DOCUMENTO WHERE ubicacion = cv_in;
    INSERT INTO EXPEDIENTE (cui,nombres,apellidos,email,direccion,telefono,cv,id_estado_expediente)
    VALUES (dpi_in,nombre_in,apellido_in,email_in,direccion_in,telefono_in,id_documento_in,estado_in);
    SELECT EXPEDIENTE.id_expediente INTO id_expediente_in FROM EXPEDIENTE WHERE cui = dpi_in;
    --Crear la relaclión en detalle_documento
    INSERT INTO DETALLE_DOCUMENTO (id_expediente,id_documento) VALUES (id_expediente_in,id_documento_in);
    --Crear usuario
    INSERT INTO USUARIO (id_rol,nombre_usuario,pass_usuario,fecha_inicio,estado_usuario,id_expediente) VALUES
    (4,TO_CHAR(dpi_in),pass_in,fecha_actual,1,id_expediente_in);
    --Crear la relación en detalle expediente
    --Conseguir el id del usuario
    SELECT USUARIO.id_usuario INTO id_usuario_in FROM USUARIO WHERE nombre_usuario = TO_CHAR(dpi_in);  
    INSERT INTO DETALLE_EXPEDIENTE (id_usuario,id_expediente,id_puesto) 
    VALUES (id_usuario_in, id_expediente_in,puesto_in);
    respuesta_out := 1;
    exception
        when NO_DATA_FOUND 
            then
                respuesta_out := 0;              
end;



--Get fecha actual
SELECT TO_DATE
    (SYSDATE, 'DD-MM-YYYY') Fecha_inicial
     FROM DUAL;


set serveroutput on;
DECLARE 
    respuesta NUMBER;
BEGIN
    crearExpediente('Rael','Rodriguez','Zona 7','jers.035@gmail.com',1234567895642,24485897,'1234567891234_enlaces_react.txt'
    ,1,1,'contrasena',respuesta);
    dbms_output.put_line(respuesta);
END;

select * from expediente;
select * from documento;

select b.id_usuario,b.nombre_usuario,b.email from detalle_revision a
INNER JOIN USUARIO b
on a.id_usuario = b.id_usuario
where a.estado_revision = 0 
AND b.estado_usuario = 1
ORDER BY id_detalle_revision DESC;

select * from detalle_revision;
select * from usuario;
select * from rol;

INSERT INTO DOCUMENTO (nombre_documento, ubicacion, id_formato, id_estado_documento) 
VALUES ('doc1','doc1.txt',1,3);
INSERT INTO PUESTO (nombre_puesto,imagen,salario,id_estado_puesto)
VALUES ('puesto1','no',5000,1);

select * from formato;
select * from estado_documento;
select * from estado_expediente;
select * from Departamento;
select * from documento;
select * from puesto;
select * from Estado_puesto;
select * from expediente;
select * from usuario;
select * from detalle_documento;

DECLARE 
    respuesta NUMBER;
BEGIN
    crearExpediente('Joel','Rodríguez','zona 7','jers_032@gmail.com',2098807920,24485678,'suUbicacion',1,respuesta);
    dbms_output.put_line(respuesta);
END;






--------CREAR DOCUMENTO
set serveroutput on;
create or replace procedure crearDocumento 
(
nombre_in IN VARCHAR2,
ubicacion_in IN VARCHAR2,
formato_in IN VARCHAR2,
estado_in IN NUMBER,
respuesta_out OUT NUMBER 
)    
is   
id_documento_in NUMBER;
id_formato_in NUMBER;
id_estado_in NUMBER;
begin   
    SELECT FORMATO.id_formato INTO id_formato_in FROM FORMATO WHERE nombre_formato = formato_in;
    SELECT ESTADO_DOCUMENTO.id_estado_documento INTO id_estado_in FROM ESTADO_DOCUMENTO WHERE id_estado_documento = estado_in;
    SELECT DOCUMENTO.id_documento INTO id_documento_in FROM DOCUMENTO WHERE ubicacion = ubicacion_in;
    respuesta_out := 0;
    exception
        when NO_DATA_FOUND 
            then
                INSERT INTO DOCUMENTO (nombre_documento,ubicacion,id_formato,id_estado_documento) 
                VALUES (nombre_in,ubicacion_in,id_formato_in,id_estado_in);
                respuesta_out := 1;              
end;





--------CREAR USUARIO
set serveroutput on;
create or replace procedure crearUsuario 
(
nombre_in IN VARCHAR2,
pass_in IN VARCHAR2,
email_in IN VARCHAR2,
rol_in IN NUMBER,
estado_in IN NUMBER,
departamento_in IN NUMBER,
respuesta_out OUT NUMBER 
)    
is  
usuario_repetido NUMBER;
id_usuario_in NUMBER;
admin_existe_en_departamento NUMBER;
fecha_actual DATE :=SYSDATE;

begin   
    SELECT USUARIO.id_usuario INTO usuario_repetido FROM USUARIO WHERE USUARIO.nombre_usuario = nombre_in;
    respuesta_out := 0;  
    exception
        when NO_DATA_FOUND 
            then
                INSERT INTO USUARIO (id_rol,nombre_usuario,pass_usuario,fecha_inicio,estado_usuario)
                VALUES (rol_in,nombre_in,pass_in,fecha_actual,estado_in);
                SELECT USUARIO.id_usuario INTO id_usuario_in FROM USUARIO WHERE nombre_usuario = nombre_in;
                respuesta_out := 1; 
                IF (rol_in = 5) THEN
                    INSERT INTO DETALLE_USUARIO (id_departamento,id_usuario) 
                    VALUES (departamento_in,id_usuario_in);
                    respuesta_out := 1;
                ELSIF (rol_in = 2) THEN
                    BEGIN                        
                        SELECT b.id_rol INTO admin_existe_en_departamento from detalle_usuario a
                        INNER JOIN USUARIO b
                        ON a.id_usuario = b.id_usuario
                        WHERE b.id_rol = 2
                        AND a.id_departamento = departamento_in;
                        DELETE FROM USUARIO where nombre_usuario = nombre_in;
                        respuesta_out := 3;
                        EXCEPTION
                            WHEN NO_DATA_FOUND 
                            THEN
                                INSERT INTO DETALLE_USUARIO (id_departamento,id_usuario) 
                                VALUES (departamento_in,id_usuario_in);                           
                                respuesta_out := 4; 
                            WHEN INVALID_NUMBER
                            THEN
                                respuesta_out := 3;
                    END;
                END IF;                                
end;


DECLARE 
    respuesta NUMBER;
BEGIN
    crearUsuario('Juanes','123456','jers.033@gmail.com',2,1,2,respuesta);
    dbms_output.put_line(respuesta);
END;

select * from usuario;
select * from detalle_usuario;
select * from expediente;



--Conseguir el último expediente creado por id
SELECT id_expediente FROM expediente
ORDER BY id_expediente DESC
FETCH FIRST 1 ROWS ONLY;


--Crear un trigger
CREATE OR REPLACE TRIGGER agregar_detalle_revision
AFTER INSERT ON DETALLE_EXPEDIENTE
DECLARE
    id_expediente_in NUMBER;
    id_usuario_in NUMBER;
    contador_in NUMBER;
BEGIN
    --Obtener el último expediente creado
    SELECT id_expediente INTO id_expediente_in FROM expediente
    ORDER BY id_expediente DESC
    FETCH FIRST 1 ROWS ONLY;
    
    --Obtener un usuario desocupado
    SELECT a.id_usuario,COUNT(b.id_expediente) as contador INTO id_usuario_in,contador_in FROM usuario a 
    FULL JOIN detalle_revision b
    ON a.id_usuario = b.id_usuario
    WHERE a.id_rol = 3 AND a.estado_usuario = 1 AND (b.estado_revision = 0 OR b.estado_revision IS NULL)
    GROUP BY a.id_usuario, a.nombre_usuario, b.id_usuario,b.estado_revision
    ORDER BY contador
    FETCH FIRST 1 ROWS ONLY;
    
    --Asignarle al usuario el expediente
    INSERT INTO DETALLE_REVISION (id_usuario,id_expediente,estado_revision) VALUES (id_usuario_in,id_expediente_in,0);
    
END;


--Consulta para traer revisores de expedientes más desocupados
--El rol del revisor es 3
SELECT id_usuario from 
(
    SELECT a.id_usuario, a.nombre_usuario,b.estado_revision,COUNT(b.id_expediente) as contador FROM usuario a 
    FULL JOIN detalle_revision b
    ON a.id_usuario = b.id_usuario
    WHERE a.id_rol = 3 AND a.estado_usuario = 1 AND (b.estado_revision = 0 OR b.estado_revision IS NULL)
    GROUP BY a.id_usuario, a.nombre_usuario, b.id_usuario,b.estado_revision
    ORDER BY contador
    FETCH FIRST 1 ROWS ONLY
)
;
--Pruebas de detalle revision
select * from usuario; --56 67
select * from detalle_revision;
select * from expediente; --1 2 3
BEGIN
    INSERT INTO detalle_revision(id_usuario,id_expediente,estado_revision)
    VALUES (56,1,0)
    ;
END;



---Ver privilegios 
select * from user_sys_privs;

BEGIN
    puesto_departamento('JEFE','Recruitment');
END;

select * from detalle_revision;

drop procedure insertRole;

exec  insertRol('señorio');