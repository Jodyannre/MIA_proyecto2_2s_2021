import React,{ useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

let contador = 1;

const VerHistorial = props => {
    const location = useLocation();
    const [documentos, setDocumentos] = useState(null);
    const [id_documento, setId_documento] = useState(null);
    const cookies = document.cookie;
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    const tokens = JSON.parse(sessionStorage.getItem('tokens'));
    const [permisoValidado, setPermisoValidado] = useState(null);
    const [tokenValidado, setTokenValidado] = useState(null);
    const [tokenRespuesta, setTokenRespuesta] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const history = useHistory();

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

    const regresar = () =>{
        contador = 1;
        history.push({
            pathname: '/corregirDocumentos',
            search: '?query=abc',
            state: { expediente: location.state.expediente}    
        });            
    }

  
  useEffect(() => {
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
      if (4 === usuario.rol || 5 === usuario.rol){
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
    if (tokenValidado && permisoValidado){
      //Hacer todo lo de la página
      if (id_documento===null){
        setId_documento(location.state.id_documento);
      }
      if(id_documento){
          getHistorial();
      }
    }
  }catch(error){
    //console.log(error);
    history.push('/login');
  }
 }, [id_documento,tokenRespuesta,tokenValidado,permisoValidado]);



 async function getHistorial () {
    let URL = 'http://localhost:3001/getHistorial';
    const dato = {
      id_documento: id_documento
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
        console.log(res.data);
        setDocumentos(res.data);
      })  
    } catch (err) {
      console.error(err.message);
    }
  };
  
    
if (documentos){
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
                <div class="row justify-content-md-center"> 

            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Motivo</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                { documentos.map(dato=>{
                            return(                             
                                <tbody>
                                  <td>{dato[0]}</td>
                                  <td>{dato[1]}</td>  
                                  <td>{dato[3]}</td>                       
                                </tbody>
                            )
                        })
                    }
              </Table>
                    </div>
                </div>
            </div>
        </div>


      );    

}else{
    return (
        <div className="container">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        );
}

    

}

export default VerHistorial;