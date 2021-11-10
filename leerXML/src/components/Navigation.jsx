import React from "react";
import { Link, withRouter } from "react-router-dom";

function Navigation(props) {
  return (
    <div className="navigation">
      <nav class="navbar navbar-expand navbar-dark bg-dark">
        <div class="container">
          <Link class="navbar-brand" to="/">
            Sistema
          </Link>

          <div>
            <ul class="navbar-nav ml-auto">
              <li
                class={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/inicioGuest">
                  Guest
                  <span class="sr-only">(current)</span>
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/login" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/login">
                  Login
                </Link> 
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/administracion" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/administracion">
                  Adminitracion
                </Link> 
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/acexpediente" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/acexpediente">
                  Revisión
                </Link> 
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/administracionPlantilla" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/administracionPlantilla">
                  Coordinación
                </Link> 
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/inicioAplicante" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/inicioAplicante">
                  InicioAplicante
                </Link> 
              </li>

              <li
                class={`nav-item  ${
                  props.location.pathname === "/reportes" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/reportes">
                  Reportes
                </Link> 
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);