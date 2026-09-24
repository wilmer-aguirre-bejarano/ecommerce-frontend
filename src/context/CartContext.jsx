// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

// 🚨 IMPORTANTE ENTENDERLO 🚨
// 1. createContext() crea la "caja". El valor inicial es null
//    porque el valor real lo pondrá el Provider más abajo.
//    Todos los contextos empiezan así.
const CartContext = createContext(null);

export function CartProvider({ children }) {
    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Este estado guarda el carrito completo. Su forma es:
    // [
    //   { id: 1, name: 'Laptop HP', price: 1500, quantity: 2, stock: 10, image_url: null, ... },
    //   { id: 2, name: 'Camiseta', price: 25, quantity: 1, stock: 50, image_url: null, ... }
    // ]
    // 
    // Cada item es una COPIA del producto con un campo extra: 'quantity'.
    // Usamos el id del producto para identificarlos en el array.
    
    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Inicialización "lazy": en lugar de pasar un array vacío,
    // pasamos una función que se ejecuta UNA VEZ para leer
    // localStorage. Si el usuario recarga la página, recuperamos
    // el carrito. Es como persistencia automática.
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (err) {
            return [];
        }
    });

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Este useEffect observa 'cart'. Cada vez que cambia,
    // guarda la nueva versión en localStorage.
    // 
    // Juntos, los dos forman el patrón "persistencia":
    //   - useState lee de localStorage al montar.
    //   - useEffect escribe en localStorage al cambiar.
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // ==========================================
    // FUNCIONES PARA MODIFICAR EL CARRITO
    // ==========================================

    /**
     * Agrega un producto al carrito.
     * Si ya existe, incrementa su quantity.
     * Si no, lo añade con quantity: 1.
     */
    function addToCart(product, quantity = 1) {
        // 🚨 IMPORTANTE ENTENDERLO 🚨
        // Regla de oro en React: NUNCA modifiques el estado directamente.
        // Mal:  cart.push(product)          ❌
        // Bien: setCart([...cart, product]) ✅
        // 
        // Aquí usamos la forma funcional: setCart(prevCart => ...).
        // Es más segura porque siempre trabaja con el estado más
        // reciente, incluso si hay varias actualizaciones seguidas.
        setCart((prevCart) => {
            // Buscamos si el producto ya está en el carrito
            const existingItem = prevCart.find((item) => item.id === product.id);

            if (existingItem) {
                // Si existe, actualizamos su cantidad.
                // .map() crea un array NUEVO (no muta el original).
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Si no existe, lo añadimos con quantity.
                // El spread {...product} copia todas sus propiedades.
                return [...prevCart, { ...product, quantity }];
            }
        });
    }

    /**
     * Elimina un producto del carrito por completo.
     */
    function removeFromCart(productId) {
        // .filter() devuelve un array NUEVO sin el item.
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }

    /**
     * Cambia la cantidad de un producto.
     * Si quantity es 0 o menos, elimina el producto.
     */
    function updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    }

    /**
     * Vacía el carrito completamente.
     */
    function clearCart() {
        setCart([]);
    }

    // ==========================================
    // VALORES DERIVADOS (calculados del carrito)
    // ==========================================

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Los valores derivados NO son estado. Se calculan a partir
    // del estado existente. NO uses useState para ellos.
    // 
    // Si el carrito cambia, estos se recalculan automáticamente
    // en el siguiente render. Esa es la magia de React.
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // El Provider expone TODO lo que quieras que otros componentes
    // puedan usar. Solo lo que esté en 'value' es accesible desde
    // el hook useCart(). Si olvidas algo aquí, useCart() no lo verá.
    return (
        <CartContext.Provider
            value={{
                cart,
                totalItems,
                totalPrice,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// 🚨 IMPORTANTE ENTENDERLO 🚨
// Hook personalizado. En lugar de que cada componente haga:
//   import { useContext } from 'react';
//   import { CartContext } from '../context/CartContext';
//   const cart = useContext(CartContext);
// 
// Hace simplemente:
//   import { useCart } from '../context/CartContext';
//   const cart = useCart();
// 
// Es azúcar sintáctico. El error personalizado ayuda a detectar
// cuando alguien usa useCart() fuera del Provider.
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider');
    }
    return context;
}