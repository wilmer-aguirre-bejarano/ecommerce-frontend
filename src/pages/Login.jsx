// src/pages/Login.jsx
import { useState, useEffect} from 'react';//Anadimos useEffect
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../api/axios';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [intentos, setIntentos]= useState(0);//contador de intentos

    // --- NUEVOS ESTADOS PARA EL CAPTCHA LOCAL ---
  const [captchaImg, setCaptchaImg] = useState('');
  const [captchaKey, setCaptchaKey] = useState('');
  const [captchaText, setCaptchaText] = useState('');
 
  // Función para pedir un captcha nuevo al servidor
  async function cargarCaptcha() {
    try {
      // Apuntamos al puerto de tu Laravel + el prefijo correcto de la API
      const res = await api.get('/captcha-nuevo');
      setCaptchaImg(res.data.img); // Imagen Base64
      setCaptchaKey(res.data.key); // Clave de validación
      setCaptchaText('');          // Limpia el input anterior
    } catch (err) {
      console.error("Error cargando el captcha", err);
    }
  }

  // Cargar el captcha apenas se monte el formulario
  useEffect(() => {
    cargarCaptcha();
  }, []);


  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
   
    try {
      //Pasamos las credenciales junto com el texto y la llave del captcha
      await login(email, password, captchaText, captchaKey);
      setIntentos(0);//si inicia sesion
      navigate('/'); // Redirige al home
    } catch (err) {
      //aumentar intentos
      setIntentos(intentos + 1);
      cargarCaptcha(); //SI FALLA EL LOGIN, CAMBIA EL CAPTCHA POR SEGURIDAD
      if (err.response?.data?.errors) {
        // Laravel devuelve errores de validación en formato { errors: { campo: [msg] } }
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else if (err.response?.data?.message) {
         setError(err.response.data.message);
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container" style={{background: '#f4e7e7', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', animation: 'aparecer 0.5s ease-in-out',margin:'200px'}}>
      <h1 style={{textAlign: 'center', marginBottom: '20px', color: '#333'}}>Iniciar Sesión</h1>

      <form onSubmit={handleSubmit}>
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


        {/* --- COMPONENTE DEL CAPTCHA LOCAL --- */}
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          {captchaImg && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <img src={captchaImg} alt="Captcha" style={{ borderRadius: '5px' }} />
              <button type="button" onClick={cargarCaptcha} style={{ background: '#0c0e0c', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' }}>
                🔄 Actualizar
              </button>
            </div>
          )}
          <Input
            type="text"
            label="Escribe lo de la imagen"
            value={captchaText}
            onChange={(e) => setCaptchaText(e.target.value)}
            required
          /> 
        </div>

        {error && <p className="error-message" style={{color:'red', fontWeight:'bold'}}>{error}</p>}

        {intentos >= 3? (

          <p style={{color:'red', fontWeight:'bold', textAlign:'center'}}>
            Bloqueado por demasiados intentos!!
          </p>
        ) : (
          <Button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        )}

      </form>
      
      <p style={{color:'black'}}>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
}
