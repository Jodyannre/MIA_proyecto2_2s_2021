import axios from 'axios';

async function prueba () {
    let URL = 'http://localhost:3001';
    try {
      return axios.get(URL)
      .then((res) => {
        console.log(res)
      })  
    } catch (err) {
      console.error(err.message);
    }
  };


  async function crearFormato () {
    let URL = 'http://localhost:3001/formato';
    try {
      axios.get(URL,{
        params: {
          dato: 'nuevoFormato104'
        }
      })
      .then((res) => {
        console.log(res);
      })  
    } catch (err) {
      console.error(err.message);
    }
  };  

  async function cargarJson (archivoJson) {
    let URL = 'http://localhost:3001/carga';
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
      };
    try {
      axios.get(URL,{
        params: {
          dato: archivoJson
        },
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
      })
      .then((res) => {
        console.log(res);
      })  
    } catch (err) {
      console.error(err.message);
    }
  };  


  async function cargarArchivo (file,fileName) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    try {
        const res = await axios.post(
          "http://localhost:3001/cargarArchivo",
          formData
        );
        console.log(res);
        return res;
      } catch (ex) {
        console.log(ex);
      }
  };  






  async function cargarNuevoExpediente (archivoJson) {
    let URL = 'http://localhost:3001/cargarExpediente';
    try {
      axios.get(URL,{
        params: {
          dato: archivoJson
        },
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
      })
      .then((res) => {
        console.log(res);
        return res;
      })  
    } catch (err) {
      console.error(err.message);
    }
  };



  async function enviarMail () {
    let URL = 'http://localhost:3001/enviarMail';
    try {
      axios.get(URL)
      .then((res) => {
        console.log(res);
      })  
    } catch (err) {
      console.error(err.message);
    }
  };


  async function cargarNuevoUsuario (archivoJson) {
    let URL = 'http://localhost:3001/cargarUsuario';
    try {
      axios.get(URL,{
        params: {
          dato: archivoJson
        },
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
      })
      .then((res) => {
        console.log(res);
      })  
    } catch (err) {
      console.error(err.message);
    }
  };


  async function traerPuestos () {
    let URL = 'http://localhost:3001/enviarPuestos';
    try {
      axios.get(URL,{
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
      })
      .then((res) => {
        //console.log(res);
        return res;
      })  
    } catch (err) {
      console.error(err.message);
    }
  };  


  async function crearDocumento (archivoJson) {
    let URL = 'http://localhost:3001/crearDocumento';
    try {
      axios.get(URL,{
        params: {
          dato: archivoJson
        },
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
      })
      .then((res) => {
        console.log(res);
        return res;
      })  
    } catch (err) {
      console.error(err.message);
    }
  };

 export {prueba};
 export {crearFormato};
 export {cargarJson};
 export {cargarNuevoExpediente};
 export {cargarArchivo};
 export {crearDocumento};
 export {traerPuestos};
 export {cargarNuevoUsuario};
 export {enviarMail};