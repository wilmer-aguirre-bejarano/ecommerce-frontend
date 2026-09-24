// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';

export default function ProductCard({ product }) {
  // 🚨 IMPORTANTE ENTENDERLO 🚨
  // En React, los componentes reciben datos por "props".
  // Aquí 'product' es una prop que viene del padre (Products.jsx).
  // Es como pasar un objeto a un Widget de Flutter.
  
  // Formatear el precio con separador de miles
  const formatoPrecio = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(product.price);

  return (
    <Card>
      {/* Imagen del producto o placeholder */}
      {product.image_url ? (
        <img 
          src={product.image_url} 
          alt={product.name}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ 
          width: '100%', 
          height: '200px', 
          background: '#eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999'
        }}>
          Sin imagen
        </div>
      )}

      <h3>{product.name}</h3>
      
      {/* 🚨 IMPORTANTE ENTENDERLO 🚨
          Las llaves {} en JSX permiten insertar expresiones JavaScript.
          Aquí usamos el operador ternario para mostrar la categoría 
          solo si existe (evita error si product.category es null). */}
      <p style={{ fontSize: '12px', color: '#666' }}>
        {product.category?.name || 'Sin categoría'}
      </p>

      <p style={{ fontWeight: 'bold', fontSize: '18px' }}>
        {formatoPrecio}
      </p>

      <p>Stock: {product.stock}</p>

      <Link to={`/products/${product.id}`}>
        <Button>Ver detalles</Button>
      </Link>
    </Card>
  );
}