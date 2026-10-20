// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductsDetail';
import Dashboard from './pages/Admin/Dashboard';
import PortAca from './pages/PortAcademico';
import ProductForm from './pages/Admin/ProductForm';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';

// Componente para proteger rutas
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;
  return user ? children : <Navigate to="/login" />;
}
// 🚨 IMPORTANTE ENTENDERLO 🚨
// Este componente protege rutas. Si no hay usuario, redirige a login.
// Si el usuario existe pero no es admin, redirige al home.
function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) return <p>Cargando...</p>;
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <Navigate to="/" />;
    
    return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/portAca" element={<PortAca/>}/>
        {/*Rutas solo para admin */}
        <Route path="/admin" element={<AdminRoute>  <Dashboard/> </AdminRoute>} />
        <Route path="/admin/products/new" element={<AdminRoute> <ProductForm/></AdminRoute>} />
        <Route path="/admin/products/:id/edit" element={<AdminRoute> <ProductForm/>  </AdminRoute>} />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
                <Orders />
            </PrivateRoute>
          }
        />
        <Route
            path="/orders/:id"
            element={
                <PrivateRoute>
                    <OrderDetail />
                </PrivateRoute>
            }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

