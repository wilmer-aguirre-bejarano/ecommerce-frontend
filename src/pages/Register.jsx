// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError('Error al registrar. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container" style={{background: '#ffffff', padding: '10px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', animation: 'aparecer 0.5s ease-in-out',margin:'200px'}}>
      <h1 style={{textAlign: 'center', marginBottom: '20px', color: '#333'}}>Crear Cuenta</h1>

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Confirmar Contraseña"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarme'}
        </Button>
      </form>

      <p style={{color:'black'}}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}