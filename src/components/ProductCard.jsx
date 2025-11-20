import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
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
      className="group block"
    >
      {/* Imagen */}
      <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden mb-2">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badge de ranking - solo si hay */}
        {productRank > 0 && (
          <div className="absolute top-2 left-2">
            <span className="bg-black text-white text-xs px-2 py-1 rounded">
              ⭐ {productRank}
            </span>
          </div>
        )}

        {/* Botón de favoritos */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1"
          aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
        >
          <svg
            className={`w-6 h-6 ${isFavorite ? 'fill-red-500' : 'fill-none stroke-black stroke-2'}`}
            viewBox="0 0 24 24"
          >
            <path
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Información del producto */}
      <div>
        {/* Nombre */}
        <h3 className="text-sm mb-1 line-clamp-2">
          {productName}
        </h3>

        {/* Precio */}
        <div className="mb-2">
          <span className="font-semibold text-sm">{productPrice.toFixed(2)} €</span>
        </div>

        {/* Características */}
        {product.product_characteristics && product.product_characteristics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.product_characteristics.slice(0, 3).map((char, index) => (
              <span
                key={index}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
              >
                {char}
              </span>
            ))}
            {product.product_characteristics.length > 3 && (
              <span className="text-xs text-gray-500">
                +{product.product_characteristics.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
