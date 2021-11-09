import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../App.css';
const consulta = require('../consultas/consulta');
 

function RequisitosAplicante() {
    const [validated, setValidated] = useState(false);
    const [requisitos, setRequisitos] = useState(null);
    const [direcciones, setDirecciones] = useState([]);
    const history = useHistory();
    const [seleccionado, setSeleccionado] = useState(null);


    const guardarSeleccionado = (seleccion)=>{
      setSeleccionado(seleccion); 
      //console.log(seleccionado);
    }
    async function regresar(){
      history.push('/inicioAplicante');
    }


    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false || direcciones.length === 0) {
          event.preventDefault();
          event.stopPropagation();
          console.log('Error, no se subieron los obligatorios');
        }else{
            event.preventDefault();
            console.log('Todo bien'); 
            setValidated(true);  
        }      
    };
    
    const guardarElemento = (e,requisito,usuario,puesto) => {
        //const archivo = e.target.files[0];
        const archivo = {
            archivo: e.target.files[0],
            requisito: requisito,
            usuario: usuario,
            puesto: puesto
        }
        //console.log(archivo);
        setDirecciones([...direcciones, archivo])
    }

    function validarRequisitoRepetido (actual) {
        if (global.Req_ap_anterior === actual){
            return true;
        }else{
            //console.log(global.Req_ap_anterior);
            global.Req_ap_anterior = actual;
            return false;
        }
    }


    async function subirArchivo(requisito,usuario,puesto){
      console.log(requisito,usuario,puesto);
      const dato = {
        archivo: seleccionado.target.files[0],
        requisito: requisito,
        usuario: usuario,
        puesto: puesto
    }
      /////////CREAR ARCHIVO RENOMBRADO
      console.log("Requisito");
      //console.log(dato);
      let dpi = (JSON.parse(localStorage.getItem('usuario'))).nombre;
      let nombreDoc = '';
      let tipoArchivo = dato.archivo.name.split('.').pop();
      let nombreArchivo = dato.archivo.name.split('.')[0];
      let nuevoNombre = dpi+"_"+nombreArchivo+"."+tipoArchivo;
      nombreDoc = nuevoNombre;
      let renamedFile = new File([dato.archivo], nuevoNombre);
      //console.log(renamedFile);
      ///////SUBIR ARCHIVO AL SERVER
      const r1 = await consulta.cargarArchivo(renamedFile,nuevoNombre);
      //////CREAR DOCUMENTO EN BD
      let documento = {
          nombre:nombreArchivo,
          ubicacion: nuevoNombre,
          formato: tipoArchivo,
          estado: 3,
          cui:dato.usuario,
          requisito: dato.requisito,
          puesto: dato.puesto
        }
        console.log(documento);
      const r2 = setTimeout(() => {
          consulta.crearDocumento(JSON.stringify(documento));
      }, 500);

      ///////ASOCIAR CON EXPEDIENTE Y CON REQUISITO
      const r3 = setTimeout(() => {
          consulta.asociarDocumentoRequisito(JSON.stringify(documento));
        }, 2000);  
    }


    useEffect( async() => {    
        async function traerRequisitosAplicante () {
            let URL = 'http://localhost:3001/enviarRequisitosAplicante';
            try {
              axios.get(URL,{
                params: {
                  nombre: (JSON.parse(localStorage.getItem('usuario'))).nombre
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
              })
              .then((res) => {
                setRequisitos(res.data);
                //console.log(res.data);
                console.log(requisitos);
              })  
            } catch (err) {
              console.error(err.message);
            }
          }; 
        await traerRequisitosAplicante();

      }, []);
    
    if (requisitos === null || requisitos === undefined){
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
            <div className="container">
            <div className='Formulario-expediente'>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Archivo</th>
                    <th>Selección</th>
                  </tr>
                </thead>
                <tbody>
              { requisitos.map(dato=>{
                            if (validarRequisitoRepetido(dato[3])){
                                return;
                            }else
                            return(    
                              <tr>
                              <td>{                                
                                <Row className="mb-3">
                                    <Col md>
                                        <Form.Group controlId="formFileSm" className="mb-3">
                                            <Form.Label>Ingresar {dato[4]} ({dato[6]===0? 'Opcional':'Obligatorio* '}) 
                                            (Máx. {dato[5]} mb) </Form.Label>
                                            <Form.Control 
                                            type="file" 
                                            accept="multiple"
                                            size="sm"
                                            onChange = {(e) => {
                                                guardarElemento(e, dato[3],dato[0],dato[10]);
                                                guardarSeleccionado(e);
                                             }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>                                                                                              
                                }</td>
                              <td><Button variant="primary" value={3} onClick={() =>{subirArchivo(dato[3],dato[0],dato[10])}}>Cargar</Button></td>
                            </tr>  )                      
                        })
                    }
                    </tbody>
                    </Table>
                    </Row>
                <Button onClick={regresar}>Aceptar</Button>
              </Form>
              </div>
            </div>
        ); 
    }


     
    

}

export default RequisitosAplicante;