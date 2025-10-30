import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getProductById(id);

        if (response.success) {
          setProduct(response.data);
          // Seleccionar primera talla y color por defecto
          if (response.data.sizes?.length > 0) {
            setSelectedSize(response.data.sizes[0]);
          }
          if (response.data.colors?.length > 0) {
            setSelectedColor(response.data.colors[0]);
          }
        } else {
          setError(response.error || 'Producto no encontrado');
        }
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor, selecciona una talla');
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const finalPrice = product?.discount
    ? product.price * (1 - product.discount / 100)
    : product?.price;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Producto no encontrado'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <Link to="/" className="text-gray-500 hover:text-black">Inicio</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to={`/?category=${product.category}`} className="text-gray-500 hover:text-black">
          {product.category}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Imagen */}
        <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Información del producto */}
        <div className="flex flex-col">
          {/* Título y precio */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              {product.discount > 0 ? (
                <>
                  <span className="text-2xl font-bold">{finalPrice.toFixed(2)} €</span>
                  <span className="text-xl text-gray-500 line-through">{product.price.toFixed(2)} €</span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">{product.price.toFixed(2)} €</span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Selector de color */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Color: <span className="font-bold">{selectedColor}</span>
              </label>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: product.colorCodes[index] }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Selector de talla */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Talla</label>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 border rounded-md text-center font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de cantidad */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Cantidad</label>
            <div className="flex items-center border border-gray-300 rounded-md w-32">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="flex-1 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Añadir al carrito
            </button>

            {showSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Producto añadido al carrito
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="space-y-4 text-sm border-t border-gray-200 pt-6">
            {product.material && (
              <div>
                <span className="font-medium">Composición: </span>
                <span className="text-gray-700">{product.material}</span>
              </div>
            )}

            {product.care && (
              <div>
                <span className="font-medium">Cuidados: </span>
                <ul className="text-gray-700 mt-2 space-y-1">
                  {product.care.map((instruction, index) => (
                    <li key={index}>• {instruction}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.features && (
              <div>
                <span className="font-medium">Características: </span>
                <ul className="text-gray-700 mt-2 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">También te puede gustar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {product.relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id}>
                <Link to={`/product/${relatedProduct.id}`}>
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{relatedProduct.name}</h3>
                  <p className="font-bold">{relatedProduct.price.toFixed(2)} €</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
