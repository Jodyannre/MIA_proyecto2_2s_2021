import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import '../App.css';
import { useHistory } from 'react-router-dom';
import { InputGroup } from "react-bootstrap";
import { saveAs } from "file-saver";

//mport download from 'js-file-download';
const consulta = require('../consultas/consulta');
const download = require("downloadjs");



function RevisionRequisitos() {
    const [usuarios, setUsuarios] = useState(true);
    const [show,setShow] = useState(false);
    const [showMotivo,setShowMotivo] = useState(false);
    const [expediente, setExpediente] = useState(null);
    const [edicion, setEdicion] = useState(false);
    const [seleccion, setSeleccion] = useState(null);
    const location = useLocation();
    const [validated, setValidated] = useState(false);
    const [nombre,setNombre] = useState('');
    const [apellido,setApellido] = useState('');
    const [direccion,setDireccion] = useState('');
    const [email,setEmail] = useState('');
    const [telefono,setTelefono] = useState('');
    const [cui,setCui] = useState('');
    const [requisitos, setRequisitos] = useState(null);
    const [motivo, setMotivo] = useState(null);
    const [id_documento, setId_documento] = useState(null);
    const [rechazados, setRechazados] = useState(false);
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



    async function regresar(){
      if (rechazados){
        //Enviar correo
        await enviarCorreoRechazo();
      }
      history.push('/acexpediente');
  }

    const handleEdicion = async () => {
        if (expediente[0][8]+1 === 2 
            || expediente[0][8] === 3
            || expediente[0][8] === 6){
                console.log('El expediente se puede revisar');
                setEdicion(true);
            }
    }

    const guardarElemento = (dato) => {
        //const archivo = e.target.files[0];
        const archivo = {
            id: dato,
            nombre: dato,
            ubicacion: dato,
            requisito: dato,
            estado: dato,
            formato: dato
        }
        setRequisitos([...requisitos, archivo])
    }


    async function enviarCorreoRechazo () {
      let documento = {
        cui: cui,
        email: email
      }
      let URL = 'http://localhost:3001/enviarEmailRechazo';
      try {
        return axios.get(URL,{
          params: {
            dato: documento
          },
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*",
          }
        })
        .then((res) => {
          console.log('se elimino.')
          //setUsuarios(res);
          console.log(res);
        })  
      } catch (err) {
        console.error(err.message);
      }
    };

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }else{
            const datos = {
                cui: cui,
                nombre: nombre,
                apellido: apellido,
                email: email,
                direccion: direccion,
                telefono: telefono
            }
            await consulta.edicionExpediente(JSON.stringify(datos));
            setValidated(true);
            setExpediente(null);
        }  
      };


    const handleShow = (dato) =>{
        setShow(true);
        setSeleccion(dato[0]);
        setId_documento(dato[0]);
    }

    const handleVer = (ubicacion,formato) =>{
        global.documentoVer = ubicacion
        console.log('ver seleccionado')
        console.log(ubicacion);
        setExpediente(null);
        setRequisitos(null);
        history.push({
            pathname: '/verDoc',
            search: '?query=abc',
            state: { ubicacion: ubicacion, formato:formato, expediente: location.state.expediente, rol:3}
        });
    }


    async function handleDescargar (ubicacion) {
        let URL = 'http://localhost:3001/files/'+ubicacion;
        saveAs(
            URL,
            ubicacion
          );
        };

    const handleClose  = async (event,documento) => {
        setShow(false);
        if (event.target.value === '0'){
            //Cancelar
            console.log(documento);
        }else if (event.target.value === '1'){
            //Aceptar
            await aceptarDocumento();
            setExpediente(null);
            setRequisitos(null);
            console.log("cargando datos...");
            await getExpedienteAplicante();
            await getRequisitosAplicante();
        }else if (event.target.value === '2'){
            //Rechazar
            setShowMotivo(true);          
        }
        
      };


      const handleCloseMotivo  = async (event) => {
        setShowMotivo(false);
        if (event.target.value === '0'){
          //Cancelar
          setMotivo(null);
        }
        else if (event.target.value === '1'){  
          //Rechazar
          setRechazados(true);
          await rechazarDocumento();
          //Crear el motivo en la bd
          await crearMotivo();
          setExpediente(null);
          setRequisitos(null);     
          setMotivo(null);       
          console.log("cargando datos...");
          await getExpedienteAplicante();
          await getRequisitosAplicante();
          
        }
      };


      async function aceptarDocumento () {
        let documento = {
          id: seleccion
        }
        let URL = 'http://localhost:3001/aceptarDocumento';
        try {
          return axios.get(URL,{
            params: {
              dato: documento
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
          })
          .then((res) => {
            console.log('se elimino.')
            //setUsuarios(res);
            console.log(res);
          })  
        } catch (err) {
          console.error(err.message);
        }
      };

      async function rechazarDocumento () {
        let documento = {
          id: seleccion,
          motivo:motivo
        }
        let URL = 'http://localhost:3001/rechazarDocumento';
        try {
          return axios.get(URL,{
            params: {
              dato: documento
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
          })
          .then((res) => {
            console.log('se elimino.')
            //setUsuarios(res);
            console.log(res);
          })  
        } catch (err) {
          console.error(err.message);
        }
      };



      async function crearMotivo () {
        let documento = {
          id_documento: id_documento,
          motivo: motivo
        }
        let URL = 'http://localhost:3001/crearMotivo';
        try {
          return axios.get(URL,{
            params: {
              dato: documento
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
          })
          .then((res) => {
            console.log('se elimino.')
            //setUsuarios(res);
            console.log(res);
          })  
        } catch (err) {
          console.error(err.message);
        }
      };



    async function getRequisitosAplicante () {
    let URL = 'http://localhost:3001/enviarRequisitosAplicanteRevision';
    try {
        axios.get(URL,{
        params: {
            dato: location.state.expediente
        },
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
        })
        .then((res) => {
        setRequisitos(res.data);
        console.log('Requisitos de consulta')
        console.log(res.data);
        })  
    } catch (err) {
        console.error(err.message);
    }
    };

    async function getExpedienteAplicante () {
      let URL = 'http://localhost:3001/getExpedienteAplicante';
      try {
        axios.get(URL,{
          params: {
            dato: location.state.expediente
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
        if (3 === usuario.rol){
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
        

          if (expediente === null && requisitos === null){
            console.log("cargando datos...");
            await getExpedienteAplicante();
            await getRequisitosAplicante();
          }else if (requisitos && expediente){
              //Configurar los valores el expediente
            console.log("expediente");
            console.log(expediente);
            handleEdicion();
            setCui(expediente[0][1]);
            setNombre(expediente[0][2]);
            setApellido(expediente[0][3]);
            setEmail(expediente[0][4]);
            setDireccion(expediente[0][5]);
            setTelefono(expediente[0][6]);
          }
          /*
          if (requisitos === null){
            await getRequisitosAplicante();
          }else if (requisitos && expediente){
              console.log(requisitos);
          }
          **/
        }
      }catch(error){
        history.push('/login');
      }
      }, [expediente,requisitos,tokenRespuesta,tokenValidado,permisoValidado]);

      if (expediente===null || requisitos===null){
        return (
        <div className="container">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        );
      }   
      else if(expediente && requisitos){
        return (
          <div className="container">
            <div className="row">
                <div class="row justify-content-md-center"> 
                    <Button variant="primary" value={4} onClick={() =>{regresar()}}>
                        Registrar
                    </Button>
                </div>
            </div>

            <div class="row justify-content-md-center"> 
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Label>Nombres</Form.Label>
                        <Form.Control
                        required
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        disabled
                        />
                        <Form.Control.Feedback></Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                        required
                        type="text"
                        placeholder="Apellido"
                        value={apellido}
                        disabled
                        />
                        <Form.Control.Feedback></Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="formBasicEmail">
                        <Form.Label>Correo</Form.Label>
                        <InputGroup hasValidation>
                        <InputGroup.Text id="inputGroupPrepend"></InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Email"
                            aria-describedby="inputGroupPrepend"
                            value={email}
                            disabled
                        />
                        <Form.Control.Feedback type="invalid">
                            Escriba una dirección de correo válida
                        </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    </Row>
                    <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationCustom03">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder="Dirección" 
                        value={direccion}
                        disabled
                        />
                        <Form.Control.Feedback type="invalid">
                        Escriba su dirección.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder="Teléfono" 
                        value={telefono}
                        disabled
                        />
                        <Form.Control.Feedback type="invalid">
                        Escriba su número de télefono.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustom05">
                        <Form.Label>CUI/DPI</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder="CUI/DPI" 
                        required 
                        value={cui}
                        disabled
                        />
                        <Form.Control.Feedback type="invalid">
                        Escriba su CUI/DPI
                        </Form.Control.Feedback>
                    </Form.Group>
                    </Row>
                </Form>
            </div>

            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Requisito</th>
                    <th>Documento</th>
                    <th>Estado de revisión</th>
                    <th>Ver</th>
                    <th>Descargar</th>
                  </tr>
                </thead>

                { requisitos.map(dato=>{
                            return(                             
                                <tbody>
                                <td onClick={() =>{handleShow(dato)}}>{dato[3]}</td>
                                <td>{dato[1]}.{dato[5]}</td>
                                <td>{dato[8]}</td>
                                <td><Button variant="primary" value={3} onClick={() => {handleVer(dato[2],dato[5])}}>
                                  Ver
                                </Button></td>
                                <td><Button variant="primary" value={4} onClick={() =>{handleDescargar(dato[2])}}>
                                  Descargar
                                </Button></td>
                                </tbody>
                            )
                        })
                    }      
              </Table>
              
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Operación</Modal.Title>
                </Modal.Header>
                <Modal.Body>Operación a realizar con el documento: </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" value={1} onClick={(e)=>{handleClose(e,1)}} >
                    Aceptar
                  </Button>
                  <Button variant="primary" value={2} onClick={(e)=>{handleClose(e,1)}}>
                    Rechazar
                  </Button>
                  <Button variant="secondary" value={0} onClick={(e)=>{handleClose(e,1)}} >
                    Cancelar
                  </Button>
                </Modal.Footer>
              </Modal>            
            </div>



            <div>             
              <Modal show={showMotivo} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Motivo del rechazo</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                <Row className="mb-3">
                    <Form.Group as={Col} md="12" controlId="validationCustom01">
                        <Form.Control
                        required
                        type="text"
                        placeholder="Motivo"
                        value={motivo}
                        onChange = {(e)=>{setMotivo(e.target.value)}}
                        />
                        <Form.Control.Feedback></Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Button variant="primary" value={1} onClick={(e)=>{handleCloseMotivo(e)}}>
                    Rechazar
                  </Button>
                  <Button variant="secondary" value={0} onClick={(e)=>{handleCloseMotivo(e)}} >
                    Cancelar
                  </Button>
                </Modal.Footer>
              </Modal>            
            </div>
        </div>
      );
      }
}

export default RevisionRequisitos;