import React,{ useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import '../App.css';
import { useHistory } from 'react-router-dom';
import { ValidarToken } from "./Funciones";
const consulta = require('../consultas/consulta');


function Administracion() {

    const history = useHistory();


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
   

    useEffect( async() => {  
        try{
            let tmp = (JSON.parse(localStorage.getItem('usuario'))).nombre;
        }catch(error){
            console.log(error);
            history.push('/login');
        }
          
      }, []);
    
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