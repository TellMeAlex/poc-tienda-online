import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, heightClass = 'h-[350px]', index = 0 }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Adapt to new API structure
  const productId = product.product_id;
  const productName = product.product_name;
  const productPrice = product.product_price;
  const productImages = product.product_images_urls || [];
  const productImage = productImages[0] || '/placeholder-image.jpg';
  const productRank = product.product_rank || 0;

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      to={`/product/${productId}`}
      className="group block break-inside-avoid"
    >
      {/* Imagen con overlay y contenido */}
      <div className={`relative bg-gray-200 overflow-hidden rounded-lg shadow-sm hover:shadow-2xl transition-shadow duration-300 ${heightClass}`}>
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay - appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Badge de ranking - solo si hay */}
        {productRank > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black text-white text-xs px-2 py-1 rounded">
              ⭐ {productRank}
            </span>
          </div>
        )}

        {/* Botón de favoritos */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg"
          aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : 'fill-none stroke-black stroke-2'}`}
            viewBox="0 0 24 24"
          >
            <path
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Contenido que aparece en hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Nombre */}
          <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
            style={{ animationDelay: '100ms' }}>
            {productName}
          </h3>

          {/* Precio */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-bold text-base transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
              style={{ animationDelay: '200ms' }}>
              {productPrice.toFixed(2)} €
            </span>
          </div>

          {/* Características en hover */}
          {product.product_characteristics && product.product_characteristics.length > 0 && (
            <div className="flex flex-wrap gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
              style={{ animationDelay: '300ms' }}>
              {product.product_characteristics.slice(0, 2).map((char, idx) => (
                <span
                  key={idx}
                  className="text-xs text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded"
                >
                  {char}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
