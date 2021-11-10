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

select b.email from detalle_revision a
        FULL JOIN USUARIO b
        on a.id_usuario = b.id_usuario
        where a.estado_revision = 0 
        AND b.estado_usuario = 1
        ORDER BY id_detalle_revision DESC
        FETCH FIRST 1 ROWS ONLY;
        
select * from usuario a
INNER JOIN DETALLE_REVISION b
ON a.id_usuario = b.id_usuario
WHERE id_rol = 3;


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
    INSERT INTO USUARIO (id_rol,nombre_usuario,pass_usuario,fecha_inicio,estado_usuario,id_expediente,email) VALUES
    (4,TO_CHAR(dpi_in),pass_in,fecha_actual,1,id_expediente_in,email_in);
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

select * from expediente;


--Get fecha actual
SELECT TO_DATE
    (SYSDATE, 'DD-MM-YYYY') Fecha_inicial
     FROM DUAL;





set serveroutput on;
DECLARE 
    respuesta NUMBER;
BEGIN
    crearExpediente('Gonzo','Rodriguez','Zona 7','jers.035@gmail.com',6234567895642,24485897,'6487951235648_enlaces_react.txt'
    ,1,1,'contrasena',respuesta);
    dbms_output.put_line(respuesta);
END;

select * from expediente;
select * from detalle_expediente;
select * from detalle_revision;
select * from documento;

--select b.id_usuario,b.nombre_usuario,b.email from detalle_revision a
select b.email from detalle_revision a
FULL JOIN USUARIO b
on a.id_usuario = b.id_usuario
where a.estado_revision = 0 
AND b.estado_usuario = 1
ORDER BY id_detalle_revision DESC
FETCH FIRST 1 ROWS ONLY
;

select * from detalle_revision;
select * from usuario;
select * from rol;
select * from documento;
select * from expediente;


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
                INSERT INTO USUARIO (id_rol,nombre_usuario,pass_usuario,fecha_inicio,estado_usuario,email)
                VALUES (rol_in,nombre_in,pass_in,fecha_actual,estado_in,email_in);
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



--Conseguir el último expediente creado por id
SELECT id_expediente FROM expediente
ORDER BY id_expediente DESC
FETCH FIRST 1 ROWS ONLY;

drop trigger agregar_detalle_revision;

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
    SELECT id_usuario INTO id_usuario_in FROM
        (
            SELECT id_usuario, nombre_usuario, estado_usuario,
                SUM(estado_real) suma FROM
                (
                    SELECT a.id_usuario,a.nombre_usuario,a.estado_usuario,b.id_detalle_revision,
                    b.id_expediente,
                    CASE WHEN b.estado_revision = 0 then 1 ELSE 0 END as estado_real,
                    b.estado_revision
                    from usuario a
                    LEFT OUTER JOIN detalle_revision b
                    ON a.id_usuario = b.id_usuario
                    WHERE a.id_rol = 3 AND a.estado_usuario = 1
                    GROUP BY a.id_usuario,a.nombre_usuario,a.estado_usuario,
                    b.id_detalle_revision,b.id_expediente,b.estado_revision
                )
                GROUP BY
                id_usuario, nombre_usuario, estado_usuario 
                ORDER BY SUMA
                FETCH FIRST 1 ROWS ONLY
        )
    ;

    --Asignarle al usuario el expediente
    INSERT INTO DETALLE_REVISION (id_usuario,id_expediente,estado_revision) VALUES (id_usuario_in,id_expediente_in,0);
    
END;
commit;


--Consulta para traer revisores de expedientes más desocupados
--El rol del revisor es 3
SELECT id_usuario,nombre_usuario,email FROM USUARIO 
WHERE id_usuario = (
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

--Traer usuarios

select id_usuario, nombre_usuario as nombre, pass_usuario as contraseña, estado_usuario as estado, nombre_rol as rol from USUARIO a
INNER JOIN ROL b
ON a.id_rol = b.id_rol;

create or replace view traerUsuarios as
select nombre_usuario as nombre, estado_usuario as estado,
TO_CHAR(a.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, TO_CHAR(a.fecha_fin, 'DD-MM-YYYY') as fecha_fin,
nombre_rol as rol,id_usuario, pass_usuario as contraseña, email, b.id_rol, a.id_puesto 
from USUARIO a
INNER JOIN ROL b
ON a.id_rol = b.id_rol;


select * from documento;
UPDATE USUARIO SET email = 'Jers.025@gmail.com', pass_usuario='otramas'
WHERE nombre_usuario = '6847444125689';


--------EDITAR USUARIO
set serveroutput on;
create or replace procedure editarUsuario 
(
nombre_in IN VARCHAR2,
pass_in IN VARCHAR2,
email_in IN VARCHAR2,
respuesta_out OUT NUMBER
)    
is   

begin   
    UPDATE USUARIO SET email = email_in, pass_usuario=pass_in
    WHERE nombre_usuario = nombre_in;    
    respuesta_out := 1;
end;



--------ELIMINAR USUARIO
set serveroutput on;
create or replace procedure eliminarUsuario 
(
nombre_in IN VARCHAR2,
puesto_in IN NUMBER,
respuesta_out OUT NUMBER
)    
is   
fecha_actual DATE :=SYSDATE;
begin   
    UPDATE USUARIO SET estado_usuario = 0, fecha_fin = fecha_actual
    WHERE nombre_usuario = nombre_in;  
    IF (puesto_in != -1)THEN
        --Si estaba contratado y hay que liberar el puesto
        UPDATE PUESTO SET id_estado_puesto = 1
        WHERE id_puesto = puesto_in;
    END IF;
    respuesta_out := 1;
end;

select * from usuario;
select * from expediente;

SELECT c.cui, c.nombres,c.apellidos,c.email,c.direccion,c.telefono, e.nombre_estado_expediente, g.nombre_puesto,  
     b.nombre_rol, i.id_departamento, g.salario,g.id_puesto FROM usuario a
INNER JOIN ROL b
ON a.id_rol = b.id_rol
INNER JOIN EXPEDIENTE c
ON a.id_expediente = c.id_expediente
INNER JOIN DETALLE_REVISION d
ON d.id_expediente = a.id_expediente
INNER JOIN ESTADO_EXPEDIENTE e
ON e.id_estado_expediente = c.id_estado_expediente
INNER JOIN DETALLE_EXPEDIENTE f
ON f.id_expediente = c.id_expediente
INNER JOIN PUESTO g
ON g.id_puesto = f.id_puesto
INNER JOIN DETALLE_PUESTO h
ON h.id_puesto = g.id_puesto
INNER JOIN DEPARTAMENTO i
ON i.id_departamento = h.id_departamento
INNER JOIN USUARIO j
ON j.id_expediente = c.id_expediente
WHERE i.id_departamento = 1
AND c.id_estado_expediente = 4
AND j.estado_usuario = 1;


SELECT a.capital from departamento a
WHERE a.id_departamento = 1;




--------ASOCIAR USUARIO
set serveroutput on;
create or replace procedure asociarUsuario 
(
cui_in IN VARCHAR2,
salario_in IN FLOAT,
departamento_in IN NUMBER,
puesto_in IN NUMBER,
respuesta_out OUT NUMBER
)    
is  
id_usuario_in NUMBER;
capital_disponible FLOAT;
salario_plantilla FLOAT;
capital_in FLOAT;
begin   
    --Obtener ID del usuario a asociar
    SELECT id_usuario INTO id_usuario_in FROM EXPEDIENTE a
    INNER JOIN USUARIO b
    ON a.id_expediente = b.id_expediente
    WHERE a.cui = cui_in;
    dbms_output.put_line(id_usuario_in);
    --Calcular si se puede contrarar
    
    --Conseguir el salario de la plantilla actual
    SELECT SUM(b.salario) INTO salario_plantilla FROM usuario a
    INNER JOIN PUESTO b
    ON b.id_puesto = a.id_puesto
    INNER JOIN DETALLE_PUESTO c
    ON a.id_puesto = c.id_puesto
    INNER JOIN DEPARTAMENTO d
    ON d.id_departamento = c.id_departamento
    WHERE d.id_departamento = departamento_in
    AND a.estado_usuario = 1;
    dbms_output.put_line(salario_plantilla);
    --Conseguir el capital del departamento
    SELECT capital INTO capital_in FROM DEPARTAMENTO WHERE id_departamento = departamento_in;
    dbms_output.put_line(capital_in);
    IF (salario_plantilla is null) THEN
        capital_disponible := capital_in;
    ELSE
        capital_disponible := capital_in - salario_plantilla;
    END IF;
    dbms_output.put_line(capital_disponible);
    IF (salario_in <= capital_disponible) THEN
        --Contratar
        --Agregar puesto a usuario
        UPDATE USUARIO SET id_puesto = puesto_in WHERE nombre_usuario = cui_in;
        --Actualizar ROL
        UPDATE USUARIO SET id_rol = 5 WHERE nombre_usuario = cui_in;
        --Asociar usuario con el departamento
        INSERT INTO DETALLE_USUARIO (id_departamento,id_usuario)
        VALUES (departamento_in,id_usuario_in);
        --Actualizar puesto, ahora esta ocupado
        UPDATE PUESTO SET id_estado_puesto = 2;
        respuesta_out:=1;
    ELSE
        respuesta_out:=0;
    END IF;
    
    EXCEPTION when NO_DATA_FOUND then
        respuesta_out:=4;
end;








set serveroutput on;
DECLARE
    respuesta NUMBER;
BEGIN
    asociarUsuario('2546789542168',30000,1,1,respuesta);
    dbms_output.put_line(respuesta);
END;

commit;


--estado,revisado;



--Obtener el departamento del usuario logueado
set serveroutput on;
CREATE OR REPLACE FUNCTION getDepartamento (nombre_usuario_in IN VARCHAR2) RETURN NUMBER AS
    departamento_out NUMBER;
BEGIN
    SELECT c.id_departamento INTO departamento_out FROM USUARIO a
    INNER JOIN DETALLE_USUARIO b
    ON b.id_usuario = a.id_usuario
    INNER JOIN DEPARTAMENTO c
    ON c.id_departamento = b.id_departamento
    INNER JOIN ROL d
    ON d.id_rol = a.id_rol
    WHERE a.estado_usuario=1
    AND nombre_usuario = nombre_usuario_in
    GROUP BY c.id_departamento;
    dbms_output.put_line(departamento_out);
  RETURN departamento_out;
END;


    SELECT c.id_departamento FROM USUARIO a
    INNER JOIN DETALLE_USUARIO b
    ON b.id_usuario = a.id_usuario
    INNER JOIN DEPARTAMENTO c
    ON c.id_departamento = b.id_departamento
    INNER JOIN ROL d
    ON d.id_rol = a.id_rol
    WHERE a.estado_usuario=1
    AND nombre_usuario = 'Maria'
    GROUP BY c.id_departamento;

set serveroutput on;
DECLARE
    respuesta NUMBER;
BEGIN
    respuesta := getDepartamento('Maria');
    dbms_output.put_line(respuesta);
END;


SELECT c.id_departamento FROM USUARIO a
    INNER JOIN DETALLE_USUARIO b
    ON b.id_usuario = a.id_usuario
    INNER JOIN DEPARTAMENTO c
    ON c.id_departamento = b.id_departamento
    INNER JOIN ROL d
    ON d.id_rol = a.id_rol
    WHERE a.estado_usuario=1
    AND nombre_usuario = 'Jose'
    GROUP BY c.id_departamento;






--Obtener el id del revisor 
set serveroutput on;
CREATE OR REPLACE FUNCTION getRevisor (nombre_usuario IN VARCHAR2) RETURN NUMBER AS
    revisor_out NUMBER;
BEGIN
    SELECT id_usuario INTO revisor_out FROM USUARIO 
    GROUP BY id_usuario;
  RETURN revisor_out;
END;


SELECT c.id_departamento FROM USUARIO a
    INNER JOIN DETALLE_USUARIO b
    ON b.id_usuario = a.id_usuario
    INNER JOIN DEPARTAMENTO c
    ON c.id_departamento = b.id_departamento
    INNER JOIN ROL d
    ON d.id_rol = a.id_rol
    WHERE a.estado_usuario=1
    AND nombre_usuario = 'CarlogG';







select nombre_departamento from USUARIO a
INNER JOIN DETALLE_USUARIO b
ON b.id_usuario = a.id_usuario
INNER JOIN DEPARTAMENTO c
ON c.id_departamento = b.id_departamento
INNER JOIN ROL d
ON d.id_rol = a.id_rol
WHERE a.estado_usuario=1
AND nombre_usuario = 'CarlogG';


UPDATE EXPEDIENTE SET id_estado_expediente = 4 where id_expediente = 41;
select * from expediente;
commit;



---Ver privilegios 
select * from user_sys_privs;

BEGIN
    puesto_departamento('JEFE','Recruitment');
END;

drop procedure insertRole;
exec  insertRol('señorio');



--TRAER EXPEDIENTES


SELECT c.cui,c.nombres,c.apellidos,c.email,c.direccion,c.telefono,c.cv,d.nombre_estado_expediente, 
e.ubicacion, e.nombre_documento, f.nombre_formato FROM detalle_revision a
INNER JOIN USUARIO b
ON a.id_usuario = b.id_usuario
INNER JOIN EXPEDIENTE c
ON a.id_expediente = c.id_expediente
INNER JOIN ESTADO_EXPEDIENTE d
ON d.id_estado_expediente = c.id_estado_expediente
INNER JOIN DOCUMENTO e
ON e.id_documento = c.cv
INNER JOIN FORMATO f
ON f.id_formato = e.id_formato
WHERE a.id_usuario = 21;

--Get el cv de un expediente
SELECT a.cv, b.ubicacion,b.nombre_documento, c.nombre_formato, e.cui,e.nombres,e.apellidos, e.id_expediente from expediente a
INNER JOIN DOCUMENTO b
ON a.cv = b.id_documento
INNER JOIN FORMATO c
ON b.id_formato = c.id_formato
INNER JOIN DETALLE_DOCUMENTO d
ON d.id_documento = b.id_documento
INNER JOIN EXPEDIENTE e
ON e.id_expediente = d.id_expediente
WHERE e.id_expediente = 3
GROUP BY a.cv, b.ubicacion,b.nombre_documento, c.nombre_formato, e.cui,e.nombres,e.apellidos,e.id_expediente;

--Rechazar un expediente
--Aceptar un expediente
select * from expediente;
select * from estado_expediente;
UPDATE EXPEDIENTE SET id_estado_expediente = 1
WHERE id_expediente = 42;
Commit;

select * from puesto;
select * from requisito;
select * from detalle_requisito;


--Get requisitos del puesto del usuario

SELECT a.nombre_puesto, c.nombre_requisito, c.obligatorio, c.tamano FROM PUESTO a
INNER JOIN DETALLE_REQUISITO b
ON a.id_puesto = b.id_puesto
INNER JOIN REQUISITO c
ON c.id_requisito = b.id_requisito;

select * from detalle_expediente a
INNER JOIN EXPEDIENTE b
ON a.id_expediente = b.id_expediente;

select * from usuario;
select * from detalle_revision;


SELECT id_usuario,nombre_usuario,email FROM USUARIO 
        WHERE id_usuario = (
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
        );




SELECT c.cui,c.nombres,c.apellidos,h.nombre_puesto, d.nombre_estado_expediente, TO_CHAR(b.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, 
      c.email,c.direccion, c.telefono,c.cv,d.nombre_estado_expediente, e.ubicacion, e.nombre_documento, 
      f.nombre_formato, h.id_puesto, c.id_estado_expediente, c.id_expediente FROM detalle_revision a
      INNER JOIN USUARIO b
      ON a.id_usuario = b.id_usuario
      INNER JOIN EXPEDIENTE c
      ON a.id_expediente = c.id_expediente
      INNER JOIN ESTADO_EXPEDIENTE d
      ON d.id_estado_expediente = c.id_estado_expediente
      INNER JOIN DOCUMENTO e
      ON e.id_documento = c.cv
      INNER JOIN FORMATO f
      ON f.id_formato = e.id_formato
      INNER JOIN DETALLE_EXPEDIENTE g
      ON g.id_expediente = c.id_expediente
      INNER JOIN PUESTO h
      ON h.id_puesto = g.id_puesto
      WHERE a.id_usuario = 2
      AND (c.id_estado_expediente = 1 OR c.id_estado_expediente = 2 OR c.id_estado_expediente = 3 OR c.id_estado_expediente = 6);
      
SELECT a.nombre_usuario,a.id_usuario,c.nombre_puesto, e.id_requisito,e.nombre_requisito,
e.tamano, e.obligatorio, g.nombre_formato, g.id_formato, b.id_expediente, c.id_puesto FROM USUARIO a
INNER JOIN DETALLE_EXPEDIENTE b
ON a.id_usuario = b.id_usuario
INNER JOIN PUESTO c
ON c.id_puesto = b.id_puesto
INNER JOIN DETALLE_REQUISITO d
ON c.id_puesto = d.id_puesto
INNER JOIN REQUISITO e
ON e.id_requisito = d.id_requisito
INNER JOIN DETALLE_FORMATO f
ON f.id_requisito = e.id_requisito
INNER JOIN FORMATO g
ON g.id_formato = f.id_formato
WHERE nombre_usuario = '6789456218542'
ORDER BY e.id_requisito;





--ASOCIAR DOCUMENTO CON EXPEDIENTE
set serveroutput on;
create or replace procedure asociarDocumentoRequisito 
(
cui_in IN VARCHAR2,
ubicacion_in IN VARCHAR2,
id_requisito_in IN NUMBER,
id_puesto_in IN NUMBER,
respuesta_out OUT NUMBER
)    
is  
id_expediente_in NUMBER;
id_documento_in NUMBER;
begin   
    --Conseguir el id del expediente
    SELECT id_expediente INTO id_expediente_in FROM EXPEDIENTE WHERE cui = cui_in; 
    --Conseguir el id del documento
    SELECT id_documento INTO id_documento_in FROM DOCUMENTO WHERE ubicacion = ubicacion_in;
    --Asociar expedientes con documentos
    INSERT INTO DETALLE_DOCUMENTO (id_expediente, id_documento) VALUES (id_expediente_in,id_documento_in);
    --Asociar documentos con requisitos
    INSERT INTO DETALLE_REQUISITO_DOCUMENTO (id_puesto,id_requisito,id_documento)
    VALUES (id_puesto_in,id_requisito_in,id_documento_in);  
    respuesta_out:=1;
    EXCEPTION when NO_DATA_FOUND then
        respuesta_out:=0;
end;

--Editar expediente

set serveroutput on;
create or replace procedure edicionExpediente 
(
cui_in IN VARCHAR2,
nombres_in IN VARCHAR2,
apellidos_in IN VARCHAR2,
email_in IN VARCHAR2,
direccion_in IN VARCHAR2,
telefono_in IN NUMBER,
respuesta_out OUT NUMBER
)    
is  
id_expediente_in NUMBER;
begin   
    --Conseguir el id del expediente
    SELECT id_expediente INTO id_expediente_in FROM EXPEDIENTE WHERE cui = cui_in; 
    --Actualizar los campos
    UPDATE 
        EXPEDIENTE
    SET
        nombres = nombres_in,
        apellidos = apellidos_in,
        email = email_in,
        direccion = direccion_in,
        telefono = telefono_in
    WHERE cui = cui_in;
    respuesta_out:=1;
    EXCEPTION when NO_DATA_FOUND then
        respuesta_out:=0;
end;

-- GE requisitos de un aplicante para revision
SELECT a.id_documento,a.nombre_documento, a.ubicacion,e.nombre_requisito,
a.id_estado_documento,b.nombre_formato, f.cui, e.id_requisito, g.nombre_estado_documento from documento a
INNER JOIN FORMATO b
ON a.id_formato = b.id_formato
INNER JOIN DETALLE_DOCUMENTO c
ON c.id_documento = a.id_documento
INNER JOIN DETALLE_REQUISITO_DOCUMENTO d
ON d.id_documento = a.id_documento
INNER JOIN REQUISITO e
ON e.id_requisito = d.id_requisito
INNER JOIN EXPEDIENTE f
ON f.id_expediente = c.id_expediente
INNER JOIN ESTADO_DOCUMENTO g
ON g.id_estado_documento = a.id_estado_documento
WHERE f.cui = '6789456218542'
GROUP BY a.id_documento,a.nombre_documento,a.ubicacion,e.nombre_requisito,
a.id_estado_documento,b.nombre_formato,f.cui,e.id_requisito, g.nombre_estado_documento;

select * from estado_documento;




SELECT a.id_documento,a.nombre_documento, a.ubicacion,e.nombre_requisito,
      a.id_estado_documento,b.nombre_formato, f.cui, e.id_requisito, g.nombre_estado_documento from documento a
      INNER JOIN FORMATO b
      ON a.id_formato = b.id_formato
      INNER JOIN DETALLE_DOCUMENTO c
      ON c.id_documento = a.id_documento
      INNER JOIN DETALLE_REQUISITO_DOCUMENTO d
      ON d.id_documento = a.id_documento
      INNER JOIN REQUISITO e
      ON e.id_requisito = d.id_requisito
      INNER JOIN EXPEDIENTE f
      ON f.id_expediente = c.id_expediente
      INNER JOIN ESTADO_DOCUMENTO g
      ON g.id_estado_documento = a.id_estado_documento
      WHERE f.cui = '6789456218542'
      GROUP BY a.id_documento,a.nombre_documento,a.ubicacion,e.nombre_requisito,
      a.id_estado_documento,b.nombre_formato,f.cui,e.id_requisito, g.nombre_estado_documento;
      select * from usuario;
      
      
      --Traer requisitos cargados por el usuario y rechazados
      SELECT a.id_requisito,a.id_documento,b.id_expediente, c.id_estado_documento, 
      d.nombre_estado_documento, e.cui FROM DETALLE_REQUISITO_DOCUMENTO a
      INNER JOIN DETALLE_DOCUMENTO b
      ON a.id_documento = b.id_documento
      INNER JOIN DOCUMENTO c
      ON c.id_documento = b.id_documento
      INNER JOIN ESTADO_DOCUMENTO d
      ON d.id_estado_documento = c.id_estado_documento
      INNER JOIN EXPEDIENTE e
      ON e.id_expediente = b.id_expediente
      WHERE c.id_estado_documento = 2
      AND e.cui = '6789456218542'
      GROUP BY a.id_requisito,a.id_documento,b.id_expediente,c.id_estado_documento,d.nombre_estado_documento,e.cui;
      
      
      --Traer requisitos cargados por el usuario que no fueron rechazados
      SELECT a.id_requisito,a.id_documento,b.id_expediente, c.id_estado_documento, 
      d.nombre_estado_documento, e.cui FROM DETALLE_REQUISITO_DOCUMENTO a
      INNER JOIN DETALLE_DOCUMENTO b
      ON a.id_documento = b.id_documento
      INNER JOIN DOCUMENTO c
      ON c.id_documento = b.id_documento
      INNER JOIN ESTADO_DOCUMENTO d
      ON d.id_estado_documento = c.id_estado_documento
      INNER JOIN EXPEDIENTE e
      ON e.id_expediente = b.id_expediente
      WHERE c.id_estado_documento != 2
      AND e.cui = '6789456218542'
      GROUP BY a.id_requisito,a.id_documento,b.id_expediente,c.id_estado_documento,d.nombre_estado_documento,e.cui;
 
        select * from rol;
      select * from documento;
select * from detalle_requisito_documento;

--traer puestos para el carrusel

SELECT a.id_puesto,a.nombre_puesto,a.imagen,a.salario,a.id_estado_puesto,
c.nombre_departamento,c.id_departamento, SUM(d.valor) valor ,
COUNT(d.id_puesto) veces, TRUNC((SUM(d.valor)/COUNT(d.id_puesto)),1) puntuacion FROM PUESTO a
INNER JOIN DETALLE_PUESTO b
ON a.id_puesto = b.id_puesto
INNER JOIN DEPARTAMENTO c
ON c.id_departamento = b.id_departamento
FULL OUTER JOIN CALIFICACION d
ON d.id_puesto = a.id_puesto
GROUP BY a.id_puesto,a.nombre_puesto,a.imagen,a.salario,a.id_estado_puesto,
c.nombre_departamento,c.id_departamento
ORDER BY salario DESC;

INSERT INTO CALIFICACION (valor,id_usuario,id_puesto)
VALUES (4,2,1);

SELECT a.id_puesto,a.id_categoria,b.nombre_puesto, c.nombre_categoria from detalle_categoria a
      INNER JOIN PUESTO b
      ON a.id_puesto = b.id_puesto
      INNER JOIN CATEGORIA c
      ON c.id_categoria = a.id_categoria;


-------ACEPTAR RECHAZAR EXPEDIENTES
set serveroutput on;
create or replace procedure aceptarRechazarExpediente 
(
id_expediente_in IN NUMBER,
opcion_in IN NUMBER,
respuesta_out OUT NUMBER 
)    
is   
fecha_actual DATE :=SYSDATE;
begin   
    UPDATE DETALLE_REVISION SET estado_revision = 1
    WHERE id_expediente = id_expediente_in;
    IF (opcion_in=1) THEN
        UPDATE EXPEDIENTE set id_estado_expediente = 4
        WHERE id_expediente = id_expediente_in;
    ELSE
        UPDATE EXPEDIENTE set id_estado_expediente = 5
        WHERE id_expediente = id_expediente_in;
        UPDATE USUARIO SET estado_usuario = 0, fecha_fin = fecha_actual
        WHERE id_expediente = id_expediente_in;
    END IF;
    respuesta_out := 1;
    exception
        when NO_DATA_FOUND 
            then
                respuesta_out := 0;              
end;




--Conseguir revisor desocupado
SELECT id_usuario FROM
    (

SELECT id_usuario, nombre_usuario, estado_usuario,
    SUM(estado_real) suma FROM
    (
        SELECT a.id_usuario,a.nombre_usuario,a.estado_usuario,b.id_detalle_revision,
        b.id_expediente,
        CASE WHEN b.estado_revision = 0 then 1 ELSE 0 END as estado_real,
        b.estado_revision
        from usuario a
        LEFT OUTER JOIN detalle_revision b
        ON a.id_usuario = b.id_usuario
        WHERE a.id_rol = 3 AND a.estado_usuario = 1
        GROUP BY a.id_usuario,a.nombre_usuario,a.estado_usuario,
        b.id_detalle_revision,b.id_expediente,b.estado_revision
    )
    GROUP BY
    id_usuario, nombre_usuario, estado_usuario 
    ORDER BY SUMA
    FETCH FIRST 1 ROWS ONLY
    )
;




-------CREAR MOTIVO
set serveroutput on;
create or replace procedure crearMotivo 
(
id_documento_in IN NUMBER,
motivo_in IN VARCHAR2,
respuesta_out OUT NUMBER 
)    
is   
fecha_actual DATE :=SYSDATE;
begin   
    INSERT INTO DETALLE_MOTIVO_RECHAZO (motivo,id_documento,fecha) VALUES (motivo_in,id_documento_in,fecha_actual);
    respuesta_out := 1;
    exception
        when NO_DATA_FOUND 
            then
                respuesta_out := 0;              
end;


DECLARE
    respuesta NUMBER;
BEGIN
    crearMotivo(11,'nada bueno',respuesta);
END;




select * from documento;

