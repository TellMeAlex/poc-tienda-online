import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { useAI } from '../hooks/useAI';

const Sidebar = ({ isOpen, onClose }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { isAICompleted } = useAI();

  const categories = [
    { name: 'Novedades', path: '/?filter=new' },
    { name: 'Bestsellers', path: '/?filter=bestsellers' },
    { name: 'Jeans', path: '/?category=Jeans' },
    { name: 'Pantalones', path: '/?category=Pantalones' },
    { name: 'Sudaderas', path: '/?category=Sudaderas' },
    { name: 'Chaquetas', path: '/?category=Chaquetas' },
  ];

  const inspirationLinks = [
    { name: 'Total look', path: '/total-look' },
    { name: 'Colaboraciones', path: '/colaboraciones' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-60 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto shadow-2xl`}
      >
        <div className="p-6">
          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-md"
            aria-label="Cerrar menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Tabs Mujer/Hombre */}
          <div className="flex border-b border-gray-200 mb-6">
            <button className="flex-1 pb-3 text-center font-medium border-b-2 border-black">
              Hombre
            </button>
            <button className="flex-1 pb-3 text-center text-gray-500 hover:text-black">
              Mujer
            </button>
          </div>

          {/* Colección */}
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4">Colección</h3>
            <nav className="space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  onClick={onClose}
                  className="block text-gray-700 hover:text-black hover:font-medium transition-all"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </section>

          {/* Inspírate */}
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4">Inspírate</h3>
            <nav className="space-y-3">
              {inspirationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className="block text-gray-700 hover:text-black hover:font-medium transition-all"
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/armario-con-ia"
                  onClick={onClose}
                  className="block text-gray-700 hover:text-black hover:font-medium transition-all"
                >
                  Armario con IA
                </Link>
              )}
            </nav>
          </section>

          {/* Ofertas destacadas */}
          <section className="mb-8">
            <Link
              to="/?discount=true"
              onClick={onClose}
              className="block p-4 bg-black text-white text-center rounded-md hover:bg-gray-800 transition-colors"
            >
              Crea tu pack hasta -10%
            </Link>
          </section>

          {/* Otros enlaces */}
          <section>
            <h3 className="text-lg font-bold mb-4">Otros</h3>
            <nav className="space-y-3">
              <Link
                to="/zapatos"
                onClick={onClose}
                className="block text-gray-700 hover:text-black hover:font-medium transition-all"
              >
                Zapatos
              </Link>
              <Link
                to="/accesorios"
                onClick={onClose}
                className="block text-gray-700 hover:text-black hover:font-medium transition-all"
              >
                Bolsos | Mochilas
              </Link>
              <Link
                to="/accesorios"
                onClick={onClose}
                className="block text-gray-700 hover:text-black hover:font-medium transition-all"
              >
                Accesorios
              </Link>
            </nav>
          </section>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
