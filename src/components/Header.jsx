import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItemsCount } from '../store/slices/cartSlice';
import { selectIsAuthenticated, selectCurrentUser, setCredentials, logout as logoutAction } from '../store/slices/authSlice';
import { useLoginMutation } from '../store/services/airisApi';

import { useAI } from '../hooks/useAI';

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const cartItemsCount = useSelector(selectCartItemsCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { resetAIState } = useAI();
  
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchBar(false);
      setSearchQuery('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      try {
        const result = await login({ email: email.trim(), password: password.trim() }).unwrap();
        // Assuming the API returns user data and token
        dispatch(setCredentials({ user: result.user || { email }, token: result.access_token || result.token }));
        setShowLoginModal(false);
        setEmail('');
        setPassword('');
      } catch (error) {
        console.error('Login failed:', error);
        alert('Error al iniciar sesión. Verifica tus credenciales.');
      }
    }
  };

  const handleLogout = () => {
    resetAIState();
    dispatch(logoutAction());
  };

  // Cart toggle state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            {/* Lado izquierdo - Menú hamburguesa */}
            <div className="flex items-center">
              <button
                onClick={onMenuClick}
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Abrir menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Centro - Logo */}
            <div className="flex justify-center">
              <Link to="/" className="text-2xl font-bold tracking-widest">
                AIRIS
              </Link>
            </div>

            {/* Lado derecho - Iconos de búsqueda, usuario y carrito */}
            <div className="flex items-center justify-end space-x-4">
              {/* Icono de búsqueda */}
              <button
                onClick={() => setShowSearchBar(true)}
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Buscar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {/* Usuario */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline text-sm">{user?.email || user?.username}</span>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-gray-100 rounded-md"
                      aria-label="Cerrar sesión"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="p-2 hover:bg-gray-100 rounded-md"
                    aria-label="Iniciar sesión"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Carrito */}
              <button
                onClick={toggleCart}
                className="relative p-2 hover:bg-gray-100 rounded-md"
                aria-label="Carrito"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay de búsqueda */}
      {showSearchBar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-2xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-6 py-4 text-lg border-none rounded-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearchBar(false);
                  setSearchQuery('');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md"
                aria-label="Cerrar búsqueda"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Tu contraseña"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isLoggingIn ? 'Iniciando sesión...' : 'Entrar'}
              </button>
              
              {/* Botón de login rápido para testing */}
              <button
                type="button"
                onClick={async () => {
                  setEmail('josedtm@airis.com');
                  setPassword('123456hashed');
                  try {
                    const result = await login({ 
                      email: 'josedtm@airis.com', 
                      password: '123456hashed' 
                    }).unwrap();
                    dispatch(setCredentials({ 
                      user: result.user || { email: 'josedtm@airis.com' }, 
                      token: result.access_token || result.token 
                    }));
                    setShowLoginModal(false);
                    setEmail('');
                    setPassword('');
                  } catch (error) {
                    console.error('Login failed:', error);
                    alert('Error al iniciar sesión. Verifica tus credenciales.');
                  }
                }}
                disabled={isLoggingIn}
                className="w-full mt-2 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
              >
                🚀 Login rápido (Testing)
              </button>
              
              <p className="mt-4 text-sm text-gray-500 text-center">
                Este es un login simplificado solo para demostración
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
