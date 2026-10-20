// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';  // ← NUEVO

export default function Navbar() {
  const { user, logout } = useAuth();
  //const { totalItems } = useCart();  // ← NUEVO
  const { totalItems, clearCart } = useCart();  // ← Añadir clearCart para eli
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    clearCart();          // ← Vaciar el carrito si sierras sesion
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/">Mi E-commerce  </Link>
      <Link to="/portAca">Portafolio Academico</Link>
      <Link to="/products">Productos  </Link>
      {/* 🚨 IMPORTANTE ENTENDERLO 🚨
          El contador solo aparece si hay items.
          Renderizado condicional con &&.
          Si totalItems es 0, no se muestra nada.
          Si es > 0, se muestra el badge con el número. */}
      <Link to="/cart">
        Carrito {totalItems > 0 && `(${totalItems})`}
      </Link>


     {/* <Link to="/cart">Carrito  </Link>* un link inerte(no direcciona a ningun lugar)/}

      {/* 🚨 IMPORTANTE ENTENDERLO 🚨
          Renderizado condicional según el rol.
          'user?.role === "admin"' significa: si user existe
          Y su rol es admin, entonces muestra el enlace.
          El '?.' (optional chaining) evita error si user es null. */}
      {user?.role === 'admin' && (
        <Link to="/admin">Panel Admin</Link>
      )}

      {user ? (
        <>
          <Link to="/orders">Mis Órdenes</Link>
          <span>Hola, {user.name}</span>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
}