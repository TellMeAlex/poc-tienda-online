import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAI } from '../hooks/useAI';
import AIUploadModal from './AIUploadModal';

const GENERATING_MESSAGES = [
  'Creando tu look perfecto',
  'Personalizando productos para ti',
  'Ajustando cada detalle',
  'Tu estilo está tomando forma',
  'Preparando tu armario personalizado',
  'Casi listo, últimos retoques'
];

const AINotification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { aiStatus, progress, showNotification, startCustomization, dismissNotification } = useAI();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Log aiStatus changes for debugging
  useEffect(() => {
    console.log('🔔 AINotification - aiStatus changed to:', aiStatus);
  }, [aiStatus]);

  // Abrir modal automáticamente si hay foto subida
  useEffect(() => {
    if (aiStatus === 'uploaded') {
      setShowUploadModal(true);
    }
  }, [aiStatus]);

  // Rotar mensajes durante la generación
  useEffect(() => {
    if (aiStatus === 'generating') {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % GENERATING_MESSAGES.length);
      }, 2500); // Cambiar cada 2.5 segundos

      return () => clearInterval(interval);
    }
  }, [aiStatus]);

  if (!showNotification) return null;

  const handleOpenModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
  };

  const handleGenerateRecommendations = async () => {
    try {
      await generateRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Error will be shown in modal if it's open
    }
  };

  const handleNavigateToArmario = () => {
    dismissNotification();
    navigate('/armario-con-ia');
  };

  // No mostrar notificación en la página del armario
  if (location.pathname.includes('/armario-con-ia')) {
    return null;
  }

  // No mostrar si está oculto
  if (!showNotification) {
    return null;
  }

  // Estado: idle - Mostrar botón para abrir modal
  if (aiStatus === 'idle') {
    return (
      <>
        <button
          onClick={handleOpenModal}
          className="fixed bottom-4 right-4 z-50 bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-all hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Personaliza tu experiencia
        </button>
        <AIUploadModal isOpen={showUploadModal} onClose={handleCloseModal} />
      </>
    );
  }

  // Estado: uploading or fetching_mood - Show progress while user can browse
  if (aiStatus === 'uploading' || aiStatus === 'fetching_mood') {
    const message = aiStatus === 'uploading' 
      ? 'Subiendo tu imagen...' 
      : 'Analizando tu estilo y buscando productos perfectos para ti...';
    
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl p-5 w-80 border border-gray-200">
        {/* Título */}
        <div className="mb-3 text-base font-bold text-gray-900 text-center">
          Estamos trabajando para ti
        </div>

        {/* Mensaje */}
        <div className="mb-4 text-sm text-gray-600 text-center">
          <span className="animate-pulse">{message}</span>
        </div>

        {/* Icono de procesamiento */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
        </div>

        {/* Info text */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          Puedes seguir navegando mientras trabajamos
        </p>
      </div>
    );
  }

  // Estado: products_ready - Show CTA to view results
  if (aiStatus === 'products_ready') {
    return (
      <button
        onClick={startCustomization}
        className="fixed bottom-4 right-4 z-50 bg-black text-white px-6 py-4 rounded-lg shadow-xl hover:bg-gray-800 transition-all animate-pulse hover:animate-none hover:scale-105 flex flex-col items-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span className="text-base font-bold">¡Tus productos están listos!</span>
        <span className="text-xs opacity-75">Haz clic para ver tu selección</span>
      </button>
    );
  }

  // Estado: generating - Personalizando recomendaciones
  if (aiStatus === 'generating') {
    const progressPercentage = progress.total > 0 
      ? Math.round((progress.current / progress.total) * 100) 
      : 0;

    return (
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl p-5 w-80 border border-gray-200">
        {/* Título principal */}
        <div className="mb-3 text-base font-bold text-gray-900 text-center">
          Personalizando recomendaciones
        </div>

        {/* Mensaje rotatorio */}
        <div className="mb-4 text-sm text-gray-600 text-center h-5 flex items-center justify-center">
          <span className="animate-pulse">{GENERATING_MESSAGES[currentMessageIndex]}</span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
          <div
            className="bg-black h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Contador de productos */}
        <div className="text-sm text-gray-700 text-center font-medium mb-2">
          {progress.current} / {progress.total} productos
        </div>

        {/* Icono de procesamiento */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  // Estado: completed - Botón para ver armario (sin confetti)
  if (aiStatus === 'completed') {
    return (
      <button
        onClick={handleNavigateToArmario}
        className="fixed bottom-4 right-4 z-50 bg-black text-white px-6 py-4 rounded-lg shadow-xl hover:bg-gray-800 transition-all animate-pulse hover:animate-none hover:scale-105 flex flex-col items-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-base font-bold">No olvides revisar tu armario</span>
        <span className="text-xs opacity-75">Haz clic para ver</span>
      </button>
    );
  }

  return null;
};

export default AINotification;
