import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
    >
      {/* Imagen */}
      <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden mb-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Badge de descuento - solo si hay */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2">
            <span className="bg-white text-black text-xs px-2 py-1">
              Pack hasta -{product.discount}%
            </span>
          </div>
        )}

        {/* Botón de favoritos */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
          {product.name}
        </h3>

        {/* Precio */}
        <div className="mb-2">
          <span className="font-semibold text-sm">{finalPrice.toFixed(2)} €</span>
        </div>

        {/* Colores disponibles */}
        {product.colorCodes && product.colorCodes.length > 0 && (
          <div className="flex items-center gap-1">
            {product.colorCodes.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-gray-400"
                style={{ backgroundColor: color }}
                title={product.colors[index]}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
