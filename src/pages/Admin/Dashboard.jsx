//Panel principal con lista de productos
// src/pages/Admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/Button.jsx';

export default function Dashboard() {
    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // PATRÓN 1: Los tres estados base que verás en TODA página
    // que carga datos de una API:
    //   - data:    los datos que vienen del backend
    //   - loading: si la petición está en curso
    //   - error:   mensaje si algo falla
    // Memoriza este patrón. Lo usarás en cada página.
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // PATRÓN 2: useEffect que carga datos al montar.
    // El [] al final significa "solo una vez, al montar".
    // 
    // La función 'fetchProducts' la extraigo aparte (no la meto
    // directamente en useEffect) porque la quiero reutilizar
    // después de eliminar un producto, para refrescar la lista.
    async function fetchProducts() {
        try {
            setLoading(true);
            const res = await api.get('/products');
            setProducts(res.data);
            setError('');
        } catch (err) {
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Función para eliminar un producto.
    // Aquí NO usamos useEffect porque esta acción la dispara
    // el usuario (clic en un botón), no el montaje del componente.
    // 
    // Regla de oro:
    //   - useEffect → peticiones automáticas al montar/cambiar.
    //   - Funciones normales → peticiones disparadas por el usuario.
    async function handleDelete(productId, productName) {
        // window.confirm devuelve true/false. Es una forma simple
        // de pedir confirmación sin construir un modal.
        const confirmado = window.confirm(
            `¿Seguro que quieres eliminar "${productName}"?`
        );
        
        if (!confirmado) return;

        try {
            await api.delete(`/products/${productId}`);
            // 🚨 IMPORTANTE ENTENDERLO 🚨
            // Después de eliminar, refrescamos la lista llamando
            // de nuevo a fetchProducts. Esto evita tener que
            // manipular el estado manualmente.
            // 
            // Alternativa (más avanzada, la verás después):
            //   setProducts(products.filter(p => p.id !== productId));
            // Ambas formas son válidas. Esta segunda es más "React",
            // pero la primera es más simple y confiable.
            await fetchProducts();
        } catch (err) {
            alert('Error al eliminar el producto. Intenta de nuevo.');
        }
    }

    // Formateador de precio reutilizable
    const formatoPrecio = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
    });

    // Renderizado condicional según estado
    if (loading) return <p style={{ padding: '20px' }}>Cargando productos...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
            }}>
                <h1>Panel de Administración</h1>
                
                {/* Link que envuelve un Button para navegar */}
                <Link to="/admin/products/new">
                    <Button>+ Crear Producto</Button>
                </Link>
            </div>

            {products.length === 0 ? (
                <p>No hay productos. Crea el primero.</p>
            ) : (
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    background: '#fff',
                    color: '#000',
                }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Nombre</th>
                            <th style={thStyle}>Categoría</th>
                            <th style={thStyle}>Precio</th>
                            <th style={thStyle}>Stock</th>
                            <th style={thStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 🚨 IMPORTANTE ENTENDERLO 🚨
                            PATRÓN 3: .map() para listas. La prop 'key'
                            es OBLIGATORIA. Sin ella, React lanza warning
                            y el rendimiento se degrada al actualizar. */}
                        {products.map((product) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={tdStyle}>{product.id}</td>
                                <td style={tdStyle}>{product.name}</td>
                                <td style={tdStyle}>
                                    {product.category?.name || 'Sin categoría'}
                                </td>
                                <td style={tdStyle}>
                                    {formatoPrecio.format(product.price)}
                                </td>
                                <td style={tdStyle}>{product.stock}</td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Link to={`/admin/products/${product.id}/edit`}>
                                            <Button>Editar</Button>
                                        </Link>
                                        
                                        {/* 
                                        🚨 IMPORTANTE ENTENDERLO 🚨
                                        Aquí ves un patrón clave de React:
                                        para pasar parámetros a una función
                                        en un onClick, la envuelves en una
                                        arrow function. Si escribieras
                                        onClick={handleDelete(product.id)} 
                                        se ejecutaría INMEDIATAMENTE al 
                                        renderizar, no al hacer clic.
                                        */}
                                        <Button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            style={{ background: '#dc3545' }}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// Estilos reutilizables para las celdas
// Los saco afuera del componente para no recrearlos en cada render
const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ccc',
};

const tdStyle = {
    padding: '10px 12px',
};