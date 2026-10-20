// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al montar la app, verifica si hay un usuario guardado
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  async function login(email, password, captchaText, captchaKey) {
    const response = await api.post('/login', { email, password, captcha_text: captchaText,captcha_key: captchaKey});
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  }

  // Registro
  async function register(name, email, password, password_confirmation) {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  }

  // Logout
  async function logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error al hacer logout:', error);
    } finally {
      // 3. Esto se ejecuta siempre: Limpia el navegador pase lo que pase en el servidor
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}