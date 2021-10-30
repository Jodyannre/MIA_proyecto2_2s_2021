import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Footer, Home, About, Contact, Formulario, CargaMasiva, CrearUsuario } from "./components";


function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/about" exact component={() => <About />} />
          <Route path="/contact" exact component={() => <Contact />} />
          <Route path="/formulario" exact component={() => <Formulario />} />
          <Route path="/cargaMasiva" exact component={() => <CargaMasiva />} />
          <Route path="/crearUsuario" exact component={() => <CrearUsuario />} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;