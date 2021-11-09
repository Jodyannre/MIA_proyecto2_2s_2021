import React,{ useState, useEffect } from "react";
import FileViewer from 'react-file-viewer';
import { useLocation } from "react-router-dom";
import '../App.css';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';

function Cv() {
  const type = global.cvFormato;
  const history = useHistory();
  const location = useLocation();
  const file = "http://localhost:3001/files/"+location.state.ubicacion;

  const regresar = () =>{
        
    history.push({
        pathname: '/acexpediente',
        search: '?query=abc',
        state: { expediente: location.state.expediente}    
    });
  }

  return (
    <div>
      <div className="row">
          <div class="row justify-content-md-center"> 
              <Button variant="primary" value={4} onClick={() =>{regresar()}}>
                  Regresar
              </Button>
          </div>
      </div>
    <FileViewer
      fileType={type}
      filePath={file}
    />
    </div>
  );    
    

}

export default Cv;