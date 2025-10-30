import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getTotal
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleQuantityChange = (item, newQuantity) => {
    updateQuantity(item.id, newQuantity, item.selectedSize, item.selectedColor);
  };

  const handleRemove = (item) => {
    removeFromCart(item.id, item.selectedSize, item.selectedColor);
  };

  const getItemPrice = (item) => {
    return item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeCart}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">
            Carrito ({items.length})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label="Cerrar carrito"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500 text-lg mb-2">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm">Añade productos para empezar tu compra</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemPrice = getItemPrice(item);
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 border-b border-gray-200 pb-4">
                    {/* Imagen */}
                    <div className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-1 line-clamp-2">
                        {item.name}
                      </h3>

                      {/* Talla y color seleccionados */}
                      <div className="text-xs text-gray-500 mb-2">
                        {item.selectedSize && <span>Talla: {item.selectedSize}</span>}
                        {item.selectedSize && item.selectedColor && <span> | </span>}
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                      </div>

                      {/* Precio */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-sm">{itemPrice.toFixed(2)} €</span>
                        {item.discount > 0 && (
                          <span className="text-xs text-gray-500 line-through">
                            {item.price.toFixed(2)} €
                          </span>
                        )}
                      </div>

                      {/* Cantidad y eliminar */}
                      <div className="flex items-center justify-between">
                        {/* Selector de cantidad */}
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>

                      {/* Total del item */}
                      <div className="mt-2 text-right">
                        <span className="text-sm font-bold">
                          Total: {itemTotal.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con total y checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>{getTotal().toFixed(2)} €</span>
            </div>

            {/* Botón de checkout */}
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Finalizar compra
            </button>

            {/* Continuar comprando */}
            <button
              onClick={closeCart}
              className="w-full border border-black text-black py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
