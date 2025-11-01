import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Cart from './components/Cart';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AIGallery from './pages/AIGallery';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router basename="/POC">
      <UserProvider>
        <CartProvider>
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
              </Routes>
            </main>

            {/* Cart (drawer lateral) */}
            <Cart />
          </div>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
