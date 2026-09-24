// src/pages/Products.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  // 🚨 IMPORTANTE ENTENDERLO 🚨
  // useState(estadoInicial) devuelve un array de 2 elementos:
  //   [0] = el valor actual del estado
  //   [1] = la función para actualizarlo
  // Es el equivalente a setState en Flutter.
  const [products, setProducts] = useState([]);      // Lista de productos
  const [loading, setLoading] = useState(true);      // ¿Estamos cargando?
  const [error, setError] = useState(null);          // ¿Hubo error?

  // 🚨 IMPORTANTE ENTENDERLO 🚨
  // useEffect se ejecuta DESPUÉS del render. Sirve para "efectos
  // secundarios": llamar APIs, suscribirse a eventos, modificar
  // el DOM. El array [] al final significa "solo ejecútalo UNA VEZ,
  // cuando el componente se monta por primera vez".
  //
  // Es el equivalente a initState() en Flutter.
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // axios.get devuelve una promesa. 'await' espera la respuesta.
        // res.data es el JSON que devolvió Laravel.
        const res = await api.get('/products');
        setProducts(res.data); // Actualiza el estado → React re-renderiza
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. Intenta de nuevo.');
      } finally {
        // 'finally' se ejecuta tanto si funciona como si falla.
        // Siempre queremos quitar el "loading".
        setLoading(false);
      }
    }

    fetchProducts();
  }, []); // ← Las dependencias vacías significan "una sola vez"

  // 🚨 IMPORTANTE ENTENDERLO 🚨
  // React re-renderiza el componente cada vez que un estado cambia.
  // Estas condiciones permiten mostrar diferentes vistas según
  // el estado actual SIN recargar la página.
  if (loading) {
    return <p style={{ padding: '20px' }}>Cargando productos...</p>;
  }

  if (error) {
    return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;
  }

  if (products.length === 0) {
    return <p style={{ padding: '20px' }}>No hay productos disponibles.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Catálogo de Productos</h1>

      {/* 🚨 IMPORTANTE ENTENDERLO 🚨
          .map() transforma el array de productos en un array de 
          componentes <ProductCard>. React puede renderizar arrays.
          La prop 'key' es OBLIGATORIA cuando haces .map() para que
          React identifique cada elemento. Usa un ID único. */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
      }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
