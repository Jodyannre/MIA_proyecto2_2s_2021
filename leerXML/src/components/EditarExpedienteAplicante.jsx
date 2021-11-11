import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useLocation } from "react-router-dom";
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
    const location = useLocation();
    const cookies = document.cookie;
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    const tokens = JSON.parse(sessionStorage.getItem('tokens'));
    const [permisoValidado, setPermisoValidado] = useState(null);
    const [tokenValidado, setTokenValidado] = useState(null);
    const [tokenRespuesta, setTokenRespuesta] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

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

    const handleEdicion = async () => {
        if (expediente[0][8]+1 === 2 
            || expediente[0][8] === 3
            || expediente[0][8] === 6){
                //console.log('El expediente se puede revisar');
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
            event.preventDefault();
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
                  dato: (JSON.parse(sessionStorage.getItem('usuario'))).nombre
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

          if (expediente === null){
            await getExpedienteAplicante();
          }else{
              //Configurar los valores el expediente
              //console.log(expediente);
            handleEdicion();
            setCui(expediente[0][1]);
            setNombre(expediente[0][2]);
            setApellido(expediente[0][3]);
            setEmail(expediente[0][4]);
            setDireccion(expediente[0][5]);
            setTelefono(expediente[0][6]);
          }
      }
    }catch(error){
      history.push('/login');
    }  
      }, [expediente,tokenRespuesta,tokenValidado,permisoValidado]);
    
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