
const express = require('express');
const router = require('./routes/routes');
const fileupload = require("express-fileupload");

const port = 3001;

const app = express();

var cors = require('cors');
var serveIndex = require('serve-index')

app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use('/files', express.static(__dirname + '/files'), serveIndex(__dirname + '/files'));
global.__basedir = __dirname;
app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})




