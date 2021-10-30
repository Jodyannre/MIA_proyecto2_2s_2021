import React from 'react';
import {Auth0Provider, Autho0Provider} from '@auth0/auth0-react'

export default function autentificador ({}){

    return (
        <Auth0Provider
            domain='joddie.us.auth0.com'
            clientId='LGqojFo5EIQbt67uBeFVsk33ZObnp3gP'
            redirectUri={window.location.origin}
        >
            
        </Auth0Provider>
    )
}



