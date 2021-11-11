import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { InputGroup } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { useHistory } from 'react-router-dom';

import '../App.css';
const consulta = require('../consultas/consulta');

function Login() {
    const [validated, setValidated] = useState(false);
    const [nombre,setNombre] = useState(null);
    const [password,setPass] = useState(null);
    const [autenticacion, setAutenticacion] = useState(null);
    const [credenciales, setCredenciales] = useState(null);
    const [usuarioValido, setUsuarioValido] = useState(false);
    const [show, setShow] = useState(false);
    const history = useHistory();
    const [respuestaToken, setRespuestaToken] = useState(null);
    const [tokenValido, setTokenValido] = useState(false);
  
    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }else{
        event.preventDefault();
        await getCredenciales();
            
      }
      setValidated(true);
    };

    const handleClose  = async (event) => {
        setShow(false);       
        setNombre('');
        setPass('');
      };


    const cambioNombre = e => {
        setNombre(e.target.value);
        
    }

    const cambioPass = e => {
        setPass(e.target.value);
    }



    async function getCredenciales(){
        let URL = 'http://localhost:3001/login';
        const dato = {
            usuario: nombre,
            password:password
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
            console.log('Credenciales')
            console.log(res);
            setCredenciales(res.data);
          })  
        } catch (err) {
          console.error(err.message);
        }

    }


    async function validarUsuario(){
        let URL = 'http://localhost:3002/login';
        const user = {
            user: nombre,
            password: password
        }
        try {
          axios.post(URL,{
            user: nombre,
            password: password,
            estado: 'login'
            }
          )
          .then((res) => {
              console.log('Autenticacion');
              console.log(res.data);
              setAutenticacion(res.data);
          })  
        } catch (err) {
          console.error(err.message);
        }

    }


    useEffect( async() => {
        
        if (credenciales && autenticacion===null){
            if (credenciales[0]==='no'){
                //Credenciales malas o el usuario no existe
                console.log('El usuario no existe');
                setShow(true);
                return;
            }
            console.log('Aqui no debería de estar');
            await validarUsuario();
            //Crear credenciales que se van a guardar en localstorage del usuario
            const usuario = {
                nombre: credenciales[0],
                contraseña: credenciales[1],
                rol: credenciales[2],
                id: credenciales[3],
                estado: credenciales[4],
                email: credenciales[5]
            }
            //Guardar usuario logueado en localstorage
            sessionStorage.setItem('usuario',JSON.stringify(usuario));
            //Traer al usuario guardado en localStorage
            let variable = sessionStorage.getItem('usuario');

        }
        
        if (autenticacion){
            console.log('Redireccionar')
            console.log(autenticacion);
            //Hacer la redirección aquí y guardar los datos de credenciales en localstorage
            const tokens = {
                refresh: autenticacion.refreshToken,
                token: autenticacion.token,
                status: autenticacion.status,
                user: credenciales[0],
                password: credenciales[1]           
            }
            sessionStorage.setItem('tokens',JSON.stringify(tokens));
            let variable = sessionStorage.getItem('tokens');
            //Agregar token a las cookies
            
            document.cookie = `token=${autenticacion.token}; max-age=${global.tokenLife}; path=/; samesite=strict;`;
            document.cookie = `refresh=${autenticacion.refreshToken}; max-age=${global.refreshLife}; path=/; samesite=strict;`;
            if (credenciales[2]===4 || credenciales[2]===5 ){
                // Es un aplicante
                history.push('/inicioAplicante');
            }else if (credenciales[2]===3){
                //Es un revisor
                history.push('/acexpediente');
            }else if (credenciales[2]===2){
                //Es un coordinardor
                history.push('/administracionPlantilla');
                //history.push('/inicioAplicante');
            }else if (credenciales[2]===1){
              history.push('/administracion');
                //Es el administrador
                //history.push('/inicioAplicante');
            }
            
        }

    }, [credenciales,autenticacion]);
       

      return (
        <div class="row justify-content-md-center">
        <div className='Formulario-expediente'>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={cambioNombre}
            />
            <Form.Control.Feedback></Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>

        <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="contraseña"
              value={password}
              onChange= {cambioPass}
            />
            <Form.Control.Feedback></Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Button type="submit">Ingresar</Button>
      </Form>
      </div>

      <div>             
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                <Row className="mb-3">
                    <Form.Group as={Col} md="12" controlId="validationCustom01">
                        El usuario o la contraseña ingresada son incorrectos. Inténtelo de nuevo.
                    </Form.Group>
                  </Row>
                  <Button variant="secondary" value={0} onClick={(e)=>{handleClose(e)}} >
                    Aceptar
                  </Button>
                </Modal.Footer>
              </Modal>            
            </div>
      </div>
    );
  }
  
export default Login;