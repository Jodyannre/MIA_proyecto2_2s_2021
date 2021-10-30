import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { InputGroup } from "react-bootstrap";

import '../App.css';
const consulta = require('../consultas/consulta');

function CrearUsuario() {
    const [validated, setValidated] = useState(false);
    const [nombre,setNombre] = useState('');
    const [pass,setPass] = useState('');
    const [email,setEmail] = useState('');
    const [datosRoles, setDatosRoles] = useState(null);
    const [prueba, setPrueba] = useState(null);
    const [rol, setRol] = useState(-1);
    const [prueba2, setPrueba2] = useState(null);
    const [departamento, setDepartamento] = useState(-1);
    const [datosDepartamentos, setDatosDepartamentos] = useState(null);

  
    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }else{
            event.preventDefault();
            //Aqui convertir a json y enviarlo
            let datosUsuario = {
                nombre: nombre,
                pass: pass,
                email: email,
                estado: 1,
                rol:rol,
                departamento:departamento
            };

            //Primero cargar el CV y obtener la dirección donde se guarda
            await consulta.cargarNuevoUsuario(JSON.stringify(datosUsuario));
            //sendExpediente();
            /*
            setNombre('');
            setApellido('');
            setDireccion('');
            setEmail('');
            setDpi('');
            setTelefono('');
            */

            //Una vez creado el usuario hay que
      }
      setValidated(true);
    };

    const cambioNombre = e => {
        setNombre(e.target.value);     
    }

    const cambioPass = e => {
        setPass(e.target.value);
    }

    const departamentoSeleccionado = e =>{
      setDepartamento(parseInt(e.target.value, 10));
      console.log(e.target.value);
    }

    const cambioEmail = e => {
        setEmail(e.target.value);
    }

    const rolSeleccionado = e =>{
      setRol(parseInt(e.target.value, 10));
      console.log(e.target.value);
    }

    useEffect( async() => {

      async function traerRoles () {
        let URL = 'http://localhost:3001/enviarRoles';
        if (!prueba){
          try {
            return axios.get(URL,{
              headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  "Access-Control-Allow-Origin": "*",
              }
            })
            .then((res) => {
              setPrueba(res);
              setDatosRoles(res);
            })  
          } catch (err) {
            console.error(err.message);
          }
        }else{
          console.log(prueba);
          setDatosRoles(prueba); 
        }
      };  


      async function traerDepartamentos () {
        let URL = 'http://localhost:3001/enviarDepartamentos';
        if (!prueba2){
          try {
            return axios.get(URL,{
              headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  "Access-Control-Allow-Origin": "*",
              }
            })
            .then((res) => {
              setPrueba2(res);
              setDatosDepartamentos(res);
            })  
          } catch (err) {
            console.error(err.message);
          }
        }else{
          console.log(prueba2);
          setDatosDepartamentos(prueba2); 
        }
      };  
      if (!datosRoles){
        await traerRoles();
      }else{
        console.log(datosRoles);
      }   
      if (!datosDepartamentos){
        await traerDepartamentos();
      }else{
        console.log(datosDepartamentos);
      }   
      //let res = await traerPuestos();
      //console.log(res);
    }, [datosRoles,datosDepartamentos]);
    

    /*
    Form para elegir file en divs
        <div class="form-group">
            <label for="exampleFormControlFile1">Seleccione su CV</label>
            <input type="file" class="form-control-file" id="exampleFormControlFile1"></input>
        </div>

    */
    
    if(!datosRoles || !datosDepartamentos){
      return (
        <div className='Formulario-expediente'>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
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
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              required
              type="password" 
              placeholder="Password"
              value={pass}
              onChange= {cambioPass}
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
                required
                value={email}
                onChange= {cambioEmail}
              />
              <Form.Control.Feedback type="invalid">
                Escriba una dirección de correo válida
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Col md>  
            <div className="box-seleccion-rol">
            <Form.Label>Seleccione el rol</Form.Label>
            <Form.Control
            as="select"
            custom
            onChange={rolSeleccionado}
            >
            <option>Cargando datos....</option>
            </Form.Control>
            </div>
          </Col>
          <Col md>
            <div className="box-seleccion-puesto">
            <Form.Label>Seleccione el departamento</Form.Label>
            <Form.Control
            as="select"
            custom
            onChange={departamentoSeleccionado}
            >
            <option>Cargando datos....</option>
            </Form.Control>
            </div>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Check
            required
            label="Aceptar los términos y condiciones"
            feedback="Debe aceptar los términos y condiciones para continuar."
            feedbackType="invalido"
          />
        </Form.Group>
        <Button type="submit">Enviar formulario</Button>
      </Form>
      </div>
    );
    }
    
  
    return (
        <div className='Formulario-expediente'>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
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
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Contraseña"
              value={pass}
              onChange= {cambioPass}
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
                required
                value={email}
                onChange= {cambioEmail}
              />
              <Form.Control.Feedback type="invalid">
                Escriba una dirección de correo válida
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
        <Col md>
        <div className="box-seleccion-rol">
        <Form.Label>Seleccione un rol</Form.Label>
          <Form.Control
            as="select"
            custom
            onChange={rolSeleccionado}
          >
            <option>Seleccionar</option>
            { datosRoles.data.map(dato=>{
                        return(
                          <option value={dato[0]}>{dato[1]}</option>
                        )
                        })
                      }
          </Form.Control>
        </div>
        </Col>
        <Col md>
        <div className="box-seleccion-puesto">              
          <Form.Label>Seleccione un departamento</Form.Label>
          <Form.Control
            as="select"
            custom
            onChange={departamentoSeleccionado}
          >
            <option>Seleccionar</option>
            { datosDepartamentos.data.map(dato=>{
                        return(
                          <option value={dato[0]}>{dato[1]}</option>
                        )
                        })
                      }
          </Form.Control>
          </div>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Check
            required
            label="Aceptar los términos y condiciones"
            feedback="Debe aceptar los términos y condiciones para continuar."
            feedbackType="invalido"
          />
        </Form.Group>
        <Button type="submit">Enviar formulario</Button>
      </Form>
      </div>
    );
  }
  
export default CrearUsuario;