import React,{useState} from 'react';
import LoginForm from './components/LoginForm';
import Game from './components/employee_game';
function App() {
      // Remove this part after making a connection to authentication DB
      const adminUser = {
        email: "admin@admin.com",
        password:"admin"
      }
      // 
      const [user,setUser] = useState({name :"", email: "a"});
      const [error,setError] = useState("");

      const Login = details => {
        if (details.email === adminUser.email && details.password === adminUser.password){
          setUser({
            name: details.name,
            email: details.email
          })    
        } else{
          setError("Details not found !")
        }
      }
      // eslint-disable-next-line
      const Logout = () => {
        setUser({name: "", email: ""});
      }
      return(
        <div className="App">
          {(user.email !== "") ? (
            <Game></Game>
          ) : ( 
            <LoginForm Login={Login} error={error}/>
          )}

        </div>

      );
}

export default App;
