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
        {  // bind variables
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
    let requisitos = [];
    let requisito;
    let categorias = [];
    let categoria;
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
    let formatos = [];
    let formato;
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
        `select b.email from detalle_revision a
        FULL JOIN USUARIO b
        on a.id_usuario = b.id_usuario
        where a.estado_revision = 0 
        AND b.estado_usuario = 1
        ORDER BY id_detalle_revision DESC
        FETCH FIRST 1 ROWS ONLY`
      );
      connection.commit();
      //console.log(resultado.rows);
      return resultado.rows;
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
      secure: true, // use SSL
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