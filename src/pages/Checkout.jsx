import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../store/slices/cartSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'España'
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Redirigir si el carrito está vacío
    if (items.length === 0 && !showSuccess) {
      navigate('/');
    }
  }, [items, navigate, showSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simular procesamiento de compra
    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessing(false);
    setShowSuccess(true);

    // Limpiar carrito después de 3 segundos y redirigir
    setTimeout(() => {
      dispatch(clearCart());
      navigate('/');
    }, 3000);
  };

  const getItemPrice = (item) => {
    return item.product.product_price;
  };

  const shipping = total > 50 ? 0 : 4.95;
  const finalTotal = total + shipping;

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Compra realizada con éxito</h1>
          <p className="text-gray-600 mb-6">
            Gracias por tu compra. Recibirás un email de confirmación en breve.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Número de pedido:</span>
                <span className="font-bold">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold">{finalTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Serás redirigido a la página principal en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información personal */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Información personal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Dirección de envío</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                      Código postal *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium mb-2">
                    País *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="España">España</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Francia">Francia</option>
                    <option value="Italia">Italia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <Link
                to="/"
                className="flex-1 border border-black text-black py-3 rounded-md text-center font-medium hover:bg-gray-50 transition-colors"
              >
                Seguir comprando
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {processing ? 'Procesando...' : 'Confirmar compra'}
              </button>
            </div>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

            {/* Items */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {items.map((item) => {
                const itemPrice = getItemPrice(item);
                return (
                  <div key={`${item.product.product_id}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.product.product_images_urls?.[0] || '/placeholder.jpg'}
                        alt={item.product.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium line-clamp-2">{item.product.product_name}</h3>
                      <p className="text-xs text-gray-500">
                        {item.size && `Talla: ${item.size}`}
                        {item.size && item.color && ' | '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-sm">
                        {itemPrice.toFixed(2)} € x {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totales */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Envío</span>
                <span>{shipping === 0 ? 'GRATIS' : `${shipping.toFixed(2)} €`}</span>
              </div>
              {total < 50 && (
                <p className="text-xs text-gray-500">
                  Envío gratis en compras superiores a 50 €
                </p>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>{finalTotal.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
