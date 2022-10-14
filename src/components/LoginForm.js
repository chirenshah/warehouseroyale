import { useState } from 'react';
import Container from '@mui/system/Container';
// Css
import './../style/LoginForm.css';

function LoginForm({ Login, error }) {
  const [details, setDetails] = useState({ name: '', email: '', password: '' });

  const submitHandler = (e) => {
    e.preventDefault();
    Login(details);
  };

  return (
    <div className="loginForm">
      <Container>
        <form onSubmit={submitHandler}>
          <div className="loginForm__box">
            <div className="loginForm__left">
              <div className="loginForm__overlay"></div>
              <div className="loginForm__title">
                <h1>WareHouse Royale</h1>
                <h4>Let's Trade!</h4>
              </div>
            </div>

            <div className="loginForm__right">
              <h1>Login</h1>
              <div className="loginForm__inputs">
                <input
                  placeholder="username"
                  className="user_name"
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) =>
                    setDetails({ ...details, email: e.target.value })
                  }
                  value={details.email}
                />
                <input
                  placeholder="password"
                  className="password"
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) =>
                    setDetails({ ...details, password: e.target.value })
                  }
                  value={details.password}
                />
              </div>
              {error != null ? (
                <div className="loginForm__error">{error}</div>
              ) : (
                ''
              )}
              <div className='submitButton'>
              <input
                className="loginForm__button"
                type="submit"
                value="LOGIN"
              />
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default LoginForm;