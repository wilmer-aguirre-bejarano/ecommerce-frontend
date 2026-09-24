// src/pages/Cart.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

export default function Cart() {
    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Aquí ves la magia del contexto en acción. En lugar de recibir
    // todo por props, el componente simplemente "pide" lo que necesita
    // al contexto con useCart(). Nada más.
    const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

     // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Estados locales SOLO para el proceso de checkout.
    // No confundir con el estado del carrito (que está en el contexto).
    // 'processing' → muestra "Procesando..." mientras se crea la orden
    // 'error'      → muestra el mensaje si algo falla (ej: stock insuficiente)
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const formatoPrecio = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
    });

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // handleCheckout es la función que cierra el ciclo de compra:
    //  1. Prepara el payload (SOLO product_id y quantity, NUNCA precio).
    //  2. Envía POST /orders.
    //  3. Si funciona → limpia el carrito y navega a /orders/{id}.
    //  4. Si falla → muestra el error (ej: "Stock insuficiente...").
    async function handleCheckout() {
        setError('');
        setProcessing(true);

        // Mapeamos el carrito al formato que espera la API.
        // El carrito tiene { id, name, price, quantity, ... } pero
        // la API solo acepta { product_id, quantity }. La conversión
        // es explícita para que quede claro qué se envía.
        const payload = {
            items: cart.map((item) => ({
                product_id: item.id,     // ← 'id' del carrito → 'product_id' de la API
                quantity: item.quantity,
            })),
        };
        try {
            const res = await api.post('/orders', payload);
            const order = res.data.order;
            
            // Vaciar el carrito tras una compra exitosa
            clearCart();
            
            // Navegar al detalle de la orden recién creada
            navigate(`/orders/${order.id}`);
        } catch (err) {
            // 🚨 IMPORTANTE ENTENDERLO 🚨
            // El backend devuelve errores de validación en:
            //   err.response.data.errors = { items: ["Stock insuficiente..."] }
            // Aquí los extraemos y mostramos al usuario.
            if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al procesar la compra. Intenta de nuevo.');
            }
        } finally {
            setProcessing(false);
        }
    }

    // Renderizado condicional: carrito vacío
    if (cart.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Tu carrito está vacío</h1>
                <p>Explora el catálogo y añade productos.</p>
                <Link to="/products">
                    <Button>Ver productos</Button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h1>Carrito de compras</h1>
            <p>{totalItems} producto(s) en tu carrito</p>

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
                        <th style={thStyle}>Precio</th>
                        <th style={thStyle}>Cantidad</th>
                        <th style={thStyle}>Subtotal</th>
                        <th style={thStyle}></th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={tdStyle}>{item.name}</td>
                            <td style={tdStyle}>{formatoPrecio.format(item.price)}</td>
                            <td style={tdStyle}>
                                {/* 
                                🚨 IMPORTANTE ENTENDERLO 🚨
                                Botones + / - para cambiar cantidad.
                                Cada clic llama a updateQuantity con
                                el nuevo valor. La resta se calcula
                                desde el item.quantity actual.
                                */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        style={qtyButtonStyle}
                                    >
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={qtyButtonStyle}
                                        disabled={item.quantity >= item.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td style={tdStyle}>
                                {formatoPrecio.format(item.price * item.quantity)}
                            </td>
                            <td style={tdStyle}>
                                <Button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ background: '#dc3545' }}
                                >
                                    Eliminar
                                </Button>
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
                            {formatoPrecio.format(totalPrice)}
                        </td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '20px',
                gap: '10px',
            }}>

                <Button
                    onClick={clearCart}
                    disabled={processing}
                    style={{ background: '#6c757d' }}
                >
                    Vaciar carrito
                </Button>
                {error && (
                    <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>
                )}
                
                <Button
                    onClick={handleCheckout}
                    disabled={processing}
                >
                    {processing ? 'Procesando...' : 'Proceder al pago'}
                </Button>
            </div>
        </div>
    );
}

// Estilos reutilizables
const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ccc',
};

const tdStyle = {
    padding: '10px 12px',
};

const qtyButtonStyle = {
    padding: '4px 10px',
    fontSize: '16px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#fff',
    color: '#000',
};