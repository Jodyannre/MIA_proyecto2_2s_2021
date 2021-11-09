var router = require('express').Router();
const oracledb = require('oracledb');

let consulta = require('../consultas/consulta');

router.get('/', function (req, res, next) {
  res.send('hola mundo');
});

router.get('/consulta', function (req, res, next) {
    consulta.run();
    res.send('Ejecutada');
  });

router.get('/rol', function (req, res, next) {
  consulta.crearRol('nuevoRol');
  res.send('Nuevo rol creado.');
});

router.get('/formato', async function (req, res, next) {
  //console.dir(req.query.dato);
  res.send(await consulta.crearFormato(req.query.dato));
  //res.send(await consulta.crearFormato('caca'));
});


router.get('/cargarExpediente', async function (req, res, next) {
    //console.log(JSON.parse(req.query.dato));
    let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
    await consulta.crearExpediente(JSON.parse(req.query.dato),conexion);
    console.log('Ya se creo el expediente');
    if (conexion) {
      try {
        await conexion.close();
      } catch (err) {
        console.error(err);
      }
    }
    res.send("Recibido");
});



router.get('/cargarUsuario', async function (req, res, next) {
  //console.log(JSON.parse(req.query.dato));
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  await consulta.crearUsuario(JSON.parse(req.query.dato),conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send("Recibido");
});

router.get('/enviarPuestos', async function (req, res, next) {
  //console.log(JSON.parse(req.query.dato));
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado = await consulta.enviarPuestos(conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
  
});



router.get('/editarUsuario', async function (req, res, next) {
  let dato = JSON.parse(req.query.dato);
  console.log(JSON.parse(req.query.dato));
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado = await consulta.editarUsuario(dato,conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});



router.get('/eliminarUsuario', async function (req, res, next) {
  let dato = JSON.parse(req.query.dato);
  console.log(JSON.parse(req.query.dato));
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado = await consulta.eliminarUsuario(dato,conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});


router.get('/enviarUsuarios', async function (req, res, next) {
  console.log(JSON.parse(req.query.dato));
  let opcionFiltro = JSON.parse(req.query.dato).opcionFiltro;
  opcionFiltro = parseInt(opcionFiltro, 10);
  console.log(opcionFiltro);
  let opcionEscrita = JSON.parse(req.query.dato).opcionEscrita;
  console.log(opcionEscrita);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado;
  switch (opcionFiltro){
    case 0:
      resultado = await consulta.enviarUsuarios(conexion,JSON.parse(req.query.dato));
      break;
    case 1:
      resultado = await consulta.filtroNombreUsuario(conexion,opcionEscrita);
      break;
    case 2:
      resultado = await consulta.filtroEstadoUsuario(conexion,opcionEscrita);
      break;
    case 3:
      resultado = await consulta.filtroInicioUsuario(conexion,opcionEscrita); 
      break;
    case 4:
      resultado = await consulta.filtroFinUsuario(conexion,opcionEscrita); 
      break;
    case 5:
      resultado = await consulta.filtroRolUsuario(conexion,opcionEscrita); 
      break;
  }
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
  
});



router.get('/enviarExpedientesRevision', async function (req, res, next) {
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  console.log(JSON.parse(req.query.dato));
  let opcionFiltro = JSON.parse(req.query.dato).opcionFiltro;
  opcionFiltro = parseInt(opcionFiltro, 10);
  console.log(opcionFiltro);
  let opcionEscrita = JSON.parse(req.query.dato).opcionEscrita;
  const nombre_revisor = JSON.parse(req.query.dato).revisor;
  console.log(opcionEscrita);
  const revisor = await consulta.getRevisor(nombre_revisor,conexion); 
  let resultado;
  switch (opcionFiltro){
    case 1:
      resultado = await consulta.filtroNombreUsuarioExpediente(revisor,opcionEscrita,conexion);
      break;
    case 2:
      resultado = await consulta.filtroPuestoExpediente(revisor,opcionEscrita,conexion);
      break;
    case 3:
      resultado = await consulta.filtroInicioUsuarioExpediente(revisor,opcionEscrita,conexion); 
      break;
  }
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
  
});




router.get('/enviarPlantilla', async function (req, res, next) {
  const dato = req.query.dato;
  //let usuario_coordinador = JSON.parse(req.query.dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.getDepartamento(dato, conexion); 
  const segundos = await consulta.enviarPlantilla(resultado.ret, conexion);
  console.log(segundos);
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(segundos);
});



router.get('/enviarRequisitosAplicanteRevision', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log('Cui de requisitos entrante:');
  console.log(dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.enviarRequisitosAplicanteRevision(dato, conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});



router.get('/enviarExpedientes', async function (req, res, next) {
  const dato = req.query.dato;
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.getRevisor(dato,conexion); 
  //console.log(resultado);
  const segundos = await consulta.enviarExpedientes(resultado, conexion);
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(segundos);
});



router.get('/download', async function (req, res, next) {
  const nombre = req.query.dato;
  const ubicacion = `${global.__basedir}/files/${nombre}`;
  const url = 'http://localhost:3001/files/'+nombre;
  console.log(ubicacion);
  console.log(nombre);
  res.send("descargado");
});



router.get('/aceptarExpediente', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log(dato.id);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.aceptarExpediente(parseInt(dato.id, 10),conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});




router.get('/aceptarDocumento', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log(dato.id);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.aceptarDocumento(parseInt(dato.id, 10),conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});


router.get('/rechazarDocumento', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log('Dato entrante');
  console.log(dato.motivo);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.rechazarDocumento(parseInt(dato.id, 10), dato.motivo,conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});


router.get('/aprobarExpediente', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log(dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const lasCredenciales = await consulta.getCredenciales(dato.usuario,conexion); 
  console.log(lasCredenciales);
  const credenciales = {
    usuario: lasCredenciales[0][0],
    password: lasCredenciales[0][1]
  }
  const resultado = await consulta.aprobarExpediente(parseInt(dato.expediente, 10),conexion); 
  const correo = await consulta.enviarEmailAprobacion(dato.email,credenciales.usuario,credenciales.password);
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});

router.get('/login', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log(dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const lasCredenciales = await consulta.login(dato.usuario,dato.password,conexion); 
  console.log("Credenciales");
  console.log(lasCredenciales);
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  if (lasCredenciales.length === 0){
    res.send(['no']);
  }else{
    res.send(lasCredenciales[0]);
  }
});


router.get('/enviarEmailRechazo', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log(dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.enviarEmailRechazo(dato.email,conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});


router.get('/rechazarExpediente', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.rechazarExpediente(parseInt(dato.id, 10),conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});


router.get('/verCV', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.verCV(parseInt(dato.id, 10),conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  console.log(resultado);
  res.send(resultado);
});



router.get('/asociarUsuario', async function (req, res, next) {
  console.log(JSON.parse(req.query.dato));
  const dato = JSON.parse(req.query.dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.asociarUsuario(dato.cui,dato.salario,dato.departamento,dato.puesto,conexion); 
  if (resultado.respuesta === 1){
    const enviado = await consulta.enviarEmailAsociacion(dato.email);
  }
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send('Usuario asociado.');
});


router.get('/enviarRoles', async function (req, res, next) {
  //console.log(JSON.parse(req.query.dato));
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado = await consulta.enviarRoles(conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});




router.get('/enviarDocumentosCargados', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log(dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado = await consulta.enviarDocumentosCargados(dato.cui,conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});


router.get('/enviarDocumentosRechazados', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log(dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado = await consulta.enviarDocumentosRechazados(dato.cui,conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});



router.get('/actualizarUbicacion', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log(dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado = await consulta.actualizarUbicacion(dato.documento,dato.ubicacion,conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});


router.get('/actualizarDocumento', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log(dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado = await consulta.actualizarDocumento(dato.id,dato.nombre,dato.ubicacion,dato.formato,dato.estado,conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});


router.get('/rechazarRevisado', async function (req, res, next) {
  const dato = JSON.parse(req.query.dato);
  console.log(dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado = await consulta.rechazarRevisado(dato.cui,conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});



router.get('/enviarDepartamentos', async function (req, res, next) {
  //console.log(JSON.parse(req.query.dato));
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  let resultado = await consulta.enviarDepartamentos(conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});



router.get('/enviarMail', async function (req, res, next) {
  //console.log(JSON.parse(req.query.dato));
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const email = await consulta.enviarUsuarioRevision(conexion);
  console.log(email);
  const enviar = await consulta.enviarEmail(email[0][2]);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  //console.log(resultado[0][0]);
  res.send('Correo enviado.');
});

router.get('/crearDocumento', async function (req, res, next) {
  //console.log(JSON.parse(req.query.dato));
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  /*
  let prueba = {
    nombre: 'doc1',
    ubicacion:'suUbicacion',
    formato:'txt',
    estado:1,
  }
  */
  await consulta.crearDocumento(JSON.parse(req.query.dato),conexion);
  if (conexion) {
    try {
      await conexion.close();
    } catch (err) {
      console.error(err);
    }
  }
  res.send("Documento creado.");
});

router.post('/cargarArchivo', async function (req, res, next) {
  const newpath = __basedir + "\\files\\";
  const file = req.files.file;
  const filename = file.name;
  //console.log(file);
  //console.log(filename);
  console.log(newpath);
  //console.log(__basedir);
  
  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }else{
    res.status(200).send({ message: "File Uploaded", code: 200 });
    }
  });

});



router.post('/retornarArchivo', async function (req, res, next) {
  const fs = require('fs');
  const newpath = __basedir + "\\files\\";
  const filename = req.body.ubicacion;
  const path = `${newpath}${filename}`;
  console.log(path);
  try {
    fs.readFile(path, function(err, data) {
      if (err) throw err; // Fail if the file can't be read.
        res.setHeader('Content-Type', 'application/pdf');
        res.send(data); // Send the file data to the browser.
    });
    //console.log(data)
    //res.send(data);
  } catch (err) {
    console.error(err)
  }
});



router.get('/enviarRequisitosAplicante', async function (req, res, next) {
  const nombre = req.query.nombre;
  console.log(nombre);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.enviarRequisitosAplicante(nombre,conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});




router.get('/asociarDocumentoRequisito', async function (req, res, next) {
  const documento = JSON.parse(req.query.dato);
  console.log(documento);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.asociarDocumentoRequisito(documento.cui,documento.ubicacion,
    documento.requisito,documento.puesto,conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send("Asociado con éxito");
});


router.get('/getExpedienteAplicante', async function (req, res, next) {
  const documento = JSON.parse(req.query.dato);
  console.log(req.query.dato);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.getExpedienteAplicante(documento,conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});


router.get('/getDatosCarrusel', async function (req, res, next) {
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.getDatosCarrusel(conexion); 
  console.log(resultado);
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});



router.get('/getCategoriasCarrusel', async function (req, res, next) {
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.getCategoriasCarrusel(conexion); 
  console.log(resultado);
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send(resultado);
});


router.get('/editarExpedienteAplicante', async function (req, res, next) {
  const expediente = JSON.parse(req.query.dato);
  console.log(expediente);
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  const resultado = await consulta.editarExpediente(expediente,conexion); 
  if (conexion) {
    try {
      const tercera = setTimeout(() => {
        conexion.close();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
  res.send("resultado");
});




router.get('/carga', async function (req, res, next) {
  let jsonArchivo = JSON.parse(req.query.dato);
  let resultado = [];
  let conexion = await oracledb.getConnection({ user: "JODDIE", password: "6lQUc34RO-av&qlk_H#g", connectionString: "proyecto2_medium" });
  //console.log(jsonArchivo);
  Object.entries(jsonArchivo).map(([key,value]) => {
    //console.log(key);
    //console.dir(value);
    //console.dir('Despues---------');
    //console.log(value.departamento);
    resultado.push(consulta.recorrerJson(value,'',conexion));
  });

  Object.entries(jsonArchivo).map(([key,value]) => {
    //console.log(key);
    //console.dir(value);
    console.dir('LuegoDespues---------');
    //console.log(value.departamento);
    resultado.push(consulta.tablasRojas(value,'',conexion));
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
  res.send(resultado);
});


module.exports = router;
