// src/pages/OrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';

export default function OrderDetail() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        async function fetchOrder() {
            try {
                setLoading(true);
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError('No tienes permiso para ver esta orden.');
                } else if (err.response?.status === 404) {
                    setError('Orden no encontrada.');
                } else {
                    setError('Error al cargar la orden.');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [id]);

    const formatoPrecio = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
    });

    if (loading) return <p style={{ padding: '20px' }}>Cargando...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;
    if (!order) return null;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/orders">← Volver a mis órdenes</Link>

            <h1>Orden #{order.id}</h1>
            <p>Fecha: {new Date(order.created_at).toLocaleString('es-BO')}</p>
            <p>Estado: <strong>{order.status}</strong></p>

            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: '#fff',
                color: '#000',
                marginTop: '20px',
            }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        <th style={thStyle}>Producto</th>
                        <th style={thStyle}>Precio unitario</th>
                        <th style={thStyle}>Cantidad</th>
                        <th style={thStyle}>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={tdStyle}>{item.product?.name || '(producto eliminado)'}</td>
                            <td style={tdStyle}>{formatoPrecio.format(item.price)}</td>
                            <td style={tdStyle}>{item.quantity}</td>
                            <td style={tdStyle}>
                                {formatoPrecio.format(item.price * item.quantity)}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }}>
                            Total:
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', fontSize: '18px' }}>
                            {formatoPrecio.format(order.total)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ccc',
};

const tdStyle = {
    padding: '10px 12px',
};