import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { ValidarToken, ValidarPermiso } from "./Funciones";


import '../App.css';
const consulta = require('../consultas/consulta');

function AdministracionPlantilla() {
    const [validated, setValidated] = useState(false);
    const [show,setShow] = useState(false);
    const [id_puesto, setId_puesto] = useState(null);
    const [opcionFiltro, setOpcionFiltro] = useState(0);
    const [opcionEscrita, setOpcionEscrita] = useState(null);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    const [editar, setEditar] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState(null);
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
        console.log(event.target.value);
      }else if (event.target.value === '1'){
          //Asociar
        //setEditar(true);
        console.log(event.target.value);
        await asociarUsuario();
        setUsuarios(null);
        await traerPlantilla();
      }else {
        await eliminarUsuario();
        event.preventDefault();
        setEditado(editado+1);
        setUsuarios(null);
        await traerPlantilla();
      }
    };


    const filtrar = async (event) => {
      //Filtrar los datos
      setUsuarios(null);
      traerPlantilla();
    }

    async function eliminarUsuario () {
      let dato = {
        nombre: nombre,
        pass: pass,
        email: correo,
        puesto:id_puesto
      }
      let URL = 'http://localhost:3001/eliminarUsuario';
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
          console.log('se elimino.')
          //setUsuarios(res);
          console.log(res);
        })  
      } catch (err) {
        console.error(err.message);
      }
    };




    
    async function asociarUsuario () {
      let dato = {
        cui: usuarioSeleccionado[0],
        salario: usuarioSeleccionado[9],
        departamento: usuarioSeleccionado[10],
        puesto: usuarioSeleccionado[11],
        email: usuarioSeleccionado[3]
      }
      let URL = 'http://localhost:3001/asociarUsuario';
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
          console.log('se elimino.')
          //setUsuarios(res);
          console.log(res);
        })  
      } catch (err) {
        console.error(err.message);
      }
    };

    const handleEditar = async (event) => {
      //event.preventDefault();
      setEditar(false);
      // Editar usuario
      await editarUsuario();
      setEditado(editado+1);
      setUsuarios(null);
      await traerPlantilla();
      console.log('Editado');
    }

    const handleShow = (dato) => {
      setUsuarioSeleccionado(dato);
      setNombre(dato[0]);
      setPass(dato[6]);
      setCorreo(dato[7]);
      if (dato[9]===null){
        setId_puesto(-1);
      }else{
        setId_puesto(dato[9]);
      }
      setUsuarioEditar(dato);
      setShow(true)
      console.log('dato: ',dato);
    }

    const regresar = () =>{
      sessionStorage.removeItem('usuario');
      sessionStorage.removeItem('tokens');
      history.push('/login');
    }

    const editarNombre = e => {
      setNombre(e.target.value);
      console.log(nombre);
    }
  
    const editarPass = e => {
      setPass(e.target.value);
    }
    
    const editarCorreo = e => {
      setCorreo(e.target.value);
    }

    const handleOpcionFiltro = e => {
      setOpcionFiltro(e.target.value);
      console.log(e.target.value);
    };

    const handleOpcionEscrita = e =>{
      setOpcionEscrita(e.target.value);
      console.log(opcionEscrita);
    }


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
          console.log('se edito.')
          //setUsuarios(res);
          console.log(res);
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


    async function traerPlantilla () {
      const dato = (JSON.parse(sessionStorage.getItem('usuario'))).nombre;
      let URL = 'http://localhost:3001/enviarPlantilla';
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
          console.log('se cargo.')
          setUsuarios(res);
          console.log(res);
        })  
      } catch (err) {
        console.error(err.message);
      }
    }; 



    useEffect( async() => { 
      console.log('Esta en plantilla');
      try{
        //Verificar que tiene permiso y que la sesión existe
        verCookies();
        if (tokenRespuesta){
          console.log("tokenRespuesta");
          console.log(document.cookie);
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
          if (2 === usuario.rol){
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
        if (tokenValidado && permisoValidado){
          await traerPlantilla();
        }


      }catch(error){
        //console.log(error);
        history.push('/login');
      }
      
    }, [tokenRespuesta,tokenValidado,permisoValidado]);
    




    if (permisoValidado===null || tokenValidado===null || usuarios===null){
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
                <option value={2} >Estado</option>
                <option value={3} >Fecha inicio</option>
                <option value={4} >Fecha fin</option>
                <option value={5} >Rol</option>
              </Form.Select>
            </div>
            <div class="col-sm">
              <Form.Control size="sm" type="text" placeholder="opción" onChange = {handleOpcionEscrita}/>
              <br />
            </div>
            <div class="col-sm">
              <Button variant="primary" onClick={filtrar}>Filtrar</Button>{' '}
            </div>
            <div class="col-sm">
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
                  <th>Email</th>
                  <th>Direccion</th>
                  <th>Teléfono</th>
                  <th>Expediente</th>
                  <th>Puesto</th>
                  <th>Rol</th>
                  <th>Salario</th>
                </tr>
              </thead>
              <tbody>
                { usuarios.data.map(dato=>{
                      return(
                        <tr>
                          <td onClick={()=>handleShow(dato)}>{dato[0]}</td>
                          <td>{dato[1]}</td>
                          <td>{dato[2]}</td>
                          <td>{dato[3]===null? '-':dato[3]}</td>
                          <td>{dato[4]}</td>
                          <td>{dato[5]}</td>
                          <td>{dato[6]}</td>
                          <td>{dato[7]}</td>
                          <td>{dato[8]}</td>
                          <td>{dato[9]}</td>
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
              <Button variant="primary" value={1} onClick={handleClose}>
                  Asociar
                </Button>
                <Button variant="primary" value={2} onClick={handleClose}>
                  Eliminar
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
    
  
export default AdministracionPlantilla;