import React,{useState} from 'react';
import LoginForm from './components/LoginForm';
import Game from './components/employee_game';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { emailPasswordAuth } from './Database/Auth';
function App() {
      const [user,setUser] = useState(null);
      const [error,setError] = useState(null);
      if(!user && window.localStorage.admin){
        setUser(window.localStorage.admin)
      }
      const Login = details => {
        emailPasswordAuth(details.email,details.password,setUser,setError)
    }
      // eslint-disable-next-line
      const Logout = () => {
        setUser("");
      }
      return(
        <div className="App">
          { user ? (
            <DndProvider backend={HTML5Backend}><Game/></DndProvider>
          ) : ( 
            <LoginForm Login={Login} error={error}/>
          )}

        </div>

      );
}

export default App;
