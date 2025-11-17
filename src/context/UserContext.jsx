import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin, logoutUser as apiLogout, checkAuth } from '../services/api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const { isAuthenticated: isAuth, user: userData } = checkAuth();
    setIsAuthenticated(isAuth);
    setUser(userData);
    setLoading(false);
  }, []);

  const login = async (username) => {
    try {
      const response = await apiLogin(username);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Error al iniciar sesión' };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);

    // Resetear estado de IA al cerrar sesión
    localStorage.removeItem('ai_status');
    localStorage.removeItem('ai_start_time');
    localStorage.removeItem('ai_photo');
    localStorage.removeItem('ai_completed');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
};
