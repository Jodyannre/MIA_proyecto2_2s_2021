import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { InputGroup } from "react-bootstrap";
import { useLocation } from "react-router-dom";


import '../App.css';
const consulta = require('../consultas/consulta');

function Formulario() {
    const [validated, setValidated] = useState(false);
    const [nombre,setNombre] = useState('');
    const [apellido,setApellido] = useState('');
    const [direccion,setDireccion] = useState('');
    const [email,setEmail] = useState('');
    const [dpi,setDpi] = useState('');
    const [telefono,setTelefono] = useState('');
    const [cv, setCv] = useState(null);
    const [datosPuestos, setDatosPuestos] = useState(null);
    const [prueba, setPrueba] = useState(null);
    const [puesto, setPuesto] = useState(-1);
    const history = useHistory();
    const location = useLocation();


    const regresar = () =>{
      history.push('/inicioGuest');
    }
  
    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      let nombreDoc = '';
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }else{
            event.preventDefault();
            if (cv){
              let tipoArchivo = cv.name.split('.').pop();
              let nombreArchivo = cv.name.split('.')[0];
              let nuevoNombre = dpi+"_"+nombreArchivo+"."+tipoArchivo;
              nombreDoc = nuevoNombre;
              let renamedFile = new File([cv], nuevoNombre);
              console.log(renamedFile);
              await consulta.cargarArchivo(renamedFile,nuevoNombre);

              //Hay que crear también el documento
              let documento = {
                nombre:nombreArchivo,
                ubicacion: nuevoNombre,
                formato: tipoArchivo,
                estado: 1
              }

              await consulta.crearDocumento(JSON.stringify(documento));

              //Luego darle un formato

              let datosUsuario = {
                nombre: nombre,
                apellido: apellido,
                direccion: direccion,
                email: email,
                dpi: dpi,
                telefono: telefono,
                cv: nombreDoc,
                estado: 1,
                puesto:puesto
            };
            //Primero cargar el CV y obtener la dirección donde se guarda
            const tercero = setTimeout(() => {
              consulta.cargarNuevoExpediente(JSON.stringify(datosUsuario));
            }, 1000);

            const cuarto = setTimeout(() => {
              consulta.enviarMail();
            }, 1200);

            //await consulta.cargarNuevoExpediente(JSON.stringify(datosUsuario));
            const quinto = setTimeout(() => {
              history.push('/inicioGuest');
            }, 2000);           
            }


            
            //Aqui convertir a json y enviarlo

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

    const cambioApellido = e => {
        setApellido(e.target.value);
    }

    const cambioDireccion = e => {
        setDireccion(e.target.value);
    }

    const cambioTelefono = e => {
        setTelefono(e.target.value);
    }
    const cambioDpi = e => {
        setDpi(parseInt(e.target.value, 10));
    }
    const cambioEmail = e => {
        setEmail(e.target.value);
    }
    const cambioCV = async e => {
        setCv(e.target.files[0]);       
    }

    const puestoSeleccionado = e =>{
      setPuesto(parseInt(e.target.value, 10));
      console.log(e.target.value);
    }

    useEffect( async() => {
      async function traerPuestos () {
        let URL = 'http://localhost:3001/enviarPuestos';
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
              setDatosPuestos(res);
            })  
          } catch (err) {
            console.error(err.message);
          }
        }else{
          console.log(prueba);
          setDatosPuestos(prueba); 
        }
      };  
      if (!datosPuestos){
        await traerPuestos();
      }else{
        console.log(datosPuestos);
      }   
      //let res = await traerPuestos();
      //console.log(res);
    }, [datosPuestos]);
    

    /*
    Form para elegir file en divs
        <div class="form-group">
            <label for="exampleFormControlFile1">Seleccione su CV</label>
            <input type="file" class="form-control-file" id="exampleFormControlFile1"></input>
        </div>

    */
    
    if(!datosPuestos){
      return ( 
        <div className="container">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        );
    }
    
  
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
            value={dpi}
            onChange= {cambioDpi}
            />
            <Form.Control.Feedback type="invalid">
              Escriba su CUI/DPI
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
        <Col md>
        <Form.Group controlId="formFileSm" className="mb-3">
            <Form.Label>Seleccione su CV</Form.Label>
            <Form.Control 
            required
            type="file" 
            accept='.txt'
            size="sm"
            onChange = {cambioCV}
             />
        </Form.Group>
        </Col>
        <Col md>
        <div className="box-seleccion-puesto">
        <Form.Control
          as="select"
          custom
          onChange={puestoSeleccionado}
        >
          <option>Seleccione un puesto</option>
          { datosPuestos.data.map(dato=>{
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
        <Button onClick={()=>{regresar()}}>Regresar</Button>
      </Form>
      </div>
      </div>
    );
  }
  
export default Formulario;