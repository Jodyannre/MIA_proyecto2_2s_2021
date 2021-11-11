import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { Cv } from "../components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useHistory } from 'react-router-dom';


import '../App.css';
const consulta = require('../consultas/consulta');

function Acexpediente() {
    const [validated, setValidated] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [cv, setCV] = useState(null);
    const [id_documento, setId_documento] = useState(null);
    const [datosPuestos, setDatosPuestos] = useState(null);
    const [show,setShow] = useState(false);
    const [opcionFiltro, setOpcionFiltro] = useState(0);
    const [opcionEscrita, setOpcionEscrita] = useState(null);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    const [editar, setEditar] = useState(false);
    const [nombre, setNombre] = useState(''); 
    const [pass, setPass] = useState('');
    const [correo, setCorreo] = useState('');
    const [usuarios,setUsuarios] = useState(null);
    const [editado, setEditado] = useState(0);
    const history = useHistory();
    const cookies = document.cookie;
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    const tokens = JSON.parse(sessionStorage.getItem('tokens'));
    const [permisoValidado, setPermisoValidado] = useState(null);
    const [tokenValidado, setTokenValidado] = useState(null);
    const [tokenRespuesta, setTokenRespuesta] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    const handleClose  = async (event) => {
      setShow(false);
      if (event.target.value === '0'){
        //Cerrar
        
      }else if (event.target.value === '1'){
          //Aceptar
        await aceptarExpediente();
        setUsuarios(null);
        await traerExpediente();
      }else if (event.target.value === '2') {
        //Rechazar
        await rechazarExpediente();
        setUsuarios(null);
        await traerExpediente();        
      }else if (event.target.value === '3') {
        //Ver CV
        //global.cvFormato = usuarioSeleccionado[13];
        //global.cvUbicacion = usuarioSeleccionado[11];
        //console.log(usuarioSeleccionado);
        //console.log(global.cvFormato);
        //console.log(global.cvUbicacion);
        history.push({
          pathname: '/Cv',
          search: '?query=abc',
          state: { expediente: usuarioSeleccionado[0],ubicacion:usuarioSeleccionado[11],
          rol:3, formato:usuarioSeleccionado[13]}    
      });
        //setUsuarios(null);
        //await traerExpediente();
      }else if (event.target.value === '4') {
        //Ver Expediente
        history.push({
          pathname: '/revisionRequisitos',
          search: '?query=abc',
          state: { expediente: usuarioSeleccionado[0]}
      });
      

      }else if (event.target.value === '5') {
        //Aprobar Expediente
        await aprobarExpediente();
        setUsuarios(null);
        await traerExpediente(); 
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
            //console.log('Autenticacion');
            //console.log(res);
            setTokenRespuesta(res.data);
        })  
      } catch (err) {
        console.error(err.message);
      }
  }

  const verCookies = () =>{
    if (cookies != ''){
      //Existe mas de alguno
      let tmp = cookies.split(';');
      //console.log('longitud ',tmp.length);
      //console.log(tmp);
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

    async function traerExpedienteFiltro () {
        const dato = {
            opcionFiltro: opcionFiltro,
            opcionEscrita: opcionEscrita,
            revisor: (JSON.parse(sessionStorage.getItem('usuario'))).nombre
          }
        let URL = 'http://localhost:3001/enviarExpedientesRevision';
        try {
          return axios.get(URL,{
            params: {
              dato: dato
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
          })
          .then((res) => {
            //console.log('se cargo.')
            setUsuarios(res);
            //console.log(res);
          })  
        } catch (err) {
          console.error(err.message);
        }
      };
    
    
    




    const filtrar = async (event) => {
      //Filtrar los datos
      setUsuarios(null);
      traerExpedienteFiltro();
    }

    async function rechazarExpediente () {
      let expediente = {
        id: usuarioSeleccionado[16],
        opcion: 0
      }
      let URL = 'http://localhost:3001/rechazarExpediente';
      try {
        return axios.get(URL,{
          params: {
            dato: expediente
          },
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*",
          }
        })
        .then((res) => {
          //console.log('se elimino.')
          //setUsuarios(res);
          //console.log(res);
        })  
      } catch (err) {
        console.error(err.message);
      }
    };

    async function aprobarExpediente () {
      const expediente = {
        usuario: usuarioSeleccionado[0],
        expediente: usuarioSeleccionado[16],
        email: usuarioSeleccionado[6]
      }
      let URL = 'http://localhost:3001/aprobarExpediente';
      try {
        return axios.get(URL,{
          params: {
            dato: expediente
          },
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*",
          }
        })
        .then((res) => {
          //setUsuarios(res);
          //console.log(res);
        })  
      } catch (err) {
        console.error(err.message);
      }
    };

    async function aceptarExpediente () {
      let expediente = {
        id: usuarioSeleccionado[16],
        opcion: 1
      }
      let URL = 'http://localhost:3001/aceptarExpediente';
      try {
        return axios.get(URL,{
          params: {
            dato: expediente
          },
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*",
          }
        })
        .then((res) => {
          //console.log('se elimino.')
          //setUsuarios(res);
          //console.log(res);
        })  
      } catch (err) {
        console.error(err.message);
      }
    };


    async function verCV () {

      let expediente = {
        id: usuarioSeleccionado[16]
      }
      let URL = 'http://localhost:3001/verCV';
      try {
        return axios.get(URL,{
          params: {
            dato: expediente
          },
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*",
          }
        })
        .then((res) => {
          //console.log('se cargo CV.')
          global.cvFormato = res.data[0][1];
          global.cvUbicacion = res.data[0][0];
          setCV(res);
          //console.log(res);
        })  
      } catch (err) {
        console.error(err.message);
      }
    };

    const regresar = () =>{
      sessionStorage.removeItem('usuario');
      sessionStorage.removeItem('tokens');
      history.push('/login');
    }

    const handleEditar = async (event) => {
      //event.preventDefault();
      setEditar(false);
      // Editar usuario
      await editarUsuario();
      setEditado(editado+1);
      setUsuarios(null);
      await traerExpediente();
      //console.log('Editado');
    }

    const handleShow = (dato) => {
      setUsuarioSeleccionado(dato);
      setNombre(dato[0]);
      setPass(dato[6]);
      setCorreo(dato[7]);
      setUsuarioEditar(dato);
      setId_documento(17);
      setShow(true)
      //console.log('dato: ',dato);
    }

    const editarNombre = e => {
      setNombre(e.target.value);
      //console.log(nombre);
    }
  
    const editarPass = e => {
      setPass(e.target.value);
    }
    
    const editarCorreo = e => {
      setCorreo(e.target.value);
    }

    const handleOpcionFiltro = e => {
      setOpcionFiltro(parseInt(e.target.value, 10));
      //console.log(e.target.value);
    };

    const handleOpcionEscrita = e =>{
      setOpcionEscrita(e.target.value);
      //console.log(opcionEscrita);
    }


  
    const handleSubmit = async (event) => {
      //console.log('filtrando');
    };



    async function editarUsuario () {
      let dato = {
        nombre: nombre,
        pass: pass,
        email: correo
      }
      let URL = 'http://localhost:3001/editarUsuario';
      try {
        return axios.get(URL,{
          params: {
            dato: dato
          },
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*",
          }
        })
        .then((res) => {
          //console.log('se edito.')
          //setUsuarios(res);
          //console.log(res);
        })  
      } catch (err) {
        console.error(err.message);
      }
    }; 


    async function traerExpediente () {
        const dato = (JSON.parse(sessionStorage.getItem('usuario'))).nombre;
        let URL = 'http://localhost:3001/enviarExpedientes';
        try {
          return axios.get(URL,{
            params: {
              dato: dato
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
          })
          .then((res) => {
            //console.log('se cargo.')
            setUsuarios(res);
            //console.log(res);
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
            //console.log('Tiene permiso.');
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
        //Cargar usuarios
        if (usuarios === null){
          await traerExpediente();
        }
      }
      }catch(error){
        //console.log(error);
        history.push('/login');
      }
    }, [usuarios,tokenRespuesta,tokenValidado,permisoValidado]);
    
    if (usuarios===null){
      return (
      <div className="container">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      );
    }   
    else if(!editar){
      return (
        <div className="container">
          <div className="row">
            <div class="col-sm">
              <Form.Select aria-label="Default select example" 
              as='select'
              costum
              onChange ={handleOpcionFiltro}>
                <option>Seleccione un filtro</option>
                <option value={1} >Nombre</option>
                <option value={2} >Puesto</option>
                <option value={3} >Fecha</option>
              </Form.Select>
            </div>
            <div class="col-sm">
              <Form.Control size="sm" type="text" placeholder="opción" onChange = {handleOpcionEscrita}/>
              <br />
            </div>
            <div class="col-sm">
              <Button variant="primary" onClick={filtrar}>Filtrar</Button>{' '}
              <Button variant="primary" value={4} onClick={() =>{regresar()}}>
                Salir
            </Button>
            </div>
          </div>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>CUI</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Puesto</th>
                  <th>Estado del Expediente</th>
                  <th>Fecha de postulación</th>
                </tr>
              </thead>
              <tbody>
                { usuarios.data.map(dato=>{
                      return(
                        <tr>
                          <td onClick={()=>handleShow(dato)}>{dato[0]}</td>
                          <td>{dato[1]}</td>
                          <td>{dato[2]}</td>
                          <td>{dato[3]}</td>
                          <td>{dato[4]}</td>
                          <td>{dato[5]}</td>
                        </tr>                        
                      )
                      })
                    }
              </tbody>
            </Table>
            
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Editar usuario</Modal.Title>
              </Modal.Header>
              <Modal.Body>Operación a realizar con el usuario: {usuarioSeleccionado[0]} </Modal.Body>
              <Modal.Footer>
              <Button variant="primary" value={5} onClick={handleClose}>
                  Aprobar
                </Button>
              <Button variant="primary" value={1} onClick={handleClose}>
                  Aceptar
                </Button>
                <Button variant="primary" value={2} onClick={handleClose}>
                  Rechazar
                </Button>
                <Button variant="primary" value={3} onClick={handleClose}>
                  Ver cv
                </Button>
                <Button variant="primary" value={4} onClick={handleClose}>
                  Ver expediente
                </Button>
                <Button variant="secondary" value={0} onClick={handleClose}>
                  Cancelar
                </Button>
              </Modal.Footer>
            </Modal>            
          </div>
      </div>
    );
    }
    else if (usuarios) {

      return (
        <div className="container">
        <div className="row">
          <div class="col-sm">
            <Form onSubmit={handleEditar}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control 
                  type="text" 
                  placeholder="nombre"
                  readOnly 
                  value={nombre}
                  onChange= {editarNombre} 
                  />
                </Form.Group>
  
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={pass}
                  onChange= {editarPass}                 
                  />
                </Form.Group>
              </Row>
  
              <Form.Group as={Col} className="mb-3" controlId="formGridAddress1">
                <Form.Label>Correo</Form.Label>
                <Form.Control 
                type="email"
                placeholder="email" 
                value={correo}
                onChange= {editarCorreo} 
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Actualizar
              </Button>
            </Form>     
          </div>           
        </div>
      </div>    
        );
      }
    }
    
  
export default Acexpediente;