import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Footer, Home, About, Contact, Formulario, 
  CargaMasiva, CrearUsuario, AdminitracionUsuario,AdministracionPlantilla, Acexpediente, 
  Cv, RequisitosAplicante,InicioAplicante, EditarExpedienteAplicante, InicioGuest,
  RevisionRequisitos, VerDoc, CorregirDocumentos, Login, Administracion } from "./components";

  //global.login = 'CarlogG';
  //6789456218542
  global.login = '6789456218542';
  global.cvUbicacion = '2';
  global.cvFormato = '3';
  global.expedienteActual = '6789456218542';
  global.Req_ap_anterior = 0;
  global.documentoVer = '';

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <InicioGuest />} />
          <Route path="/login" exact component ={() => <Login />} /> 
          <Route path="/formulario" exact component={() => <Formulario />} />
          <Route path="/cargaMasiva" exact component={() => <CargaMasiva />} />
          <Route path="/crearUsuario" exact component={() => <CrearUsuario />} />
          <Route path="/administracionUsuario" exact component ={() => <AdminitracionUsuario />} />
          <Route path="/administracionPlantilla" exact component ={() => <AdministracionPlantilla />} />
          <Route path="/acexpediente" exact component ={() => <Acexpediente />} />
          <Route path="/cv" exact component ={() => <Cv />} />
          <Route path="/requisitosAplicante" exact component ={() => <RequisitosAplicante />} />
          <Route path="/inicioAplicante" exact component ={() => <InicioAplicante />} />
          <Route path="/editarExpedienteAplicante" exact component ={() => <EditarExpedienteAplicante />} />   
          <Route path="/inicioGUest" exact component ={() => <InicioGuest />} />        
          <Route path="/revisionRequisitos" exact component ={() => <RevisionRequisitos />} /> 
          <Route path="/verDoc" exact component ={() => <VerDoc />} /> 
          <Route path="/corregirDocumentos" exact component ={() => <CorregirDocumentos />} /> 
          <Route path="/administracion" exact component ={() => <Administracion />} /> 

        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;