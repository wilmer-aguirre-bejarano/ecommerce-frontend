// src/pages/Orders.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Este useEffect es el patrón que ya conoces (Products, Dashboard),
    // pero aquí carga LAS ÓRDENES DEL USUARIO LOGUEADO.
    // El backend decide qué devolver usando $request->user()->orders(),
    // así que el frontend no necesita filtrar por user_id.
    useEffect(() => {
        async function fetchOrders() {
            try {
                setLoading(true);
                const res = await api.get('/orders');
                setOrders(res.data);
            } catch (err) {
                setError('No se pudieron cargar tus órdenes.');
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const formatoPrecio = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
    });

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Traducir el status de la orden de inglés (backend) a español (UI).
    // Es una práctica común NO mostrar los valores internos al usuario.
    const statusLabels = {
        pending: 'Pendiente',
        paid: 'Pagada',
        shipped: 'Enviada',
        delivered: 'Entregada',
        cancelled: 'Cancelada',
    };

    if (loading) return <p style={{ padding: '20px' }}>Cargando órdenes...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

    if (orders.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Mis Órdenes</h1>
                <p>Aún no tienes órdenes.</p>
                <Link to="/products">
                    <Button>Ver productos</Button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h1>Mis Órdenes</h1>

            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: '#fff',
                color: '#000',
                marginTop: '20px',
            }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        <th style={thStyle}>Orden #</th>
                        <th style={thStyle}>Fecha</th>
                        <th style={thStyle}>Items</th>
                        <th style={thStyle}>Total</th>
                        <th style={thStyle}>Estado</th>
                        <th style={thStyle}></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={tdStyle}>#{order.id}</td>
                            <td style={tdStyle}>
                                {new Date(order.created_at).toLocaleDateString('es-BO')}
                            </td>
                            <td style={tdStyle}>{order.items.length}</td>
                            <td style={tdStyle}>{formatoPrecio.format(order.total)}</td>
                            <td style={tdStyle}>
                                <span style={statusBadgeStyle(order.status)}>
                                    {statusLabels[order.status] || order.status}
                                </span>
                            </td>
                            <td style={tdStyle}>
                                <Link to={`/orders/${order.id}`}>
                                    <Button>Ver detalle</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
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

// Estilo dinámico según el status (colores distintos por estado)
function statusBadgeStyle(status) {
    const colors = {
        pending: { background: '#fff3cd', color: '#856404' },
        paid: { background: '#d4edda', color: '#155724' },
        shipped: { background: '#cce5ff', color: '#004085' },
        delivered: { background: '#d1ecf1', color: '#0c5460' },
        cancelled: { background: '#f8d7da', color: '#721c24' },
    };
    return {
        padding: '4px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        ...(colors[status] || {}),
    };
}