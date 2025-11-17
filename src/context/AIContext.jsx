import { createContext, useState, useEffect, useCallback } from 'react';

const AIContext = createContext();

const AI_STORAGE_KEYS = {
  STATUS: 'ai_status',
  START_TIME: 'ai_start_time',
  PHOTO: 'ai_photo',
  COMPLETED: 'ai_completed'
};

const AI_PROCESSING_DURATION = 120000; // 2 minutos en milisegundos

export const AIProvider = ({ children }) => {
  const [aiStatus, setAiStatus] = useState('idle');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showNotification, setShowNotification] = useState(true);

  // Cargar estado desde localStorage al montar
  useEffect(() => {
    const storedStatus = localStorage.getItem(AI_STORAGE_KEYS.STATUS);
    const storedStartTime = localStorage.getItem(AI_STORAGE_KEYS.START_TIME);
    const storedPhoto = localStorage.getItem(AI_STORAGE_KEYS.PHOTO);
    const storedCompleted = localStorage.getItem(AI_STORAGE_KEYS.COMPLETED);

    if (storedStatus) {
      setAiStatus(storedStatus);

      if (storedPhoto) {
        setUploadedPhoto(storedPhoto);
      }

      // Si estaba procesando, calcular el progreso actual
      if (storedStatus === 'processing' && storedStartTime) {
        const start = parseInt(storedStartTime, 10);
        const elapsed = Date.now() - start;

        if (elapsed >= AI_PROCESSING_DURATION) {
          // Ya debería estar completado
          completeProcessing();
        } else {
          setStartTime(start);
          const currentProgress = Math.floor((elapsed / AI_PROCESSING_DURATION) * 100);
          setProgress(currentProgress);
        }
      }

      // Si ya se completó anteriormente, mostrar como completado
      if (storedCompleted === 'true') {
        setAiStatus('completed');
        setProgress(100);
      }
    }
  }, []);

  // Efecto para actualizar el progreso cada segundo cuando está procesando
  useEffect(() => {
    if (aiStatus === 'processing' && startTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(Math.floor((elapsed / AI_PROCESSING_DURATION) * 100), 100);

        setProgress(newProgress);

        if (newProgress >= 100) {
          clearInterval(interval);
          completeProcessing();
        }
      }, 1000); // Actualizar cada segundo

      return () => clearInterval(interval);
    }
  }, [aiStatus, startTime]);

  const uploadPhoto = useCallback(async (file) => {
    setAiStatus('uploading');

    // Crear URL temporal de la foto
    const photoUrl = URL.createObjectURL(file);
    setUploadedPhoto(photoUrl);

    // Simular upload al servidor (1-2 segundos)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Guardar en localStorage
    localStorage.setItem(AI_STORAGE_KEYS.PHOTO, photoUrl);

    // Iniciar procesamiento automáticamente
    startProcessing();
  }, []);

  const startProcessing = useCallback(() => {
    const now = Date.now();
    setAiStatus('processing');
    setStartTime(now);
    setProgress(0);

    // Guardar en localStorage
    localStorage.setItem(AI_STORAGE_KEYS.STATUS, 'processing');
    localStorage.setItem(AI_STORAGE_KEYS.START_TIME, now.toString());
  }, []);

  const completeProcessing = useCallback(() => {
    setAiStatus('completed');
    setProgress(100);

    // Guardar en localStorage
    localStorage.setItem(AI_STORAGE_KEYS.STATUS, 'completed');
    localStorage.setItem(AI_STORAGE_KEYS.COMPLETED, 'true');
    localStorage.removeItem(AI_STORAGE_KEYS.START_TIME);
  }, []);

  const dismissNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  const resetAIState = useCallback(() => {
    setAiStatus('idle');
    setUploadedPhoto(null);
    setProgress(0);
    setStartTime(null);
    setShowNotification(true);

    // Limpiar localStorage
    localStorage.removeItem(AI_STORAGE_KEYS.STATUS);
    localStorage.removeItem(AI_STORAGE_KEYS.START_TIME);
    localStorage.removeItem(AI_STORAGE_KEYS.PHOTO);
    localStorage.removeItem(AI_STORAGE_KEYS.COMPLETED);
  }, []);

  const value = {
    aiStatus,
    uploadedPhoto,
    progress,
    showNotification,
    uploadPhoto,
    startProcessing,
    completeProcessing,
    dismissNotification,
    resetAIState,
    isAICompleted: aiStatus === 'completed' || localStorage.getItem(AI_STORAGE_KEYS.COMPLETED) === 'true'
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export default AIContext;
