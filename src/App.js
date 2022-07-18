import React,{useState} from 'react';
import LoginForm from './components/LoginForm';

function App() {
      // Remove this part after making a connection to authentication DB
      const adminUser = {
        email: "admin@admin.com",
        password:"admin"
      }
      // 
      const [user,setUser] = useState({name :"", email: ""});
      const [error,setError] = useState("");

      const Login = details => {
        if (details.email == adminUser.email && details.password == adminUser.password){
          setUser({
            name: details.name,
            email: details.email
          })    
        } else{
          setError("Details not found !")
        }
      }
      const Logout = () => {
        setUser({name: "", email: ""});
      }
      return(
        <div className="App">
          {(user.email != "") ? (
            // put a link to a dashborad, and remove the "Welcome" part 
            <div className="welcome">
              <h2>Welcome,<span>{user.name}</span></h2>
              <button onClick={Logout}>Logout</button>
              </div>
          ) : ( 
            <LoginForm Login={Login} error={error}/>
          )}

        </div>

      );
}

export default App;
