import React,{ useState, useEffect } from "react";
import '../App.css';
const consulta = require('../consultas/consulta');

function CargaMasiva() {
    const [archivo, setArchivo] = useState(null);
    const [jsonArchivo, setJsonArchivo] = useState(null);
  
     async function pick() {
      var filepicker = document.createElement("input");
      filepicker.setAttribute("type","file");
      filepicker.click();
      return new Promise((resolve,reject) => {
        filepicker.addEventListener("change", e => {
          var reader = new FileReader();
          reader.addEventListener('load', file => resolve(file.target.result));
          reader.readAsText(e.target.files[0],'ISO-8859-1');
        });
      });
    }
    
    //Convertir a JSON
    useEffect(() => {
      if (archivo && (jsonArchivo === null || jsonArchivo === undefined)){
        //Convertir a json y actualizar const json
        const xml2js = require('xml2js');
        xml2js.parseString(archivo, (err, result) => {
          if(err) {
              throw err;
          }
          setJsonArchivo(result);
        });
        console.log('probando');
      }
      if (jsonArchivo){
        //console.log(jsonArchivo.departamentos);
        let resultado = [];
        //console.log(JSON.stringify(jsonArchivo, null, 4));
        //Aqui hay que hacer lo de la base de datos de agregar y todo eso
        //Voy a recorrer el json con un método recursivo para ir agregando los datos
        consulta.cargarJson(jsonArchivo);
      }
    },[archivo,jsonArchivo]);
    
    const ventana = () => (
      window.onclick = async function() {
        setArchivo(await pick());
      }
    )
    /*
    if (archivo){
      console.log(archivo);
    }
    */
      return (
        <div>
        <button onClick={ventana}>Seleccionar archivo </button>
        <br />
      </div>
      );
    }
  
export default CargaMasiva;