import ProductCard from './ProductCard';

const ProductGrid = ({ products, title }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header con título y botón filtrar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-normal">{title || 'Bestsellers'}</h2>
        <button className="flex items-center gap-2 text-sm border border-gray-300 px-4 py-2 hover:bg-gray-50">
          <span>Filtrar</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10m-7 6h4" />
          </svg>
        </button>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
