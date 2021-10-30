
import './App.css';
import {useAuth0} from '@auth0/auth0-react'


function App() {

  const {loginWithPopup, loginWithRedirect, logout, user, isAuthenticated} = useAuth0();

  return (
    <div className="App">
      <h1> Autentificador</h1>
      <ul>
        <li><button onClick={loginWithPopup}>Login with popup</button></li>
        <li><button onClick={loginWithRedirect}>Login with redirect</button></li>
        <li><button onClick={logout}>logout</button></li>
      </ul>
      <h3>User is { isAuthenticated ? "Logged in" : "Not logged in"}</h3>
      {isAuthenticated &&(
      <pre style={{textAlign: 'start'}}> {JSON.stringify(user,null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
