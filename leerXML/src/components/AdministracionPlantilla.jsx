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
    const [datosPuestos, setDatosPuestos] = useState(null);
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
    const [permisoValidado, setPermisoValidado] = useState(null);
    const [tokenValidado, setTokenValidado] = useState(null);
    const history = useHistory();


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
        email: correo
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
      setUsuarioEditar(dato);
      setShow(true)
      console.log('dato: ',dato);
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


  
    const handleSubmit = async (event) => {
      console.log('filtrando');
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
          console.log('se edito.')
          //setUsuarios(res);
          console.log(res);
        })  
      } catch (err) {
        console.error(err.message);
      }
    }; 


    async function traerPlantilla () {
      const dato = (JSON.parse(localStorage.getItem('usuario'))).nombre;
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
      //Verificar que tiene permiso y que la sesión existe
      if (permisoValidado===null){
        setPermisoValidado(await ValidarPermiso(2));
      }
      if (tokenValidado===null){
        setTokenValidado(await ValidarToken());
      }

      //Cargar usuarios
      if (permisoValidado!=null && tokenValidado!=null){
        if (permisoValidado && tokenValidado){
          await traerPlantilla();
        }else{
          history.push('/login');
        }
        
      }
    }, [permisoValidado, tokenValidado]);
    




    if (permisoValidado===null || tokenValidado===null){
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