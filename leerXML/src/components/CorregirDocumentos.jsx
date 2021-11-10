import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { saveAs } from "file-saver";
import '../App.css';
import { useHistory } from 'react-router-dom';


//mport download from 'js-file-download';
const consulta = require('../consultas/consulta');




function CorregirDocumentos() {
    const [show,setShow] = useState(false);
    const location = useLocation();
    const [cui,setCui] = useState('');
    const [requisitos, setRequisitos] = useState(null);
    const [id_documento, setId_documento] = useState(null);
    const [id_formato, setId_formato] = useState(null);
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
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


    const handleVer = (dato) =>{
      console.log('ver seleccionado')
      history.push({
          pathname: '/verDoc',
          search: '?query=abc',
          state: { ubicacion: dato[10], formato:dato[6], expediente: (JSON.parse(sessionStorage.getItem('usuario'))).nombre, rol:4}
      });
      
    }

    const handleHistorial = (dato) =>{
      console.log('ver seleccionado')
      console.log(dato[1]);
      history.push({
          pathname: '/verHistorial',
          search: '?query=abc',
          state: { id_documento: dato[1], expediente: (JSON.parse(sessionStorage.getItem('usuario'))).nombre, rol:4}
      });
      
    }


  async function handleDescargar (dato) {
      let URL = 'http://localhost:3001/files/'+dato[10];
      saveAs(
          URL,
          dato[10]
        );
      };

    const cambioDocumento = async e => {
      setDocumentoSeleccionado(e.target.files[0]);   
    }

    async function regresar(){
      history.push('/inicioAplicante');
    }
 

    const handleShow = (dato) =>{
        setShow(true);
        console.log('En handleShow',dato);
        setId_documento(dato[1]);
        setId_formato(dato[9]);
        setCui(dato[5]);
    };


    const handleClose  = async (event) => {
        setShow(false);
        console.log('formato: ',id_formato);
        console.log(event.target.value)
        if (event.target.value === '0'){
          //Cancelar

        }else if (event.target.value === '1'){
          //Cargar el nuevo documento
          //id_documento del documento a cambiar
          //documentoSeleccionado el documento a subir
          let nombreDoc = '';
          let tipoArchivo = documentoSeleccionado.name.split('.').pop();
          let nombreArchivo = documentoSeleccionado.name.split('.')[0];
          let nuevoNombre = cui+"_"+nombreArchivo+"."+tipoArchivo;
          nombreDoc = nuevoNombre;
          let renamedFile = new File([documentoSeleccionado], nuevoNombre);
          console.log(renamedFile);
          await consulta.cargarArchivo(renamedFile,nuevoNombre);

          //Reasignar el documento
          let documento = {
            nombre:nombreArchivo,
            ubicacion: nuevoNombre,
            formato: id_formato,
            estado: 3,
            id: id_documento
          }

          await consulta.actualizarDocumento(JSON.stringify(documento));
          setRequisitos(null);
        }
  
    };



    async function getRequisitosAplicante () {
      let URL = 'http://localhost:3001/enviarDocumentosRechazados';
      const dato = {
        cui: (JSON.parse(sessionStorage.getItem('usuario'))).nombre
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
          console.log(res.data);
          setRequisitos(res.data);
        })  
      } catch (err) {
        console.error(err.message);
      }
    };


    useEffect( async() => { 
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
      if (4 === usuario.rol){
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
      if (requisitos === null){
        await getRequisitosAplicante();
      }else if (requisitos){

      }
    }
  }catch(error){
    history.push('/login');
  }      
    }, [requisitos,tokenRespuesta,tokenValidado,permisoValidado]);

      if (requisitos===null){
        return (
        <div className="container">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        );
      }   
      else if (requisitos) {
        return (
          <div className="container">
            <div className="row">
                <div class="row justify-content-md-center"> 
                    <Button variant="primary" value={4} onClick={() =>{regresar()}}>
                        Regresar
                    </Button>
                </div>
            </div>

            <div class="row justify-content-md-center"> 
                
            </div>

            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Requisito</th>
                    <th>Documento</th>
                    <th>Estado de revisión</th>
                    <th>Cargar</th>
                    <th>Visualizar</th>
                    <th>Descargar</th>
                    <th>Historial</th>
                  </tr>
                </thead>
                { requisitos.map(dato=>{
                            return(                             
                                <tbody>
                                  <td>{dato[7]}</td>
                                  <td>{dato[8]}.{dato[6]}</td>
                                  <td>{dato[4]}</td>
                                  <td>
                                  <Button variant="primary" value={1} onClick={(e)=>{handleShow(dato)}} >
                                      Corregir
                                  </Button>
                                  </td>
                                  <td>
                                  <Button variant="primary" value={1} onClick={(e)=>{handleVer(dato)}} >
                                      Ver
                                  </Button>
                                  </td>
                                  <td>
                                  <Button variant="primary" value={1} onClick={(e)=>{handleDescargar(dato)}} >
                                      Descargar
                                  </Button>
                                  </td>         
                                  <td>
                                  <Button variant="primary" value={1} onClick={(e)=>{handleHistorial(dato)}} >
                                      Ver
                                  </Button>
                                  </td>                                                               
                                </tbody>
                            )
                        })
                    }
              </Table>

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Cargar documento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <Row className="mb-3">
                      <Form.Group controlId="formFileSm" className="mb-3">
                          <Form.Label></Form.Label>
                          <Form.Control 
                          required
                          type="file" 
                          size="sm"
                          onChange = {cambioDocumento}
                          />
                      </Form.Group>
                    </Row>     
                  </div>                       
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" value={1} onClick={(e)=>{handleClose(e)}} >
                    Cargar
                  </Button>
                  <Button variant="secondary" value={0} onClick={(e)=>{handleClose(e)}} >
                    Cancelar
                  </Button>
                </Modal.Footer>
              </Modal>
          
            </div>

        </div>
      );
      }
}

export default CorregirDocumentos;