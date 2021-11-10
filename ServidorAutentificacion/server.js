const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const router = require('./routes/index');
const { auth } = require('express-openid-connect');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

dotenv.load();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const config = {
  authRequired: true,
  auth0Logout: false,
  idpLogout: false
};

const port = process.env.PORT || 3000;

if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}



//app.use(auth(config));
app.use(
  auth({
    authorizationParams: {
      response_type: 'code',
      audience: 'http://localhost:3000/',
      scope: 'openid profile email offline_access read:login',
      prompt: 'consent'
    },
    baseURL :`http://localhost:3000/`,
    clientSecret: 'bxPtbrjV8mtIeewMofuc5vxTNJcq4iP9R6gzpTnW0woL0g89u4EuhHPipxtQhn_K',
    issuerBaseURL: 'https://joddie.us.auth0.com',
    clientID: 'LGqojFo5EIQbt67uBeFVsk33ZObnp3gP',
    idpLogout: false,
    authRequired: false,
    auth0Logout: true
  })
);

// Middleware to make the `user` object available for all views
app.use('/',async function (req, res, next) {
  res.locals.user = req.oidc.user;
  if(req.oidc.accessToken){ //token de refresco
    let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;
 
    //console.log(isExpired())
    console.log("*********************")
    //console.log(token_type, access_token,refresh());
    console.log(isExpired())
    if (isExpired()) { //cuando el token expira se redirecciona al login y genera un nuevo token
      /*({ access_token } = await refresh());
      const products = await req.get(`http://localhost:3000/logout`, {
        headers: {
          Authorization: `${token_type} ${access_token}`
        },
        json: true,
      });
      return res.send(`login: ${products}`)*/
      
     /* res.locals.isAuthenticated = req.oidc.isAuthenticated();
      console.log("¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡");
      console.log(res.locals)*/
  
      /*const userInfo = await req.oidc.fetchUserInfo();
      console.log("¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿");
      console.log(userInfo)
      res.json(userInfo);*/
      return res.redirect('http://localhost:3000/logout');
    }
  }//else{
    //console.log("¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿");
    //yreturn res.redirect('http://localhost:3000/logout')
  //}
  next();
});

app.use('/', router);
/*app.get('/', async (req, res) => {
  console.log(req.oidc)
  let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;
  if (isExpired()) {
    ({ access_token } = await refresh());
  }
  const products = await request.get(`http://localhost:${port}`, {
    headers: {
      Authorization: `${token_type} ${access_token}`,
    },
    json: true,
  });
  res.send(products);
});*/



// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});


/*console.log(jwtCheck)

app.use(jwtCheck);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});*/

//jers.033@gmail.com ... pass: Reservas12
//Jers_033@hotmail.com ... pass: 5uQeza@oprogeDr-brlF


/*var options = {
  method: 'POST',
  url: 'https://joddie.us.auth0.com',
  headers: {'content-type': 'application/x-www-form-urlencoded'},
  data: {
    grant_type: 'Reservas12',
    username: 'jers.033@gmail.com',
    password: 'Reservas12',
    audience: 'http://localhost:3000/',
    scope: 'read:sample',
    client_id: 'LGqojFo5EIQbt67uBeFVsk33ZObnp3gP',
    client_secret: 'bxPtbrjV8mtIeewMofuc5vxTNJcq4iP9R6gzpTnW0woL0g89u4EuhHPipxtQhn_K'
  }
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});*/


http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
  });
