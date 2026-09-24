// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';  // ← NUEVO

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id} =useParams();
  const navigate =useNavigate();
  const { addToCart } = useCart();  // ← NUEVO

  // 🚨 IMPORTANTE ENTENDERLO 🚨
  // useParams() lee los parámetros de la URL. Si la ruta es
  // '/products/:id', y la URL es '/products/5', entonces
  // useParams() devuelve { id: '5' }.
 // const { id } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Producto no encontrado.');
        } else {
          setError('Error al cargar el producto.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]); // ← 🚨 IMPORTANTE: [id] significa "vuelve a ejecutar
            // este efecto si 'id' cambia". Si el usuario navega de
            // /products/5 a /products/7, el componente se reutiliza
            // pero el efecto vuelve a correr. Sin esto, mostraría
            // el producto viejo.
function handleAddToCart() {
    addToCart(product);
    // Preguntamos al usuario si quiere ir al carrito o seguir comprando
    const irAlCarrito = window.confirm(
      `"${product.name}" agregado al carrito.\n\n¿Ir al carrito ahora?`
    );
    if (irAlCarrito) {
      navigate('/cart');
    }
  }
  


  if (loading) return <p style={{ padding: '20px' }}>Cargando...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;
  if (!product) return null;

  const formatoPrecio = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(product.price);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/products">← Volver al catálogo</Link>

      <h1>{product.name}</h1>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatoPrecio}</p>
      <p>{product.description}</p>
      <p>Categoría: {product.category?.name}</p>
      <p>Stock disponible: {product.stock}</p>

      {/* 🚨 IMPORTANTE ENTENDERLO 🚨
          Deshabilitamos el botón si no hay stock.
          También podríamos deshabilitarlo si el producto
          ya está en el carrito con la cantidad máxima. */}
      <Button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
      </Button>
    </div>
  );
}