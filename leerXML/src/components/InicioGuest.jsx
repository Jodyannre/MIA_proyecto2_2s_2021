import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import '../App.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Rating from '@mui/material/Rating';
const FilterableTable = require('react-filterable-table');


let data = [];
let diccionario = [];

// Fields to show in the table, and what object properties in the data they bind to
const fields = [
	{ name: 'salario', displayName: "Salario", inputFilterable: true, sortable: true },
	{ name: 'categoria', displayName: "Categoría", inputFilterable: true, exactFilterable: false, sortable: true },
	{ name: 'departamento', displayName: "Departamento", inputFilterable: true, exactFilterable: false, sortable: true },
  { name: 'puesto', displayName: "Puesto", inputFilterable: true, exactFilterable: false, sortable: true },
  { name: 'puntuacion', displayName: "Puntuación", inputFilterable: true, exactFilterable: false, sortable: true },
  { name: 'aplicar', displayName: "", inputFilterable: true, exactFilterable: false, sortable: true }
];



function InicioGuest() {
    const [puestos,setPuestos] = useState(null);
    const [categorias,setCategorias] = useState(null);
    const [puestosCargados, setPuestosCargados] = useState(false);
    const [puestoSeleccionado, setPuestoSeleccionado] = useState(null);
    const history = useHistory();
    const [show,setShow] = useState(false);
    const [contador, setContador] = useState(0);
    //const [diccionario, setDiccionario] = useState([]);
    //const [data, setData] = useState([]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 2000,
        autoplaySpeed: 5000,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        search: true
      };


      const aplicar  = (id,puesto) => {
        diccionario = [];
        data = [];
        history.push({
          pathname: '/formulario',
          state: { id: id, puesto:puesto}
        });     
      };

      const actualizarCalificacion = (puesto,calificacion) => {
        console.log(calificacion);
      }

      const abrirFormulario = (puesto)=>{
        setPuestoSeleccionado(puesto);
        history.push('/formulario');

      }

      async function getDatosCarrusel () {
        let URL = 'http://localhost:3001/getDatosCarrusel';
        try {
          return axios.get(URL)
          .then((res) => {
            console.log('se cargo.')
            console.log(res);
            setPuestos(res);
          })  
        } catch (err) {
          console.error(err.message);
        }
      };

      async function getCategoriasCarrusel () {
        let URL = 'http://localhost:3001/getCategoriasCarrusel';
        try {
          return axios.get(URL)
          .then((res) => {
            console.log('se cargo.')
            //console.log(res);
            setCategorias(res);
          })  
        } catch (err) {
          console.error(err.message);
        }
      };



      useEffect( async() => { 
          if (puestos === null && categorias===null){
              await getDatosCarrusel();
              await getCategoriasCarrusel();
          }else if (puestos && categorias){
              setPuestosCargados(true);
              //Recorrerlos y contruir la data
              puestos.data.map(dato=>{
                let nuevo = {
                  salario: <div onClick={()=>{console.log(dato[0]);}}>{dato[3]}</div>,
                  categoria:'',
                  departamento: dato[5],
                  puntuacion: 
                              <Rating
                                name="simple-controlled"
                                value={dato[8]}
                                onChange={(event,newValue) => {
                                  actualizarCalificacion(dato[0],newValue);
                                }}
                              />,
                  puesto: dato[1],
                  aplicar:<Button variant="primary" value={0} onClick={(e)=>{aplicar(dato[0],dato[1])}} >
                  Aplicar
                  </Button>,
                  id: dato[0]
                }
                data.push(nuevo);
                diccionario[nuevo.id] = nuevo;
              });
              categorias.data.map(dato=>{
                //Ir agregando las categorías a cada uno
                if (diccionario[dato[0]].categoria === ''){
                  diccionario[dato[0]].categoria = diccionario[dato[0]].categoria+dato[3];
                }else{
                  diccionario[dato[0]].categoria = diccionario[dato[0]].categoria+','+dato[3];
                }
                
              });
          }
 
      }, [puestos,categorias]);


      if (puestosCargados===false){
        return (
            <div className="container">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            );
      }else{
        return (
            <div class="container">
                <div class="row">
                    <div class="row justify-content-md-center"> 
                        <h3>Guest</h3>
                    </div>
                </div>
                    <div class="row">
                      <div class="row justify-content-md-center">      
                        <div className="carrusel">
                          
                            <Slider {...settings}>
                                { puestos.data.map(dato=>{
                                    if(contador < 6){
                                      return(
                                        <div className="container-imagen" onClick={()=>{abrirFormulario(dato); setContador(contador+1);}}>
                                            {dato[2]==='no'? <img src="https://3.bp.blogspot.com/-tLzXde3LxFQ/XK0apb6KbDI/AAAAAAAAAAc/oNvgEjoehrcnJcGaXFsAPAse-W1WhUiRACLcBGAs/s640/descarga.png" />:<img src={dato[2]} />}
                                            Departamento: {dato[5]} || {"\n"} Salario: Q.{dato[3]} || Puesto: {dato[1]}
                                        </div>
                                    )
                                    }else{
                                      return{}
                                    }
                                    })
                                }
                            </Slider>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="row justify-content-md-center">   
                        <div style={{ height: 400, width: '100%' }}>
                        <h3>Puestos disponibles</h3>
                          <FilterableTable
                            namespace="People"
                            initialSort="Salario"
                            data={data}
                            fields={fields}
                            noRecordsMessage="No hay datos para mostrar"
                            noFilteredRecordsMessage="No hay coincidencias!"
                          />
                        </div> 
                      </div>
                    </div>
                  </div>
          );


      }
      
}

export default InicioGuest;