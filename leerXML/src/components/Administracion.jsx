import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import '../App.css';
import { useHistory } from 'react-router-dom';
const consulta = require('../consultas/consulta');


function Administracion() {

    const history = useHistory();
    const cookies = document.cookie;
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    const tokens = JSON.parse(sessionStorage.getItem('tokens'));
    const [permisoValidado, setPermisoValidado] = useState(null);
    const [tokenValidado, setTokenValidado] = useState(null);
    const [tokenRespuesta, setTokenRespuesta] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);


    const handleClick = e => {

        if (e.target.value === '1'){
            //Crear usuarios
            history.push('/crearUsuario');
        }else if (e.target.value === '2'){
            //Administrar usuarios
            history.push('/administracionUsuario');
        }else if (e.target.value === '3'){
            //Cargar datos
            history.push('/cargaMasiva');
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
   

    useEffect( async() => {  
        try{  
            //--------------------AUTH---------------------------------------------
            verCookies();
            if (tokenRespuesta){
            
            if (document.cookie != ''){
                document.cookie = `token=${tokenRespuesta.token}; max-age=${10}; path=/; samesite=strict;`;
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
                console.log('Tiene permiso.');
            }else{
                setPermisoValidado(false);
                //No permitido
                sessionStorage.removeItem('usuario');
                sessionStorage.removeItem('tokens');
                history.push('/login');
            }
        }
        //-----------------------------------------------------------------


        }catch(error){
            console.log(error);
            history.push('/login');
        }
          
      }, [tokenRespuesta,tokenValidado,permisoValidado]);
    
        return (
            <div className="container">
            <Row className="mb-3">
            <Col md>
            <Button
                variant="primary"
                value = {1}
                disabled={false}
                onClick={handleClick}
                >
                Crear usuarios
            </Button>
            </Col>
            <Col md>
            <Button
                variant="primary"
                value = {2}
                disabled={false}
                onClick={handleClick}
                >
                Administrar usuarios
            </Button>
            </Col>
            <Col md>
            <Button
                variant="primary"
                value = {3}
                disabled={false}
                onClick={handleClick}
                >
                Carga de datos
            </Button>
            </Col>
            </Row>
            </div>
        );              
    
}


export default Administracion;