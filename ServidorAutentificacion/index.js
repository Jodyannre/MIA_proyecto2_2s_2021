const jwt = require('jsonwebtoken');
const axios = require('axios');
const express = require('express');
const config = require('./config.json');
const tokenList = {}
const router = express.Router();


const port = 3002;

const app = express();
const cors = require('cors');
app.use(cors({origin: '*'}));
app.use(express.json());
//router.use(require('./revisarToken'))

router.post('/login', (req,res) => {
  const dato = req.body;
  console.log('Entro a login');
  const user = {
    name: dato.user,
    password: dato.password
  }
  const token = jwt.sign(user, config.secret, {expiresIn: config.tokenLife});
  const refreshToken = jwt.sign(user, config.refreshTokenSecret, {expiresIn: config.refreshTokenLife})
  const respuesta = {
      "status": "logueado",
      "token": token,
      "refreshToken": refreshToken
  }
  tokenList[refreshToken] = respuesta;
  res.status(200).json(respuesta);
})



router.post('/nuevoToken', (req,res) => {
  console.log('nuevo token');
  // guardar los tokens
  const dato = req.body
  // Si existe el token de refresco y si todavía esta guardado en la lista de tokens
  console.log(tokenList);
  if((dato.refreshToken) && (dato.refreshToken in tokenList)) {
      const user = {
          "name": dato.user,
          "password": dato.password
      }
      const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
      const respuesta = {
          token: token,
          session: true
      }
      // actualizar el token de refresco de la lista
      tokenList[dato.refreshToken].token = token
      console.log(respuesta);
      res.send(respuesta);        
  } else {
      const session = {
        estado:false
      }
      console.log(session);
      res.send(session);
  }
})


router.get('/verificar', (req,res) => {
  // Verificar que el token todavía exista
  res.status(200).json({respuesta: 'ok'})
})



app.use ('/',router);
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`)
})