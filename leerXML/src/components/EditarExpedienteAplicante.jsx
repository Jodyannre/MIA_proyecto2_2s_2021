import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import '../App.css';
import { useHistory } from 'react-router-dom';
import { InputGroup } from "react-bootstrap";
const consulta = require('../consultas/consulta');


function EditarExpedienteAplicante() {
    const [expediente, setExpediente] = useState(null);
    const [edicion, setEdicion] = useState(false);
    const history = useHistory();
    const [validated, setValidated] = useState(false);
    const [nombre,setNombre] = useState('');
    const [apellido,setApellido] = useState('');
    const [direccion,setDireccion] = useState('');
    const [email,setEmail] = useState('');
    const [dpi,setDpi] = useState('');
    const [telefono,setTelefono] = useState('');
    const [cui,setCui] = useState('');

    const handleEdicion = async () => {
        if (expediente[0][8]+1 === 2 
            || expediente[0][8] === 3
            || expediente[0][8] === 6){
                console.log('El expediente se puede revisar');
                setEdicion(true);
            }
    }

    async function regresar(){
        history.push('/inicioAplicante');
    }

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

    const cambioNombre = e => {
        setNombre(e.target.value);
        
    }

    const cambioApellido = e => {
        setApellido(e.target.value);
    }

    const cambioDireccion = e => {
        setDireccion(e.target.value);
    }

    const cambioTelefono = e => {
        setTelefono(e.target.value);
    }

    const cambioEmail = e => {
        setEmail(e.target.value);
    }



    useEffect( async() => {  
        async function getExpedienteAplicante () {
            let URL = 'http://localhost:3001/getExpedienteAplicante';
            try {
              axios.get(URL,{
                params: {
                  dato: global.login
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
          if (expediente === null){
            await getExpedienteAplicante();
          }else{
              //Configurar los valores el expediente
              console.log(expediente);
            handleEdicion();
            setCui(expediente[0][1]);
            setNombre(expediente[0][2]);
            setApellido(expediente[0][3]);
            setEmail(expediente[0][4]);
            setDireccion(expediente[0][5]);
            setTelefono(expediente[0][6]);
          }
          
      }, [expediente]);
    
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
            <div class="row justify-content-md-center"> 
            <div className='Formulario-expediente'>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Label>Nombres</Form.Label>
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
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                        required
                        type="text"
                        placeholder="Apellido"
                        value={apellido}
                        onChange= {cambioApellido}
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
                    <Form.Group as={Col} md="6" controlId="validationCustom03">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder="Dirección" 
                        required 
                        value={direccion}
                        onChange= {cambioDireccion}
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
                        required 
                        value={telefono}
                        onChange= {cambioTelefono}
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
                    <Button type="submit">Guardar cambios</Button>
                    <Button onClick={()=>{regresar()}}>Regresar</Button>
                </Form>       
                </div>
                </div>
        ); 
    }
}


export default EditarExpedienteAplicante;