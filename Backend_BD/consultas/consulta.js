const { AQ_DEQ_MODE_LOCKED } = require('oracledb');
const oracledb = require('oracledb');
const nodemailer = require("nodemailer");

oracledb.initOracleClient({libDir: './instantclient_21_3'});


async function run() {

    let connection;
    
  
    try {
      
      connection = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  
      // Create a table
  
      await connection.execute(`begin
                                  execute immediate 'drop table nodetab';
                                  exception when others then if sqlcode <> -942 then raise; end if;
                                end;`);
  
      await connection.execute(`create table nodetab (id number, data varchar2(20))`);
  
      // Insert some rows
  
      const sql = `INSERT INTO nodetab VALUES (:1, :2)`;
  
      const binds =
        [ [1, "First" ],
          [2, "Second" ],
          [3, "Third" ],
          [4, "Fourth" ],
          [5, "Fifth" ],
          [6, "Sixth" ],
          [7, "Seventh" ] ];
  
      await connection.executeMany(sql, binds);
  
      connection.commit();     // uncomment to make data persistent
  
      // Now query the rows back
  
      const result = await connection.execute(`SELECT * FROM nodetab`);
  
      console.dir(result.rows, { depth: null });
  
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

async function crearRol(nombre_rol) {
    try {
        //oracledb.initOracleClient({libDir: './instantclient_21_3'})
        connection = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
    
        let dato = 'nuevo_rol';
        let sql = await connection.execute(
            `INSERT INTO ROL (nombre_rol) VALUES ('`+dato+`')`
          );
    
        connection.commit();   
     
        const result = await connection.execute(`SELECT * FROM ROL`);
    
        console.dir(result.rows, { depth: null });
    
      } catch (err) {
        console.error(err);
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error(err);
          }
        }
      }

}


//Para consultas con variables OUT
/*
async function crearFormato(nombre_rol) {
  let respuesta;
  try {
      //oracledb.initOracleClient({libDir: './instantclient_21_3'})
      connection = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  
      let dato = nombre_rol;
      const resultado = await connection.execute(
        `BEGIN
          crearFormato(:entrada, :id);
         END;`,
        {  // bind variables
          entrada:   dato,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        }
      );
      connection.commit();   
      //console.dir(resultado.outBinds);
      respuesta = resultado.outBinds;
  
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
    return respuesta;
}
*/

async function crearFormato(nombre_formato,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
          crearFormato(:nombre);
         END;`,
        {  // bind variables
          nombre: nombre_formato
        }
      );
      connection.commit();
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function crearCategoria(nombre_categoria,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
          crearCategoria(:nombre);
         END;`,
        {  // bind variables
          nombre: nombre_categoria
        }
      );
      connection.commit();
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function crearRequisito(nombre_requisito,tamano_requisito,obligatorio_requisito,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
          crearRequisito(:nombre, :tamano, :obligatorio);
         END;`,
        {  // bind variables
          nombre: nombre_requisito,
          tamano: tamano_requisito,
          obligatorio: obligatorio_requisito
        }
      );
      connection.commit();
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function crearPuesto(nombre_puesto,imagen_puesto,salario_puesto,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
          crearPuesto(:nombre, :imagen, :salario, :estado);
         END;`,
        {  // bind variables
          nombre: nombre_puesto,
          imagen: imagen_puesto,
          salario: salario_puesto,
          estado: 1
        }
      );
      connection.commit();
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function crearDepartamento(nombre_depto,capital_depto,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
          crearDepartamento(:nombre, :capital);
         END;`,
        {  // bind variables
          nombre: nombre_depto,
          capital: capital_depto
        }
      );
      connection.commit();
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function llenarDetalleCategoria(puesto_in,categoria_in,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
        puesto_categoria(:puesto, :categoria);
         END;`,
        {  // bind variables
          puesto: puesto_in,
          categoria: categoria_in
        }
      );
      connection.commit();
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function llenarDetallePuesto(puesto_in,departamento_in,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
        puesto_departamento(:puesto, :departamento);
         END;`,
        {  // bind variables
          puesto: puesto_in,
          departamento: departamento_in
          
        }
      );
      connection.commit();
    } catch (err) {
      console.error(err);
    } finally {

    }
}



async function llenarDetalleFormato(formato_in,requisito_in,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
        formato_requisito(:formato, :requisito);
         END;`,
        {  // bind variables
          formato: formato_in,
          requisito: requisito_in
          
        }
      );
      connection.commit();
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function llenarDetalleRequisito(puesto_in,requisito_in,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
        puesto_requisito(:puesto, :requisito);
         END;`,
        {  // bind variables
          puesto: puesto_in,
          requisito: requisito_in
          
        }
      );
      connection.commit();
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function llenarDetalleDepartamento(padre_in,hijo_in,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
        departamento_departamento(:padre, :hijo);
         END;`,
        {  // bind variables
          padre: padre_in,
          hijo: hijo_in       
        }
      );
      connection.commit();
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function queryCrearDocumento(nombre_doc_in,ubicacion_doc_in,
  formato_doc_in,estado_doc_in,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
        crearDocumento(:nombre, :ubicacion,:formato,:estado,:respuesta);
         END;`,
        {  // bind variables
          nombre: nombre_doc_in,
          ubicacion: ubicacion_doc_in,
          formato:formato_doc_in,
          estado: estado_doc_in,
          respuesta: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        }
      );
      connection.commit();
      respuesta = resultado.outBinds;
      console.log(respuesta);
    } catch (err) {
      console.error(err);
    } finally {

    }
}



async function queryCrearExpediente(nombre_in,apellido_in,direccion_in,
  email_in,dpi_in,telefono_in,cv_in,estado_in,puesto_in, connection) {
    console.log('en el método de crear expediente');
  var password = Math.random().toString(36).slice(-8);
  try {
      const resultado = await connection.execute(
        `BEGIN
        crearExpediente(:nombre, :apellido, :direccion, :email, :dpi,
          :telefono, :cv, :estado, :puesto, :pass, :respuesta);
         END;`,
        {  // bind variables
          nombre: nombre_in,
          apellido: apellido_in,
          direccion:direccion_in,
          email: email_in,
          dpi:dpi_in,
          telefono:telefono_in,
          cv:cv_in,
          estado:estado_in,
          puesto: puesto_in,
          pass: password,
          respuesta: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        }
      );
      connection.commit();
      respuesta = resultado.outBinds;
      console.log(respuesta);
    } catch (err) {
      console.error(err);
    } finally {
    }
}


async function queryCrearUsuario(nombre_in,pass_in,email_in,
  rol_in,estado_in,departamento_in,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
        crearUsuario(:nombre, :pass, :email, :rol, :estado, :departamento, :respuesta);
         END;`,
        {  // variables bind
          nombre: nombre_in,
          pass: pass_in,
          email: email_in,
          rol:rol_in,
          estado:estado_in,
          departamento:departamento_in,
          respuesta: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        }
      );
      connection.commit();
      respuesta = resultado.outBinds;
      console.log(respuesta);
    } catch (err) {
      console.error(err);
    } finally {
    }
}


async function asociarDocumentoRequisito(cui_in,ubicacion_in,id_requisito_in,id_puesto_in,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
        asociarDocumentoRequisito(:cui, :ubicacion, :requisito, :puesto, :respuesta);
         END;`,
        {  // variables bind
          cui: cui_in,
          ubicacion: ubicacion_in,
          requisito: id_requisito_in,
          puesto:id_puesto_in,
          respuesta: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        }
      );
      connection.commit();
      respuesta = resultado.outBinds;
      console.log(respuesta);
    } catch (err) {
      console.error(err);
    } finally {
    }
}

async function enviarPuestos(connection) {
  try {
      const resultado = await connection.execute(
        `SELECT id_puesto as id, nombre_puesto as nombre from PUESTO`
      );
      connection.commit();
      console.log(resultado.rows);
      return resultado.rows;
    } catch (err) {
      console.error(err);
    } finally {
      
    }
}


async function enviarDocumentosRechazados(cui,connection) {
  try {
      const resultado = await connection.execute(
        `
        SELECT a.id_requisito,a.id_documento,b.id_expediente, c.id_estado_documento, 
        d.nombre_estado_documento, e.cui, f.nombre_formato, g.nombre_requisito, 
        c.nombre_documento, f.id_formato FROM DETALLE_REQUISITO_DOCUMENTO a
        INNER JOIN DETALLE_DOCUMENTO b
        ON a.id_documento = b.id_documento
        INNER JOIN DOCUMENTO c
        ON c.id_documento = b.id_documento
        INNER JOIN ESTADO_DOCUMENTO d
        ON d.id_estado_documento = c.id_estado_documento
        INNER JOIN EXPEDIENTE e
        ON e.id_expediente = b.id_expediente
        INNER JOIN FORMATO f
        ON f.id_formato = c.id_formato
        INNER JOIN REQUISITO g
        ON g.id_requisito = a.id_requisito
        WHERE c.id_estado_documento = 2
        AND e.cui = '${cui}'
        GROUP BY a.id_requisito,a.id_documento,b.id_expediente,
        c.id_estado_documento,d.nombre_estado_documento,e.cui,
        f.nombre_formato,g.nombre_requisito, c.nombre_documento,
        f.id_formato 
        `
      );
      connection.commit();
      console.log(resultado.rows);
      return resultado.rows;
    } catch (err) {
      console.error(err);
    } finally {
      
    }
}


async function enviarDocumentosCargados(cui,connection) {
  try {
      const resultado = await connection.execute(
        `
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
        AND e.cui = '${cui}'
        GROUP BY a.id_requisito,a.id_documento,b.id_expediente,
        c.id_estado_documento,d.nombre_estado_documento,e.cui           
        `
      );
      connection.commit();
      console.log(resultado.rows);
      return resultado.rows;
    } catch (err) {
      console.error(err);
    } finally {
      
    }
}


async function enviarRoles(connection) {
  try {
      const resultado = await connection.execute(
        `SELECT id_rol as id, nombre_rol as nombre from ROL`
      );
      connection.commit();
      console.log(resultado.rows);
      return resultado.rows;
    } catch (err) {
      console.error(err);
    } finally {
      
    }
}

async function enviarDepartamentos(connection) {
  try {
      const resultado = await connection.execute(
        `SELECT id_departamento as id, nombre_departamento as nombre from DEPARTAMENTO`
      );
      connection.commit();
      console.log(resultado.rows);
      return resultado.rows;
    } catch (err) {
      console.error(err);
    } finally {
      
    }
}



const crearExpediente = async (doc,conexion) => {
  console.log(doc);
  //Crear expediente
  await queryCrearExpediente(doc.nombre,doc.apellido,doc.direccion,doc.email,
    doc.dpi,doc.telefono,doc.cv,doc.estado,doc.puesto,conexion);
  //Mandar email
    
};

const crearUsuario = async (doc,conexion) => {
  console.log(doc);

  await queryCrearUsuario(doc.nombre,doc.pass,doc.email,doc.rol,
    doc.estado,doc.departamento,conexion);  
};

const crearDocumento = async (doc,conexion) => {
  console.log(doc);
  await queryCrearDocumento(doc.nombre,doc.ubicacion,doc.formato,doc.estado,conexion);
};


const recorrerJson = async(aJson,forma,conexion) => {
  /*
  if (aJson.departamentos){
    //Tiene más departamentos, recorrer cada uno
    Object.entries(aJson.departamentos).map(([key,value]) => {
      //Buscar más departamentos hasta llegar a un punto final
      console.log(forma+'departamentos');
      recorrerJson(value,forma+'-');
    });
  }
  */
  //console.log(aJson);
  if (aJson.departamento){
    let puestos;
    let departamentosOut = [];
    let departamentosIn;
    let capital = 0;
    //Recorrer departamentos
    Object.entries(aJson.departamento).map(([key,value]) => {
      //Buscar más departamentos hasta llegar a un punto final
      console.log(forma+'departamento');
      console.log(value.nombre);
      console.log(value.capital_total);
      capital = parseFloat(value.capital_total[0]);
      //aqui va la query para crear los departamentos
      crearDepartamento(value.nombre[0].trim(),value.capital_total[0],conexion);
      //Conseguir los puestos
      if (value.puestos){
        let puesto;
        //console.log('Entro a puestos')
        //Recorrer puestos
        Object.entries(value.puestos).map(([key1,value1]) => {
          //console.log(forma+'puestos');
          puesto = recorrerJson(value1,forma+'-',conexion);
        });  
        //puestos = puesto;   
        console.log('puestos');
        console.log(puesto);
      }
      
      if (value.departamentos){
        let departamentosEn;
        //Recorrer departamentos
        Object.entries(value.departamentos).map(([key1,value1]) => {
          //console.log(forma+'puestos');
          departamentosEn = recorrerJson(value1,forma+'-',conexion);
        });  
        departamentosIn = departamentosEn;  
        console.log(departamentosIn); 
      } 
      departamentosOut.push(value.nombre);
    });
    
    
    return departamentosOut;
  }

  if (aJson.puesto){
    //console.log('Entro a puesto')
    let puestos = [];
    let salario = 0;
    //Puesto final recorrer cada uno
    Object.entries(aJson.puesto).map(([key,value]) => {
      //console.log(forma+'puesto');
      //console.log(value.imagen);
      //console.log(value.nombre);
      //console.log(value.salario);
      salario = parseFloat(value.salario[0]);
      //console.dir(value.salario[0]);
      //Aqui va la consulta para crear los puestos
      if (value.imagen){
        crearPuesto(value.nombre[0].trim(),value.imagen[0],salario,conexion);
      }else{
        crearPuesto(value.nombre[0].trim(),'no',salario,conexion);     
      }
      Object.entries(value.categorias).map(([key1,value1]) => {
        categorias = recorrerJson(value1,forma+'-',conexion);
        //categorias.push(categoria);
      });
      Object.entries(value.requisitos).map(([key2,value2]) => {
        requisitos = recorrerJson(value2,forma+'-',conexion);
        //requisitos.push(requisito);
      });
      //console.log(requisitos);
      //Agregar cada puesto
      //console.log(forma+'Puesto');
      //console.log(value.nombre);
      //console.log(forma+'Categorias');
      //console.log(forma,categorias);
      //console.log(forma+'requisitos');
      //console.log(forma,requisitos);
      puestos.push(value.nombre);
    });   
    return puestos;
  }
  if (aJson.requisitos){
    let requisitos;
    //Recorrer requisitos
    Object.entries(aJson.requisitos).map(([key,value]) => {
      console.log(forma+'requisitos');
      requisitos = recorrerJson(value,forma+'-',conexion);
    });      
    return requisitos;
  }
  if (aJson.requisito){
    let requisitos = [];
    //Recorrer requisitos
    Object.entries(aJson.requisito).map(([key,value]) => {
      //console.log(forma+'datos del requisito');
      //console.log(forma,value.nombre);
      //console.log(forma,value.obligatorio);
      //console.log(forma,value.tamaño);
      //Aqui va la query para crear los requisitos
      crearRequisito(value.nombre[0].trim(),value.tamaño[0],value.obligatorio[0],conexion);
      Object.entries(value.formatos).map(([key1,value1]) => {
        formato = recorrerJson(value1,forma+'-',conexion);
        //formatos.push(formato);
      }); 
      //console.log(forma+'requisitos');
      //console.log(forma,value.nombre);
      //console.log(forma+'formatos');
      //console.log(forma,formato);
      requisitos.push(value.nombre);
    });  
    return requisitos;  
  }
  if (aJson.formatos){
    let formatos = [];
    //Recorrer requisitos
    Object.entries(aJson.formatos).map(([key,value]) => {
      //Imprimiendo las categorías
      //Ahora recorrer cada categoria
      Object.entries(value).map(([key1,value1]) => {
        //Ahora recorrer cada categoria
        Object.entries(value1).map(([key2,value2]) => {
          //Ahora recorrer cada categoria
          //Aqui crear los formatos
          //console.log(forma+'Formato: ',value2.nombre);
          console.log(value2.nombre);
          formatos.push(value2.nombre);
        }); 
      });   
    });  
    return formatos;   
  }
  if (aJson.categorias){
    //Recorrer categorias y este ya es final para la creación
    Object.entries(aJson.categorias).map(([key,value]) => {
      //Imprimiendo las categorías
      //Ahora recorrer cada categoria
      Object.entries(value).map(([key1,value1]) => {
        //Ahora recorrer cada categoria
        Object.entries(value1).map(([key2,value2]) => {
          //Ahora recorrer cada categoria
          //Aqui crear las categorías
          console.log(forma+'Categoria: ',value2.nombre);
        }); 
      });   
    });    
  }
  if (aJson.categoria){
    let categorias = [];
    //Recorrer categorias y este ya es final para la creación
    Object.entries(aJson.categoria).map(([key,value]) => {
        //console.log(forma+'Categoria: ',value.nombre);
        //Aqui va la query para crear las categorías
        crearCategoria(value.nombre[0].trim(),conexion);
        categorias.push(value.nombre);
    });    
    return categorias;
  }
  if (aJson.formato){
    let formatos = [];
    //Recorrer categorias y este ya es final para la creación
    Object.entries(aJson.formato).map(([key,value]) => {
        //console.log(forma+'Categoria: ',value.nombre);
        //console.log(value.nombre);
        //Aqui va la query para crear los formatos
        crearFormato(value.nombre[0].trim(),conexion);
        formatos.push(value.nombre);
    });    
    /*
    if (conexion) {
      try {
        await conexion.close();
      } catch (err) {
        console.error(err);
      }
    }
    */
    return formatos;
  }
  return;
};


const tablasRojas = (aJson,forma,conexion) => {
  if (aJson.departamento){
    let departamentosOut = [];
    let departamentosIn;
    let capital = 0;

    Object.entries(aJson.departamento).map(([key,value]) => {
      //console.log(forma+'departamento');
      //console.log(value.nombre[0]);
      //console.log(value.capital_total);
      //capital = parseFloat(value.capital_total[0]);
      //Conseguir los puestos
      if (value.puestos){
        let puesto;
        //console.log('Entro a puestos')
        //Recorrer puestos
        Object.entries(value.puestos).map(([key1,value1]) => {
          //console.log(forma+'puestos');
          puesto = tablasRojas(value1,forma+'-',conexion);
        });  
        //puestos = puesto;   
        //console.log('puestos');
        //console.log(puesto);
        ///////////////////////////////////////////////////////////DETALLE PUESTOS
        Object.entries(puesto).map(([key1,value1]) => {
          llenarDetallePuesto(value1[0].trim(),value.nombre[0].trim(),conexion);
        });  
      }

      if (value.departamentos){
        
        //Recorrer departamentos
        Object.entries(value.departamentos).map(([key1,value1]) => {
          departamentosIn = tablasRojas(value1,forma+'-',conexion);
        });  

        ///////////////////////////////////////////////////////////DETALLE DEPARTAMENTO
        Object.entries(departamentosIn).map(([key1,value1]) => {
          llenarDetalleDepartamento(value.nombre[0].trim(),value1[0].trim(),conexion);
        });  
      } 
      departamentosOut.push(value.nombre);
    });  
    return departamentosOut;
  }

  if (aJson.puesto){
    //console.log('Entro a puesto')
    let requisitos = [];
    let categorias = [];
    let puestos = [];
    //Puesto final recorrer cada uno
    Object.entries(aJson.puesto).map(([key,value]) => {

      Object.entries(value.categorias).map(([key1,value1]) => {
        categorias = tablasRojas(value1,forma+'-',conexion);
      });
      Object.entries(value.requisitos).map(([key2,value2]) => {
        requisitos = tablasRojas(value2,forma+'-',conexion);
        //requisitos.push(requisito);
      });

      //////////////////////////////////////////////////////////////DETALLE CATEGORIA
      Object.entries(categorias).map(([key1,value1]) => {
        llenarDetalleCategoria(value.nombre[0].trim(),value1[0].trim(),conexion);
      });

      
      //////////////////////////////////////////////////////////////DETALLE REQUISITO
      Object.entries(requisitos).map(([key1,value1]) => {
        llenarDetalleRequisito(value.nombre[0].trim(),value1[0].trim(),conexion);
      });
      
      puestos.push(value.nombre);
    });   
    return puestos;
  }
  if (aJson.requisito){
    let requisitos = [];
    let formato;
    //Recorrer requisitos
    Object.entries(aJson.requisito).map(([key,value]) => {

      Object.entries(value.formatos).map(([key1,value1]) => {
        formato = tablasRojas(value1,forma+'-',conexion);
      }); 

      ////////////////////////////////////////////////////DETALLE FORMATO
      Object.entries(formato).map(([key1,value1]) =>{
        llenarDetalleFormato(value1[0].trim(),value.nombre[0].trim(),conexion);
      });

      requisitos.push(value.nombre);
    });  
    return requisitos;  
  }
  if (aJson.categoria){
    let categorias = [];
    //Recorrer categorias y este ya es final para la creación
    Object.entries(aJson.categoria).map(([key,value]) => {
        //console.log(forma+'Categoria: ',value.nombre);
        //Aqui va la query para crear las categorías

        categorias.push(value.nombre);
    });    
    return categorias;
  }
  if (aJson.formato){
    let formatos = [];
    //Recorrer categorias y este ya es final para la creación
    Object.entries(aJson.formato).map(([key,value]) => {
        //console.log(forma+'Categoria: ',value.nombre);
        //console.log(value.nombre);
        //Aqui va la query para crear los formatos
        formatos.push(value.nombre);
    });    
    return formatos;
  }
  return;
};



async function enviarUsuarioRevision(connection) {
  try {
      const resultado = await connection.execute(
        `SELECT id_usuario,nombre_usuario,email FROM USUARIO 
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
        `
      );
      connection.commit();
      //console.log(resultado.rows);
      return resultado.rows;
    } catch (err) {
      console.error(err);
    } finally {
      
    }
}


async function enviarUsuarios(connection){
  try {
    const resultado = await connection.execute(
      `select * from traerUsuarios`
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function enviarPlantilla(id_departamento, connection){
  try {
    const resultado = await connection.execute(
      `SELECT c.cui, c.nombres,c.apellidos,c.email,c.direccion,c.telefono, e.nombre_estado_expediente, g.nombre_puesto,  
      b.nombre_rol, g.salario, i.id_departamento, g.id_puesto FROM usuario a
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
      WHERE i.id_departamento = ${id_departamento}
      AND c.id_estado_expediente = 4
      AND j.estado_usuario = 1
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function enviarRequisitosAplicanteRevision(cui, connection){
  try {
    const resultado = await connection.execute(
      `SELECT a.id_documento,a.nombre_documento, a.ubicacion,e.nombre_requisito,
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
      WHERE f.cui = '${cui}'
      GROUP BY a.id_documento,a.nombre_documento,a.ubicacion,e.nombre_requisito,
      a.id_estado_documento,b.nombre_formato,f.cui,e.id_requisito, g.nombre_estado_documento
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}



async function enviarExpedientes(id_revisor, connection){
  console.log("id del revisor: ",id_revisor);
  try {
    const resultado = await connection.execute(
      `SELECT c.cui,c.nombres,c.apellidos,h.nombre_puesto, d.nombre_estado_expediente, TO_CHAR(b.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, 
      c.email,c.direccion, c.telefono,c.cv,d.nombre_estado_expediente, e.ubicacion, e.nombre_documento, 
      f.nombre_formato, h.id_puesto, c.id_estado_expediente, c.id_expediente, e.id_documento FROM detalle_revision a
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
      WHERE a.id_usuario = ${id_revisor}
      AND (c.id_estado_expediente = 1 OR c.id_estado_expediente = 2 OR c.id_estado_expediente = 3 OR c.id_estado_expediente = 6)
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}



async function enviarRequisitosAplicante(nombre_aplicante, connection){
  console.log("id del aplicante: ",nombre_aplicante);
  try {
    const resultado = await connection.execute(
      `SELECT a.nombre_usuario,a.id_usuario,c.nombre_puesto, e.id_requisito,e.nombre_requisito,
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
      WHERE nombre_usuario = '${nombre_aplicante}'
      ORDER BY e.id_requisito
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}




async function getDepartamento(dato,connection){
  try {
    const resultado = await connection.execute(
      `BEGIN
      :ret := getDepartamento('${dato}');
      END;`,
      {
        ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
      }
    );
    connection.commit();
  console.log(resultado.outBinds);
    return resultado.outBinds;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function getCredenciales(dato,connection){
  try {
    const resultado = await connection.execute(
      `SELECT nombre_usuario, pass_usuario, id_rol from usuario 
      WHERE nombre_usuario = '${dato}'`);
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function getDatosCarrusel(connection){
  try {
    const resultado = await connection.execute(
      `
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
      ORDER BY salario DESC 
      `);
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function getCategoriasCarrusel(connection){
  try {
    const resultado = await connection.execute(
      `
      SELECT a.id_puesto,a.id_categoria,b.nombre_puesto, c.nombre_categoria from detalle_categoria a
      INNER JOIN PUESTO b
      ON a.id_puesto = b.id_puesto
      INNER JOIN CATEGORIA c
      ON c.id_categoria = a.id_categoria
      ORDER BY id_puesto
      `);
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function login(usuario,password, connection){
  try {
    const resultado = await connection.execute(
      `SELECT nombre_usuario, pass_usuario, id_rol, id_usuario, estado_usuario,email from usuario 
      WHERE nombre_usuario = '${usuario}'
      AND pass_usuario = '${password}'
      `);
    connection.commit();
    console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function getExpedienteAplicante(dato,connection){
  try {
    const resultado = await connection.execute(
      `SELECT * FROM EXPEDIENTE 
      WHERE cui = '${dato}'`);
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}

async function getRevisor(nombre,connection){
  try {
    const resultado = await connection.execute(
      `BEGIN
      :ret := getRevisor('${nombre}');
      END;`,
      {
        ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
      }
    );
    connection.commit();
    //console.log(resultado);
    return resultado.outBinds.ret;
    //return 0;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}



async function editarUsuario(dato,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
          editarUsuario(:nombre, :pass, :correo, :respuesta);
         END;`,
        {  // bind variables
          nombre: dato.nombre,
          pass: dato.pass,
          correo: dato.email,
          respuesta: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        }
      );
      connection.commit();
      console.log(resultado.outBinds);
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function editarExpediente(dato,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
        edicionExpediente(:cui, :nombres, :apellidos, :email, :direccion, :telefono, :respuesta);
         END;`,
        {  // bind variables
          cui: dato.cui.toString(),
          nombres: dato.nombre,
          apellidos: dato.apellido,
          email: dato.email,
          direccion: dato.direccion,
          telefono: dato.telefono,
          respuesta: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        }
      );
      connection.commit();
      console.log(resultado.outBinds);
    } catch (err) {
      console.error(err);
    } finally {

    }
}



async function eliminarUsuario(dato,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
          eliminarUsuario(:nombre, :pass, :correo, :respuesta);
         END;`,
        {  // bind variables
          nombre: dato.nombre,
          pass: dato.pass,
          correo: dato.email,
          respuesta: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        }
      );
      connection.commit();
      console.log(resultado.outBinds);
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function filtroNombreUsuario(connection,nombre){
  try {
    const resultado = await connection.execute(
      `select nombre_usuario as nombre, estado_usuario as estado,
      TO_CHAR(a.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, TO_CHAR(a.fecha_fin, 'DD-MM-YYYY') as fecha_fin,
      nombre_rol as rol,id_usuario, pass_usuario as contraseña, email 
      from USUARIO a
      INNER JOIN ROL b
      ON a.id_rol = b.id_rol
      WHERE nombre_usuario = '${nombre}'`
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function aceptarExpediente(id_expediente,connection){
  console.log(id_expediente);
  try {
    const resultado = await connection.execute(
      `
      UPDATE EXPEDIENTE SET id_estado_expediente = 4
      WHERE id_expediente = ${id_expediente}
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}



async function actualizarUbicacion(id_documento,ubicacion,connection){
  console.log(id_documento);
  try {
    const resultado = await connection.execute(
      `
      UPDATE DOCUMENTO SET ubicacion = '${ubicacion}',
      id_estado_documento = 3
      WHERE id_documento = ${id_documento}
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}



async function actualizarDocumento(id_doc,nombre_doc,ubicacion_doc,formato_doc,estado_doc,connection){
  console.log(id_doc);
  console.log(ubicacion_doc);
  try {
    const resultado = await connection.execute(
      `
      UPDATE DOCUMENTO SET ubicacion = '${ubicacion_doc}',
      nombre_documento = '${nombre_doc}',
      id_formato = ${formato_doc},
      id_estado_documento = ${estado_doc}
      WHERE id_documento = ${id_doc}
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}

async function rechazarRevisado(cui, connection){
  console.log(id_expediente);
  try {
    const resultado = await connection.execute(
      `
      UPDATE EXPEDIENTE SET id_estado_expediente = 2,
      WHERE cui = '${cui}'
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function aceptarDocumento(id_documento,connection){
  try {
    const resultado = await connection.execute(
      `
      UPDATE DOCUMENTO SET id_estado_documento = 1
      WHERE id_documento = ${id_documento}
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function rechazarDocumento(id_documento,motivo,connection){
  try {
    const resultado = await connection.execute(
      `
      UPDATE DOCUMENTO SET id_estado_documento = 2, 
      motivo_rechazo = '${motivo}'
      WHERE id_documento = ${id_documento}
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function aprobarExpediente(id_expediente,connection){
  console.log(id_expediente);
  try {
    const resultado = await connection.execute(
      `
      UPDATE EXPEDIENTE SET id_estado_expediente = 6
      WHERE id_expediente = ${id_expediente}
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}

async function rechazarExpediente(id_expediente,connection){
  try {
    const resultado = await connection.execute(
      `
      UPDATE EXPEDIENTE SET id_estado_expediente = 5
      WHERE id_expediente = ${id_expediente}
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function verCV(id_expediente,connection){
  try {
    const resultado = await connection.execute(
      `
      SELECT b.ubicacion, c.nombre_formato, a.cv, b.nombre_documento, e.cui,e.nombres,e.apellidos, e.id_expediente from expediente a
      INNER JOIN DOCUMENTO b
      ON a.cv = b.id_documento
      INNER JOIN FORMATO c
      ON b.id_formato = c.id_formato
      INNER JOIN DETALLE_DOCUMENTO d
      ON d.id_documento = b.id_documento
      INNER JOIN EXPEDIENTE e
      ON e.id_expediente = d.id_expediente
      WHERE e.id_expediente = ${id_expediente}
      GROUP BY a.cv, b.ubicacion,b.nombre_documento, c.nombre_formato, e.cui,e.nombres,e.apellidos,e.id_expediente
      `
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}







async function filtroNombreUsuarioExpediente(id_revisor,nombre,connection){
  try {
    const resultado = await connection.execute(
      `SELECT c.cui,c.nombres,c.apellidos,h.nombre_puesto, d.nombre_estado_expediente, TO_CHAR(b.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, 
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
      WHERE a.id_usuario = ${id_revisor}
      AND c.cui = '${nombre}'`
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function filtroPuestoExpediente(id_revisor,nombre,connection){
  try {
    const resultado = await connection.execute(
      `SELECT c.cui,c.nombres,c.apellidos,h.nombre_puesto, d.nombre_estado_expediente, TO_CHAR(b.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, 
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
      WHERE a.id_usuario = ${id_revisor}
      AND h.nombre_puesto = '${nombre}'`
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}



async function filtroInicioUsuarioExpediente(id_revisor,fecha,connection){
  try {
    const resultado = await connection.execute(
      `SELECT c.cui,c.nombres,c.apellidos,h.nombre_puesto, d.nombre_estado_expediente, TO_CHAR(b.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, 
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
      WHERE a.id_usuario = ${id_revisor}
      AND TRUNC(fecha_inicio) = TO_DATE('${fecha}','DD/MM/YYYY')`
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}

async function filtroEstadoUsuario(connection,dato){
  let opcion = parseInt(dato, 10);
  try {
    const resultado = await connection.execute(
      `select nombre_usuario as nombre, estado_usuario as estado,
      TO_CHAR(a.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, TO_CHAR(a.fecha_fin, 'DD-MM-YYYY') as fecha_fin,
      nombre_rol as rol,id_usuario, pass_usuario as contraseña, email 
      from USUARIO a
      INNER JOIN ROL b
      ON a.id_rol = b.id_rol
      WHERE estado_usuario = ${dato}`
    );
    connection.commit();
    console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function filtroInicioUsuario(connection,fecha){
  try {
    const resultado = await connection.execute(
      `select nombre_usuario as nombre, estado_usuario as estado,
      TO_CHAR(a.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, TO_CHAR(a.fecha_fin, 'DD-MM-YYYY') as fecha_fin,
      nombre_rol as rol,id_usuario, pass_usuario as contraseña, email 
      from USUARIO a
      INNER JOIN ROL b
      ON a.id_rol = b.id_rol
      WHERE TRUNC(fecha_inicio) = TO_DATE('${fecha}','DD/MM/YYYY')`
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function filtroFinUsuario(connection,fecha){
  try {
    const resultado = await connection.execute(
      `select nombre_usuario as nombre, estado_usuario as estado,
      TO_CHAR(a.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, TO_CHAR(a.fecha_fin, 'DD-MM-YYYY') as fecha_fin,
      nombre_rol as rol,id_usuario, pass_usuario as contraseña, email 
      from USUARIO a
      INNER JOIN ROL b
      ON a.id_rol = b.id_rol
      WHERE TRUNC(fecha_inicio) = TO_DATE('${fecha}','DD/MM/YYYY')`
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function filtroRolUsuario(connection,rol){
  try {
    const resultado = await connection.execute(
      `select nombre_usuario as nombre, estado_usuario as estado,
      TO_CHAR(a.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio, TO_CHAR(a.fecha_fin, 'DD-MM-YYYY') as fecha_fin,
      nombre_rol as rol,id_usuario, pass_usuario as contraseña, email
      from USUARIO a
      INNER JOIN ROL b
      ON a.id_rol = b.id_rol
      WHERE nombre_rol = '${rol}'`
    );
    connection.commit();
    //console.log(resultado.rows);
    return resultado.rows;
  } catch (err) {
    console.error(err);
  } finally {
    
  }  
}


async function asociarUsuario(cui_in,salario_in,departamento_in,puesto_in,connection) {
  try {
      const resultado = await connection.execute(
        `BEGIN
        asociarUsuario(:cui, :salario, :depto, :puesto, :respuesta);
         END;`,
        {  // bind variables
          cui: cui_in,
          salario: parseFloat(salario_in),
          depto: parseInt(departamento_in),
          puesto: parseInt(puesto_in),
          respuesta: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        }
      );
      connection.commit();
      const respuesta = resultado.outBinds;
      console.log(respuesta);
      return respuesta;
    } catch (err) {
      console.error(err);
    } finally {

    }
}


async function enviarEmail(email) {
  // create reusable transporter object using the default SMTP transport
  /*
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'miaproyecto2021@gmail.com',
          pass: 'pRogu&of_Ach8#isW_g?'
      }
    });
    */

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
          user: 'miaproyecto2021@gmail.com',
          pass: 'simplesYno212021'
      }
    });

    let mailOptions = {
      from: 'miaproyecto2021@gmail.com',
      to: email,
      subject: 'Nueva asignacion',
      text: 'Se le espera mañana para la revisión de un nuevo expediente que le fue asignado.'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error){
          console.log(error);
          //res.send(500, err.message);
      } else {
          console.log("Email enviado");
          //res.status(200).jsonp(req.body);
      }
    });
}



async function enviarEmailAsociacion(email) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      //secure: true, // use SSL
      auth: {
          user: 'miaproyecto2021@gmail.com',
          pass: 'simplesYno212021'
      }
    });

    let mailOptions = {
      from: 'miaproyecto2021@gmail.com',
      to: email,
      subject: 'Expediente aceptado',
      text: 'Su expediente ha sido aceptado y se le espera mañana en las oficinas para comenzar.'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error){
          console.log(error);
          //res.send(500, err.message);
      } else {
          console.log("Email enviado");
          //res.status(200).jsonp(req.body);
      }
    });
}



async function enviarEmailRechazo(email) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    //secure: true, // use SSL
    auth: {
        user: 'miaproyecto2021@gmail.com',
        pass: 'simplesYno212021'
    }
  });

  let mailOptions = {
    from: 'miaproyecto2021@gmail.com',
    to: email,
    subject: 'Documentos rechazados',
    text: 'Algunos documentos de su expediente fueron rechazados, por favor corregirlos.'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
        //res.send(500, err.message);
    } else {
        console.log("Email enviado");
        //res.status(200).jsonp(req.body);
    }
  });
}




async function enviarEmailAprobacion(email,usuario,pass) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    //secure: true, // use SSL
    auth: {
        user: 'miaproyecto2021@gmail.com',
        pass: 'simplesYno212021'
    }
  });

  let mailOptions = {
    from: 'miaproyecto2021@gmail.com',
    to: email,
    subject: 'Expediente aprobado',
    text: `Su expediente ha sido aprobado. \n Sus credenciales son: \n
    Nombre de usuario: ${usuario} \n
    Contraseña: ${pass} \n
    Ya puede ingresar a la plataforma para completar su perfil y modificar su expediente.
    `
  };





  transporter.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
        //res.send(500, err.message);
    } else {
        console.log("Email enviado");
        //res.status(200).jsonp(req.body);
    }
  });
}

  module.exports.run = run;
  module.exports.crearRol = crearRol;
  module.exports.crearFormato = crearFormato;
  module.exports.recorrerJson = recorrerJson;
  module.exports.tablasRojas = tablasRojas;
  module.exports.crearDocumento = crearDocumento;
  module.exports.crearExpediente = crearExpediente;
  module.exports.enviarPuestos = enviarPuestos;
  module.exports.enviarRoles = enviarRoles;
  module.exports.crearUsuario = crearUsuario;
  module.exports.enviarDepartamentos = enviarDepartamentos;
  module.exports.enviarEmail = enviarEmail;
  module.exports.enviarUsuarioRevision = enviarUsuarioRevision;
  module.exports.enviarUsuarios = enviarUsuarios;
  module.exports.filtroEstadoUsuario = filtroEstadoUsuario;
  module.exports.filtroFinUsuario = filtroFinUsuario;
  module.exports.filtroInicioUsuario = filtroInicioUsuario;
  module.exports.filtroNombreUsuario = filtroNombreUsuario;
  module.exports.filtroRolUsuario = filtroRolUsuario;
  module.exports.editarUsuario = editarUsuario;
  module.exports.eliminarUsuario = eliminarUsuario;
  module.exports.enviarPlantilla = enviarPlantilla;
  module.exports.getDepartamento = getDepartamento;
  module.exports.asociarUsuario = asociarUsuario;
  module.exports.enviarEmailAsociacion = enviarEmailAsociacion;
  module.exports.enviarExpedientes = enviarExpedientes;
  module.exports.getRevisor = getRevisor;
  module.exports.filtroInicioUsuarioExpediente = filtroInicioUsuarioExpediente;
  module.exports.filtroNombreUsuarioExpediente = filtroNombreUsuarioExpediente;
  module.exports.filtroPuestoExpediente = filtroPuestoExpediente;
  module.exports.aceptarExpediente = aceptarExpediente;
  module.exports.rechazarExpediente = rechazarExpediente;
  module.exports.verCV = verCV;
  module.exports.aprobarExpediente = aprobarExpediente;
  module.exports.getCredenciales = getCredenciales;
  module.exports.enviarEmailAprobacion = enviarEmailAprobacion;
  module.exports.enviarRequisitosAplicante = enviarRequisitosAplicante;
  module.exports.asociarDocumentoRequisito = asociarDocumentoRequisito;
  module.exports.getExpedienteAplicante = getExpedienteAplicante;
  module.exports.editarExpediente = editarExpediente;
  module.exports.enviarRequisitosAplicanteRevision = enviarRequisitosAplicanteRevision;
  module.exports.aceptarDocumento = aceptarDocumento;
  module.exports.rechazarDocumento = rechazarDocumento;
  module.exports.enviarEmailRechazo = enviarEmailRechazo;
  module.exports.rechazarRevisado = rechazarRevisado;
  module.exports.actualizarUbicacion = actualizarUbicacion;
  module.exports.enviarDocumentosCargados = enviarDocumentosCargados;
  module.exports.enviarDocumentosRechazados = enviarDocumentosRechazados;
  module.exports.login = login;
  module.exports.actualizarDocumento = actualizarDocumento;
  module.exports.getDatosCarrusel = getDatosCarrusel;
  module.exports.getCategoriasCarrusel = getCategoriasCarrusel;
