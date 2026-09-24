// src/pages/Admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';

export default function ProductForm() {
    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // useParams() lee los parámetros de la URL.
    // Si la ruta es '/admin/products/:id/edit', y la URL es '/admin/products/5/edit',
    // entonces { id: '5' }. Si la ruta es '/admin/products/new' (sin :id),
    // entonces id será undefined, y sabremos que estamos CREANDO.
    const { id } = useParams();
    const navigate = useNavigate();

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Este booleano decide el MODO del formulario:
    //   - true  → estamos editando (hay ID en la URL)
    //   - false → estamos creando (no hay ID)
    // Es el patrón clásico para reutilizar un formulario.
    const isEdit = Boolean(id);

    // Estado del formulario
    // Todos los campos se inicializan vacíos. Si estamos editando,
    // el useEffect de abajo los rellenará con los datos del producto.
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categoryId, setCategoryId] = useState(''); // ← Lo añadimos, es requerido por la API
    const [categories, setCategories] = useState([]); // ← Lista de categorías para el select

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // Este useEffect corre DOS cosas según el modo:
    //   1. Cargar la lista de categorías (siempre, para el <select>).
    //   2. Si estamos editando, cargar los datos del producto.
    // El array [id] significa "vuelve a ejecutar si 'id' cambia".
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch (err) {
                console.error('Error al cargar categorías:', err);
            }
        }

        async function fetchProduct() {
            try {
                setLoading(true);
                const res = await api.get(`/products/${id}`);
                const p = res.data;
                // Rellenamos el formulario con los datos del producto
                setName(p.name);
                setDescription(p.description || '');
                setPrice(p.price);
                setStock(p.stock);
                setImageUrl(p.image_url || '');
                setCategoryId(p.category_id);
            } catch (err) {
                setError('No se pudo cargar el producto.');
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
        if (isEdit) fetchProduct();
    }, [id, isEdit]);

    // 🚨 IMPORTANTE ENTENDERLO 🚨
    // handleSubmit es el corazón del formulario.
    // 1. Previene la recarga de la página.
    // 2. Prepara el objeto con los datos.
    // 3. Llama a la API (POST si crea, PUT si edita).
    // 4. Redirige al dashboard si todo sale bien.
    // 5. Muestra errores si falla.
    async function handleSubmit(e) {
        e.preventDefault(); // ← CRÍTICO: sin esto, la página se recarga
        setError('');
        setLoading(true);

        const payload = {
            name,
            description: description || null,  // Si está vacío, enviamos null
            price: parseFloat(price),           // Convertimos string a número
            stock: parseInt(stock, 10),         // Convertimos string a entero
            image_url: imageUrl || null,
            category_id: parseInt(categoryId, 10),
        };

        try {
            if (isEdit) {
                // Actualizar producto existente
                await api.put(`/products/${id}`, payload);
            } else {
                // Crear nuevo producto
                await api.post('/products', payload);
            }
            // Redirige al dashboard tras guardar
            navigate('/admin');
        } catch (err) {
            // 🚨 IMPORTANTE ENTENDERLO 🚨
            // Laravel devuelve errores de validación en:
            //   err.response.data.errors = { campo: ['mensaje1', 'mensaje2'] }
            // Este patrón extrae el primer error de cualquier campo.
            if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al guardar. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-container">
            {/* 🚨 IMPORTANTE ENTENDERLO 🚨
                El título cambia según el modo usando un ternario.
                Es el patrón más limpio para UI condicional en JSX. */}
            <h1>{isEdit ? 'Editar Producto' : 'Crear Producto'}</h1>

            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    label="Nombre del producto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Input
                    type="text"
                    label="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Input
                    type="number"
                    label="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <Input
                    type="number"
                    label="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                />

                {/* 🚨 IMPORTANTE ENTENDERLO 🚨
                    El <select> para categorías es un "controlled component"
                    igual que los inputs. Su value está atado a categoryId.
                    Al cambiar, actualizamos el estado. */}
                <div className="input-group">
                    <label className="input-label">Categoría</label>
                    <select
                        className="custom-input"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">-- Selecciona una categoría --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    type="url"
                    label="URL de la imagen (opcional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />

                {/* Vista previa de la imagen si se ha puesto una URL */}
                {imageUrl && (
                    <div style={{ margin: '10px 0' }}>
                        <p style={{ fontSize: '12px', color: '#666' }}>Vista previa:</p>
                        <img
                            src={imageUrl}
                            alt="Vista previa"
                            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                )}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <Button type="submit" disabled={loading}>
                    {loading
                        ? 'Guardando...'
                        : isEdit
                            ? 'Actualizar Producto'
                            : 'Crear Producto'}
                </Button>

                <p>
                    <Link to="/admin">← Volver al dashboard</Link>
                </p>
            </form>
        </div>
    );
}