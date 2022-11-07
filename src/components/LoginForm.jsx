import { useState } from 'react';
// Hooks
import useLogin from '../hooks/useLogin';
// Material components
import Container from '@mui/system/Container';
// Components
import WarehouseSnackbar from './ui/WarehouseSnackbar';
import WarehouseButton from './ui/WarehouseButton';
// Css
import './../style/LoginForm.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isPending, error } = useLogin();

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
              {error && <WarehouseSnackbar text={error} />}
              <WarehouseButton
                className="loginForm__button"
                type="submit"
                text="LOGIN"
                loading={isPending}
              />
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default LoginForm;
