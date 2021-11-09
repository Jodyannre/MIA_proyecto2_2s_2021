import axios from 'axios';
const consulta = require('../consultas/consulta');

export async function ValidarToken() {
    //Hacer los métodos para validar o crear un nuevo token
    //Recuperar los valores guardados de los tokens y el usuario
    const token = document.cookie.replace('token=','');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    /*
    console.log('cookie');
    console.log(token);
    console.log('Del localStorate');
    console.log(usuario);
    console.log(tokens);
    */
    if (token === ''){
        //El token expiro pedir otro
        const respuesta = await consulta.crearToken(usuario.nombre,usuario.contraseña,tokens.refresh);
        console.log(respuesta);
    }else{
        const respuesta = {
            session: true
        }
        return respuesta;
    }


    return true;
}


export async function ValidarPermiso(pagina) {
    //Hacer los métodos para validar o crear un nuevo token
    //Recuperar los valores guardados de los tokens y el usuario
    const token = document.cookie.replace('token=','');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (pagina === usuario.rol){
        return true;
    }else{
        return false;
    }
}
  