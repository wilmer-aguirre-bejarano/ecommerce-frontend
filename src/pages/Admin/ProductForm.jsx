// src/pages/Admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios'; // <-- Añade esta línea al principio del archivo
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
    //const [imageUrl, setImageUrl] = useState(''); //hug de la imagen
    const [categoryId, setCategoryId] = useState(''); // ← Lo añadimos, es requerido por la API
    const [categories, setCategories] = useState([]); // ← Lista de categorías para el select
    // 1. Define los estados al inicio del componente
    const [imagenArchivo, setImagenArchivo] = useState(null); // Guarda el archivo BINARIO para enviar al servidor
    const [previewUrl, setPreviewUrl] = useState(''); // Reemplaza a imageUrl para mostrar la vista previa en la web
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
                setImageUrl(p.file || ''); //p.image_url ami criterio
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
        e.preventDefault(); 
        setError('');
        setLoading(true);

        const formData = new FormData();

        formData.append('name', name);
        formData.append('description', description || '');
        formData.append('price', parseFloat(price));
        formData.append('stock', parseInt(stock, 10));
        formData.append('category_id', parseInt(categoryId, 10));

        if (imagenArchivo) {
            formData.append('image', imagenArchivo); 
        }

        // El truco definitivo para Laravel: Headers para multipart/form-data
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        try {
            if (isEdit) {
                // TRUCO EXCLUSIVO PARA ARCHIVOS: Enviamos por POST pero simulamos un PUT
                formData.append('_method', 'PUT'); 
                await api.post(`/products/${id}`, formData, config); 
            } else {
                // Crear nuevo producto
                await api.post('/products', formData, config);
            }

            // Redirige al dashboard tras guardar
            navigate('/admin');
        } catch (err) {
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

    // 2. El evento onChange de tu Input HTML debe ser así:
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Captura el primer archivo seleccionado
        if (file) {
            setImagenArchivo(file); // Guarda el archivo binario
            setPreviewUrl(URL.createObjectURL(file)); // Crea un enlace temporal interno solo para ver la foto en React
        }
    };

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

                {/* //imagens desde el escritorio */}
                <Input
                    type="file"
                    accept="image/*"
                    label="URL de la imagen (opcional)"
                    //value={imageUrl}
                    onChange={handleFileChange}//Guardas el archivo en el estado
                />

                {/* //imagen de campo de texto para la URL
                <Input
                    type="url"
                    label="URL de la imagen (opcional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                /> */}

                {/* Vista previa de la imagen si se ha puesto una URL */}
                {previewUrl && (
                    <div style={{ margin: '10px 0' }}>
                        <p style={{ fontSize: '12px', color: '#666' }}>Vista previa:</p>
                        <img
                            src={previewUrl}
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