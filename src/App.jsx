import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import { selectIsAuthenticated } from './store/slices/authSlice';
import { AIProvider } from './context/AIContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Cart from './components/Cart';
import AINotification from './components/AINotification';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AIGallery from './pages/AIGallery';
import ArmarioConIA from './pages/ArmarioConIA';
import MoodRecommendations from './pages/MoodRecommendations';

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar (siempre oculto, se abre con hamburguesa) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Contenido principal */}
      <main className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ai-gallery" element={<AIGallery />} />
          <Route path="/armario-con-ia" element={<ArmarioConIA />} />
          <Route path="/mood-recommendations" element={<MoodRecommendations />} />
        </Routes>
      </main>

      {/* Cart (drawer lateral) */}
      <Cart />

      {/* AI Notification (solo cuando está autenticado) */}
      {isAuthenticated && <AINotification />}
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router basename="/POC">
        <AIProvider>
          <AppContent />
        </AIProvider>
      </Router>
    </Provider>
  );
}

export default App;
