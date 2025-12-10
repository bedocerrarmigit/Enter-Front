import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../Servicios/authService';
import style from './login.module.css'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginRequest(username, password);

      const { token, nombreCompleto, rol } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({ nombreCompleto, rol })
      );

      
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className={style.contenedorLogin}>
      <div className={style.loginBox}>
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <label>Correo electrónico / Usuario</label>
          <input
            type="text"
            placeholder="Ingresa tu correo electrónico o usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Iniciar Sesión</button>

          {error && (
            <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
