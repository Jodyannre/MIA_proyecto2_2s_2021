import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import '../App.css';
import { useHistory } from 'react-router-dom';
import { ValidarToken, ValidarPermiso } from "./Funciones";
import { ThemeProvider } from "react-bootstrap";
const consulta = require('../consultas/consulta');


function InicioAplicante() {
    const [expediente, setExpediente] = useState(null);
    const [edicion, setEdicion] = useState(false);
    const [botonDocumentos, setBotonDocumentos] = useState(true);
    const [corregirDocumentos, setCorregirDocumentos] = useState(0);
    const [documentosCargados, setDocumentosCargados] = useState(null);
    const [documentosRechazados, setDocumentosRechazados] = useState(null);
    const cookies = document.cookie;
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    const [permisoValidado, setPermisoValidado] = useState(null);
    const [tokenValidado, setTokenValidado] = useState(null);
    const [tokenRespuesta, setTokenRespuesta] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    //Si hay cargados y hay rechazados activar la edición
    //Si hay cargados y no rechazados desactivar la edición y la carga
    //Si los 2 viene vacios activar todo
    const history = useHistory();


    async function regresar(){
      localStorage.removeItem('usuario');
      localStorage.removeItem('tokens');
      history.push('/login');
    }

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

  //Validador de 3 onClick={true ? handleClick : null}
    const handleEdicion = async () => {
      //console.log('resultado')
      //console.log(documentosCargados);
      //console.log(documentosRechazados);
      if (documentosCargados && documentosRechazados){
        if (expediente[0][8]+1 === 2 
            || expediente[0][8] === 3
            || expediente[0][8] === 6){
                //console.log('El expediente se puede revisar');
                setEdicion(true);
            }
        if (documentosRechazados.length > 0){
          //Quiere decir que hay que corregir los documentos
          setCorregirDocumentos(1);
          setBotonDocumentos(true);
        }else if (documentosCargados.length > 0){
          //Quiere decir que no hay documentos rechazas y no se puede editar eso
          setBotonDocumentos(false);
        }else{
          //Ambas son 0 y entonces se activa la función de subir todos los documentos
          setCorregirDocumentos(0);
          setBotonDocumentos(true);
        }
      }
    }

    const handleClick = e => {
        //Manejar los botones
        //e.target.value)
        //console.log(e.target.value);
        if (e.target.value === '1'){
            //Revisar expediente
            if (edicion){
              history.push({
                pathname: '/editarExpedienteAplicante',
                search: '?query=abc',
                state: { corregir:edicion}    
              });
            }else{
              history.push({
                pathname: '/editarExpedienteAplicante',
                search: '?query=abc',
                state: { corregir:edicion}    
              });              
            }

        }else if (e.target.value === '2'){
            //Cargar documentos
            //console.log('Opciones de correction');
            //console.log(corregirDocumentos);
            if (corregirDocumentos === 0){
              history.push({
                pathname: '/requisitosAplicante',
                search: '?query=abc',
                state: { corregir:corregirDocumentos}    
              });
            }else if (corregirDocumentos ===1){
              history.push({
                pathname: '/corregirDocumentos',
                search: '?query=abc',
                state: { corregir:corregirDocumentos, expediente: expediente[0][1]+''}    
              });
            }

        }


    };


    async function getDocumentosCargados () {
      let URL = 'http://localhost:3001/enviarDocumentosCargados';
      const dato = {
        cui: (JSON.parse(localStorage.getItem('usuario'))).nombre
      }
      try {
        axios.get(URL,{
          params: {
            dato: dato
          },
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*",
          }
        })
        .then((res) => {
          setDocumentosCargados(res.data);
        })  
      } catch (err) {
        console.error(err.message);
      }
    };   
    
    
    async function getDocumentosRechazados () {
      let URL = 'http://localhost:3001/enviarDocumentosRechazados';
      const dato = {
        cui: (JSON.parse(localStorage.getItem('usuario'))).nombre
      }
      try {
        axios.get(URL,{
          params: {
            dato: dato
          },
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*",
          }
        })
        .then((res) => {
          setDocumentosRechazados(res.data);
        })  
      } catch (err) {
        console.error(err.message);
      }
    }; 


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



    useEffect( async() => {  
      try{
        verCookies();
        if (tokenRespuesta){
          
          if (document.cookie != ''){
            document.cookie = `token=${tokenRespuesta.token}; max-age=${10}; path=/; samesite=strict;`;
            //actualizar localstorage
            tokens.token = tokenRespuesta.token;
            localStorage.setItem('tokens',JSON.stringify(tokens));
            setTokenValidado(true);
          }else{
            //setTokenValidado(false);
            //Sesión no válida
            localStorage.removeItem('usuario');
            localStorage.removeItem('tokens');
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
            localStorage.removeItem('usuario');
            localStorage.removeItem('tokens');
            history.push('/login');
          }
        }else{
          setTokenValidado(true);
        }




        if (permisoValidado===null){
          if (4 === usuario.rol){
            setPermisoValidado(true);
            console.log('Tiene permiso.');
          }else{
            setPermisoValidado(false);
            //No permitido
            localStorage.removeItem('usuario');
            localStorage.removeItem('tokens');
            history.push('/login');
          }
        }

        async function getExpedienteAplicante () {
            let URL = 'http://localhost:3001/getExpedienteAplicante';
            try {
              axios.get(URL,{
                params: {
                  dato: (JSON.parse(localStorage.getItem('usuario'))).nombre
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
              })
              .then((res) => {
                setExpediente(res.data);
              })  
            } catch (err) {
              console.error(err.message);
            }
          };
          console.log('validadores')
          console.log(tokenValidado);
          console.log(permisoValidado);
          if (tokenValidado && permisoValidado){
            
            if (expediente === null && documentosCargados === null && documentosRechazados === null){
              await getExpedienteAplicante();
              await getDocumentosCargados()
              await getDocumentosRechazados();
            }else if (expediente, documentosRechazados, documentosCargados){
              //console.log(expediente);
              handleEdicion();
            }
          }
      }catch (error){
        console.log(error);
        history.push('/login');
      }
          
      }, [expediente,documentosCargados,documentosRechazados,tokenRespuesta,tokenValidado,permisoValidado]);
    
    if (expediente === null){
        return (
            <div className="container">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            );
    }else
    {
        return (
            <div className="container">
            <Row className="mb-3">
            <Col md>
            <Button
                variant="primary"
                value = {1}
                disabled={false}
                onClick={handleClick}
                >
                Revisar o corregir expediente
            </Button>
            </Col>
            <Col md>
            <Button
                variant="primary"
                value = {2}
                disabled={!botonDocumentos}
                onClick={handleClick}
                >
                Cargar o corregir archivos
            </Button>
            </Col>
            <Col md>
            <Button onClick={regresar}>Salir</Button>
            </Col>
            </Row>
            </div>
        ); 
    }
}


export default InicioAplicante;