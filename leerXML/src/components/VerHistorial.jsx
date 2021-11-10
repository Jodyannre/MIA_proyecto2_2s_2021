import React,{ useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

let contador = 1;

const VerHistorial = props => {
    const location = useLocation();
    const history = useHistory();
    const [documentos, setDocumentos] = useState(null);
    const [id_documento, setId_documento] = useState(null);

    const regresar = () =>{
        contador = 1;
        history.push({
            pathname: '/corregirDocumentos',
            search: '?query=abc',
            state: { expediente: location.state.expediente}    
        });            
    }

  
  useEffect(() => {
      if (id_documento===null){
        setId_documento(location.state.id_documento);
      }
    if(id_documento){
        getHistorial();
    }
 }, [id_documento]);



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
                                  <td>{dato[2]}</td>                       
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