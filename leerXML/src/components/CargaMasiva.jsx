import React,{ useState, useEffect } from "react";
import '../App.css';
import ReactJson from 'react-json-view'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


const consulta = require('../consultas/consulta');

function CargaMasiva() {
    const [archivo, setArchivo] = useState(null);
    const [jsonArchivo, setJsonArchivo] = useState(null);
    const [cargar, setCargar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [show, setShow] = useState(false);
    const cookies = document.cookie;
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    const tokens = JSON.parse(sessionStorage.getItem('tokens'));
    const [permisoValidado, setPermisoValidado] = useState(null);
    const [tokenValidado, setTokenValidado] = useState(null);
    const [tokenRespuesta, setTokenRespuesta] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const history = useHistory();


    const verCookies = () =>{
      if (cookies != ''){
        //Existe mas de alguno
        let tmp = cookies.split(';');
        console.log('longitud ',tmp.length);
        console.log(tmp);
        if (tmp.length === 1){
          //Solo existe el de refresco
          setRefreshToken(tmp[0].replace('refresh=',''));
          setToken('');
        }else{
          setRefreshToken(tmp[1].replace('refresh=',''));
          setToken(tmp[0].replace('token=',''));          
        }
      }else{
        //No existe ninguno
        setRefreshToken('');
        setToken('');
      }
    }

    async function crearToken(){
      let URL = 'http://localhost:3002/nuevoToken';
      const user = {
          user: usuario.nombre,
          password: usuario.contraseña,
          refreshToken: tokens.refresh
      }
      try {
        axios.post(URL,{
          user: usuario.nombre,
          password: usuario.contraseña,
          refreshToken: tokens.refresh
          }
        )
        .then((res) => {
            console.log('Autenticacion');
            console.log(res);
            setTokenRespuesta(res.data);
        })  
      } catch (err) {
        console.error(err.message);
      }

    }

    const regresar = () =>{
      history.push('/administracion');
    }

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
          reader.readAsText(e.target.files[0],'UTF-8');
        });
      });
    }
    
    //Convertir a JSON
    useEffect(() => {
  try{
      //--------------------AUTH---------------------------------------------
      if (token===null || refreshToken ===null){
        verCookies();
      }
      if (tokenRespuesta){
        
        if (document.cookie != ''){
          document.cookie = `token=${tokenRespuesta.token}; max-age=${global.tokenLife}; path=/; samesite=strict;`;
          //actualizar localstorage
          tokens.token = tokenRespuesta.token;
          sessionStorage.setItem('tokens',JSON.stringify(tokens));
          setTokenValidado(true);
        }else{
          //setTokenValidado(false);
          //Sesión no válida
          sessionStorage.removeItem('usuario');
          sessionStorage.removeItem('tokens');
          history.push('/login');
        }

      }
      //Validaro tokens
      if (token==='' && tokenRespuesta===null){
        //El token expiro pedir otro
        if (refreshToken!=''){
            crearToken();
        }else{
          //La sesión ya no es válida
          sessionStorage.removeItem('usuario');
          sessionStorage.removeItem('tokens');
          history.push('/login');
        }
      }else{
        setTokenValidado(true);
      }
      if (permisoValidado===null){
        if (1 === usuario.rol){
          setPermisoValidado(true);
          console.log('Tiene permiso.');
        }else{
          setPermisoValidado(false);
          //No permitido
          sessionStorage.removeItem('usuario');
          sessionStorage.removeItem('tokens');
          history.push('/login');
        }
      }
      //-----------------------------------------------------------------
      if (tokenValidado && permisoValidado){
        //Hacer todo lo de la página


        if (archivo && (jsonArchivo === null || jsonArchivo === undefined)){
          //Convertir a json y actualizar const json
          //Ver el encoding
  
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
            //console.log(archivo);
          });
  
        }
      }
  }catch(error){
    history.push('/login');
  }
   
    },[archivo,jsonArchivo,cargar,tokenRespuesta,tokenValidado,permisoValidado]);
    
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
        <button onClick={()=>{regresar()}}>Regresar </button>
        <br />
      </div>
      );
    }

    }
  
export default CargaMasiva;