import React, {useState} from 'react'
import './../style/LoginForm.css';

function LoginForm({Login,error}) {
    const [details, setDetails] = useState({name:"", email:"", password:"",});

    const submitHandler = e =>{
        e.preventDefault();
        Login(details);
    }
    return (
        <form onSubmit={submitHandler}>
            <div className='box-form'>
                <div className="left">
                    <div className="overlay">
                        <h1>WareHouse Royale</h1>
                        <span>
                        <p>Let's Trade!</p>	
                        </span>
                    </div>
                </div>
        
                <div className='right'>
                    <div className="content">
                        Login
                    </div>

                    <div className='inputs'>
                        <input placeholder='username' className='user_name' type="email" name="email" id="email"onChange={e =>setDetails({...details, email: e.target.value})} value={details.email}/>
                        <input placeholder='password' className='password' type="password" name="password" id="password"onChange={e =>setDetails({...details, password: e.target.value})} value={details.password}/>
                    </div>
                    {(error != null) ? (<div className='error'>{error}</div>) : ""}
                    <div className='button_div'>
                        <input className='ibutton' type="submit" value="LOGIN"/>
                    </div>

                </div>
            </div>
        </form>
    )
}

export default LoginForm