const jwt = require('jsonwebtoken')
const config = require('./config')

module.exports = (req,res,next) => {
  const token = req.body.token || req.query.token || req.headers['authentication'];
  const estado = req.body.estado;
  if (estado === 'login'){
    console.log('next');
    next();
  }else{
    console.log('Aqui no debería de estar');
    // decodificar token
    if (token) {
      // Verificar los secretos de los tokens
      jwt.verify(token, config.secret, function(err, decoded) {
          if (err) {
              return res.status(401).json({error: true, mensaje: 'Acceso no autorizado.' });
          }
        req.decoded = decoded;
        next();
      });
    } else {
      // Si no hay ningún token devuelve un error
      return res.status(403).json({respuesta: 'no'});
    }    
  }

}