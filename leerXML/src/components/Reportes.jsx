import React,{ useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import '../App.css';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function Reportes() {
    const [departamentos, setDepartamentos] = useState(null);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);
    const [opcionDepartamento, setOpcionDepartamento] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [activar, setActivar] = useState(null);
    const [reporte, setReporte] = useState(0);
    const history = useHistory();
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

    const regresar = () =>{
        history.push('/administracion');
    }


    const getPlantillaGlobal = async()=>{
        setOpcionDepartamento(0);
        setDepartamentoSeleccionado(0);
        setReporte(1);
    }

    const getPlantillaIndividual = async()=>{
        setOpcionDepartamento(1);
        setReporte(2);
    }

    const getReporteDepartamentos = async()=>{
        setOpcionDepartamento(0);
        setReporte(3);
    }

    const getDemasReportes = async(opcion)=>{
        setOpcionDepartamento(0);
        setReporte(opcion);
    }

    const limpiarDatos = ()=>{
        setReporte(0);
        setResultado(null);
        setOpcionDepartamento(null);
        setDepartamentoSeleccionado(null);
    }

    async function reportePlantilla () {
        const dato = {
            departamento: departamentoSeleccionado,
            opcion: opcionDepartamento
          }
        let URL = 'http://localhost:3001/reportePlantilla';
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
            setResultado(res.data[0]);
            //console.log(res.data[0]);
          })  
        } catch (err) {
          console.error(err.message);
        }
    };

    async function getDepartamentos () {
        let URL = 'http://localhost:3001/getDepartamentos';
        try {
          return axios.get(URL)
          .then((res) => {
            setDepartamentos(res.data);
            //console.log(res.data);
          })  
        } catch (err) {
          console.error(err.message);
        }
    };

    async function reporteDepartamentos () {
        let URL = 'http://localhost:3001/reporteDepartamentos';
        try {
          return axios.get(URL)
          .then((res) => {
            setResultado(res.data);
            //console.log(res.data);
          })  
        } catch (err) {
          console.error(err.message);
        }
    };

    async function demasReportes (seleccion) {
        const dato = {
            opcion: seleccion,
          }
        let URL = 'http://localhost:3001/demasReportes';
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
            setResultado(res.data);
            //console.log(res.data);
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
        if (1 === usuario.rol){
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
       if (departamentos === null){
           await getDepartamentos();
       } 
       if (reporte === 1){
            setOpcionDepartamento(0);
            setDepartamentoSeleccionado(0);
            await reportePlantilla();           
       }
        if (reporte === 2){
                setOpcionDepartamento(1);
                await reportePlantilla();
        }
        if (reporte === 3){
            await reporteDepartamentos();
        }
        if (reporte === 4){
            await demasReportes(4);
        }
        if (reporte === 5){
            await demasReportes(5);
        }
        if (reporte === 6){
            await demasReportes(6);
        }
        if (reporte === 7){
            await demasReportes(7);
        }
    }
    }catch(error){
        history.push('/login');
    }

    },[reporte,tokenRespuesta,tokenValidado,permisoValidado]);

    if (departamentos === null){
        return (
            <div className="container">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            );
    }
    else if ((reporte===1 || reporte===2) && resultado){
        return (
            <div className="container">
                <div className="row">
                    <Button variant="primary" value={1} onClick={()=>{limpiarDatos()}}>
                        Limpiar
                    </Button>
                </div>
                <div className="row">
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Fecha de inicio</th>
                            <th>Puesto</th>
                            <th>Salario</th>
                            <th>Departamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        { resultado.map(dato=>{
                            //console.log('iterando');
                            //console.log(dato);
                            return(
                                <tr>
                                <td>{dato[2]}</td>
                                <td>{dato[3]}</td>
                                <td>{dato[5]}</td>
                                <td>{dato[6]}</td>
                                <td>{dato[8]}</td>
                                </tr>                        
                            )
                        })
                        }
                    </tbody>
                    </Table>                   
                </div>
            </div>
        );
    }
    else if (reporte===3 && resultado){
        return (
            <div className="container">
                <div className="row">
                    <Button variant="primary" value={1} onClick={()=>{limpiarDatos()}}>
                        Limpiar
                    </Button>
                </div>
                <div className="row">
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Departamento</th>
                            <th>Cantidad de empleados</th>
                        </tr>
                    </thead>
                    <tbody>
                        { resultado.map(dato=>{
                            //console.log('iterando');
                            //console.log(dato);
                            return(
                                <tr>
                                <td>{dato[1]}</td>
                                <td>{dato[0]}</td>
                                </tr>                        
                            )
                        })
                        }
                    </tbody>
                    </Table>                   
                </div>
            </div>
        );
    }
    else if (reporte===4 && resultado){
        return (
            <div className="container">
                <div className="row">
                    <Button variant="primary" value={1} onClick={()=>{limpiarDatos()}}>
                        Limpiar
                    </Button>
                </div>
                <div className="row">
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Usuario</th>
                            <th>Cantidad de invitaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        { resultado.map(dato=>{
                            //console.log('iterando');
                            //console.log(dato);
                            return(
                                <tr>
                                <td>{dato[0]}</td>
                                <td>{dato[1]}</td>
                                <td>{dato[2]}</td>
                                </tr>                        
                            )
                        })
                        }
                    </tbody>
                    </Table>                   
                </div>
            </div>
        );
    }
    else if (reporte===5 && resultado){
        return (
            <div className="container">
                <div className="row">
                    <Button variant="primary" value={1} onClick={()=>{limpiarDatos()}}>
                        Limpiar
                    </Button>
                </div>
                <div className="row">
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Cantidad de rechazos</th>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                        </tr>
                    </thead>
                    <tbody>
                        { resultado.map(dato=>{
                            //console.log('iterando');
                            //console.log(dato);
                            return(
                                <tr>
                                <td>{dato[0]}</td>
                                <td>{dato[1]}</td>
                                <td>{dato[2]}</td>
                                <td>{dato[3]}</td>
                                </tr>                        
                            )
                        })
                        }
                    </tbody>
                    </Table>                   
                </div>
            </div>
        );
    }
    else if (reporte===6 && resultado){
        return (
            <div className="container">
                <div className="row">
                    <Button variant="primary" value={1} onClick={()=>{limpiarDatos()}}>
                        Limpiar
                    </Button>
                </div>
                <div className="row">
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Capital</th>
                            <th>Departamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        { resultado.map(dato=>{
                            //console.log('iterando');
                            //console.log(dato);
                            return(
                                <tr>
                                <td>{dato[0]}</td>
                                <td>{dato[2]}</td>
                                </tr>                        
                            )
                        })
                        }
                    </tbody>
                    </Table>                   
                </div>
            </div>
        );
    }
    else if (reporte===7 && resultado){
        return (
            <div className="container">
                <div className="row">
                    <Button variant="primary" value={1} onClick={()=>{limpiarDatos()}}>
                        Limpiar
                    </Button>
                </div>
                <div className="row">
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Departamento</th>
                            <th>Puesto</th>
                            <th>Salario</th>
                        </tr>
                    </thead>
                    <tbody>
                        { resultado.map(dato=>{
                            //console.log('iterando');
                            //console.log(dato);
                            return(
                                <tr>
                                <td>{dato[3]}</td>
                                <td>{dato[0]}</td>
                                <td>{dato[1]}</td>
                                </tr>                        
                            )
                        })
                        }
                    </tbody>
                    </Table>                   
                </div>
            </div>
        );
    }
    else if (departamentos){

        return (
            <div className="container">
                <div className="row">
                    <div class="row justify-content-md-center"> 
                        <Button variant="primary" value={4} onClick={() =>{regresar()}}>
                            Regresar
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Reporte</th>
                                <th>Opción</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Plantilla global</td>
                            <td>-</td>
                            <td>
                                <Button variant="primary" value={1} onClick={()=>{getPlantillaGlobal()}}>
                                    Ver
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Plantilla por departamento</td>
                            <td>
                                <div className="box-seleccion-puesto">

                                    <Form.Control
                                        as="select"
                                        custom
                                        onChange={(e)=>{setDepartamentoSeleccionado(parseInt(e.target.value, 10))}}
                                        >
                                        <option>Seleccione un departamento</option>
                                        { departamentos.map(dato=>{
                                                return(
                                                    <option 
                                                    value={dato[0]}
                                                    >{dato[1]}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </div>
    
                            </td>
                            <td>
                                <Button variant="primary" value={1} onClick={()=>{getPlantillaIndividual()}}>
                                    Ver
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Top 5 departamentos</td>
                            <td>-</td>
                            <td>
                                <Button variant="primary" value={1} onClick={()=>{getReporteDepartamentos()}}>
                                    Ver
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Top 5 reclutadores</td>
                            <td>-</td>
                            <td>
                                <Button variant="primary" value={1} onClick={()=>{getDemasReportes(4)}}>
                                    Ver
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Top 5 aplicantes</td>
                            <td>-</td>
                            <td>
                                <Button variant="primary" value={1} onClick={()=>{getDemasReportes(5)}}>
                                    Ver
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Top 5 capital</td>
                            <td>-</td>
                            <td>
                                <Button variant="primary" value={1} onClick={()=>{getDemasReportes(6)}}>
                                    Ver
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Máximo salario</td>
                            <td>-</td>
                            <td>
                                <Button variant="primary" value={1} onClick={()=>{getDemasReportes(7)}}>
                                    Ver
                                </Button>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        ); 

    }
       
        

}

export default Reportes;