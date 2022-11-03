import { useState } from 'react';
import useLogin from '../hooks/useLogin';
import Container from '@mui/system/Container';
// Css
import './../style/LoginForm.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Put validation checks

    await login(email, password);
  };

  return (
    <div className="loginForm">
      <Container>
        <form onSubmit={handleSubmit}>
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
                  placeholder="Email address"
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <input
                  placeholder="password"
                  className="password"
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              {/* {error != null ? (
                <div className="loginForm__error">{error}</div>
              ) : (
                ''
              )} */}
              <input
                className="loginForm__button"
                type="submit"
                value="LOGIN"
              />
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default LoginForm;
