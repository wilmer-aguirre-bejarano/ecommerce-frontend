// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';  // ← NUEVO
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 🚨 IMPORTANTE ENTENDERLO 🚨
        El orden de los Providers importa si uno depende del otro.
        AuthProvider y CartProvider son independientes aquí,
        pero el orden es: Auth afuera, Cart adentro.
        Ambos envuelven a TODA la app, así que cualquier
        componente puede usar useAuth() o useCart(). */}
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
)
