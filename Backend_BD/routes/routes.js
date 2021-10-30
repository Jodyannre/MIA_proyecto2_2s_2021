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
  let email = await consulta.enviarUsuarioRevision(conexion);
  let enviar = await consulta.enviarEmail(email[0][0]);
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
