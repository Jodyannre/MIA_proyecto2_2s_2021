import React,{ useState, useEffect } from "react";
import '../App.css';
import ReactJson from 'react-json-view'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';


const consulta = require('../consultas/consulta');

function CargaMasiva() {
    const [archivo, setArchivo] = useState(null);
    const [jsonArchivo, setJsonArchivo] = useState(null);
    const [cargar, setCargar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose  = async (event) => {
      setShow(false);       
    };
  
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
          setShow(true);
        });
        console.log('Cargado');
      }
      if (jsonArchivo && cargar){
        //console.log(jsonArchivo.departamentos);
        let resultado = [];
        //console.log(JSON.stringify(jsonArchivo, null, 4));
        //Aqui hay que hacer lo de la base de datos de agregar y todo eso
        //Voy a recorrer el json con un método recursivo para ir agregando los datos
        consulta.cargarJson(jsonArchivo);
      }
      if (archivo && !cargar){
        //Mostrar previsualización de la data
        //convertir a json y luego mostrar como json
        const xml2js = require('xml2js');
        xml2js.parseString(archivo, (err, result) => {
          if(err) {
              throw err;
          }
          setPreview(result);
        });

      }
    },[archivo,jsonArchivo,cargar]);
    
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
    if (preview && !cargar){
      return (
        <div>
        <button onClick={()=>{ventana()}}>Seleccionar archivo </button>
        <button onClick={()=>{setCargar(true)}}>Cargar información </button>
        <br />

        <div>             
              <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                  <Modal.Title>Previsualización</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <ReactJson src={preview} />
                  </div>
                </Modal.Body>
                <Modal.Footer>

                  <Button variant="secondary" value={0} onClick={(e)=>{handleClose(e)}} >
                    Aceptar
                  </Button>
                </Modal.Footer>
              </Modal>            
            </div>
      </div>
      );
    }
    else{
      return (
        <div>
        <button onClick={()=>{ventana()}}>Seleccionar archivo </button>
        <button onClick={()=>{setCargar(true)}}>Cargar información </button>
        <br />
      </div>
      );
    }

    }
  
export default CargaMasiva;