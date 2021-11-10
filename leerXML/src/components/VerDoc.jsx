import React,{ useState, useEffect } from "react";
import FileViewer from 'react-file-viewer';
import { useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';

const VerDoc = props => {
    const [ubicacion, setUbicacion] = useState(null);
    const [file, setFile] = useState(null);
    const location = useLocation();
    const [formato,setFormato] = useState(null);
    const history = useHistory();

    const regresar = () =>{
        if (location.state.rol === 3){
            history.push({
                pathname: '/revisionRequisitos',
                search: '?query=abc',
                state: { expediente: location.state.expediente}    
            });
        }else{
            history.push({
                pathname: '/corregirDocumentos',
                search: '?query=abc',
                state: { expediente: location.state.expediente}    
            });            
        }

    }

  
  useEffect(() => {
    console.log(location.state);
    setFile("http://localhost:3001/files/"+location.state.ubicacion);
    setFormato(location.state.formato)
 }, [location]);
  
      
    
if (file && formato){
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
                    <div className="documento">
                        <embed 
                            src={file} 
                            width="100%" 
                            height="100%"
                        />
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

export default VerDoc;