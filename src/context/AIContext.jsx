import { createContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { selectIsAuthenticated, selectCurrentToken } from '../store/slices/authSlice';
import { useUploadUserImagesMutation } from '../store/services/airisLoaderApi';
import { useCustomizeProductByUserMutation, useGetCatalogProductsQuery } from '../store/services/airisApi';

const AIContext = createContext();

const AI_STORAGE_KEYS = {
  STATUS: 'ai_status', // idle | uploading | uploaded | generating | completed
  PHOTO_UPLOADED: 'ai_photo_uploaded',
  COMPLETED: 'ai_completed',
  DISMISSED: 'ai_notification_dismissed'
};

export const AIProvider = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectCurrentToken);
  const [aiStatus, setAiStatus] = useState('idle');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [showNotification, setShowNotification] = useState(true);
  const [generatedImages, setGeneratedImages] = useState([]);

  // API hooks
  const [uploadUserImages] = useUploadUserImagesMutation();
  const [customizeProduct] = useCustomizeProductByUserMutation();
  
  // Get catalog products for generation
  const { data: catalogProducts } = useGetCatalogProductsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Cargar estado desde localStorage al montar
  useEffect(() => {
    const storedStatus = localStorage.getItem(AI_STORAGE_KEYS.STATUS);
    const storedPhotoUploaded = localStorage.getItem(AI_STORAGE_KEYS.PHOTO_UPLOADED);
    const storedCompleted = localStorage.getItem(AI_STORAGE_KEYS.COMPLETED);
    const storedDismissed = localStorage.getItem(AI_STORAGE_KEYS.DISMISSED);

    if (storedDismissed === 'true') {
      setShowNotification(false);
      // Si está descartado, no necesitamos cargar el resto del estado visual
      return;
    }

    if (storedStatus) {
      setAiStatus(storedStatus);
    }

    if (storedPhotoUploaded === 'true') {
      setUploadedPhoto(true);
    }

    if (storedCompleted === 'true') {
      setAiStatus('completed');
    }
  }, []);

  const getUserIdFromToken = useCallback(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.user_id || decoded.sub || decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }, [token]);

  const uploadPhoto = useCallback(async (file) => {
    setAiStatus('uploading');
    const userId = getUserIdFromToken();

    if (!userId) {
      console.error('No user ID found in token');
      setAiStatus('idle');
      throw new Error('Usuario no identificado');
    }

    try {
      // Crear URL temporal de la foto para preview
      const photoUrl = URL.createObjectURL(file);
      setUploadedPhoto(photoUrl);

      // Upload real a la API como 'socialmedia'
      await uploadUserImages({
        userId: userId,
        imagesKind: 'socialmedia',
        images: [file]
      }).unwrap();

      // Cambiar a estado 'uploaded'
      setAiStatus('uploaded');
      localStorage.setItem(AI_STORAGE_KEYS.STATUS, 'uploaded');
      localStorage.setItem(AI_STORAGE_KEYS.PHOTO_UPLOADED, 'true');
    } catch (error) {
      console.error('Error uploading photo:', error);
      setAiStatus('idle');
      throw error;
    }
  }, [uploadUserImages, getUserIdFromToken]);

  const generateRecommendations = useCallback(async () => {
    if (!catalogProducts || catalogProducts.length === 0) {
      throw new Error('No hay productos disponibles para personalizar');
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error('Usuario no identificado');
    }

    setAiStatus('generating');
    setProgress({ current: 0, total: catalogProducts.length });
    setGeneratedImages([]);

    const images = [];

    try {
      // Personalizar cada producto en paralelo
      const promises = catalogProducts.map(async (product) => {
        try {
          // Usar el userId real
          const result = await customizeProduct({ 
            productId: product.product_id, 
            userId: userId 
          }).unwrap();
          
          // La API devuelve las imágenes en product_images_urls
          const productImages = result.product_images_urls || result.images || [];
          const lastImage = productImages[productImages.length - 1] || productImages[0];
          
          setProgress(prev => ({ ...prev, current: prev.current + 1 }));
          
          return {
            productId: product.product_id,
            productName: product.product_name,
            image: lastImage,
            originalProduct: product
          };
        } catch (err) {
          console.error(`Error personalizando producto ${product.product_id}:`, err);
          setProgress(prev => ({ ...prev, current: prev.current + 1 }));
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validImages = results.filter(r => r !== null);
      
      setGeneratedImages(validImages);
      
      // Guardar las imágenes en localStorage para que persistan entre recargas
      if (validImages.length > 0) {
        localStorage.setItem('aiGeneratedImages', JSON.stringify(validImages));
        completeProcessing();
      } else {
        throw new Error('No se pudieron generar recomendaciones personalizadas');
      }
    } catch (err) {
      console.error('Error generando recomendaciones:', err);
      setAiStatus('uploaded'); // Volver al estado anterior
      throw err;
    }
  }, [catalogProducts, customizeProduct]);

  const completeProcessing = (images) => {
    setAiStatus('completed');
    setGeneratedImages(images);
    
    // Guardar en sessionStorage para la página de resultados
    sessionStorage.setItem('ai_generated_images', JSON.stringify(images));
    
    // Persistir estado completado
    localStorage.setItem(AI_STORAGE_KEYS.STATUS, 'completed');
    localStorage.setItem(AI_STORAGE_KEYS.COMPLETED, 'true');
  };

  const dismissNotification = useCallback(() => {
    setShowNotification(false);
    localStorage.setItem(AI_STORAGE_KEYS.DISMISSED, 'true');
  }, []);

  const resetAIState = useCallback(() => {
    setAiStatus('idle');
    setUploadedPhoto(null);
    setProgress({ current: 0, total: 0 });
    setGeneratedImages([]);
    setShowNotification(true);
    
    // Limpiar localStorage
    localStorage.removeItem(AI_STORAGE_KEYS.DISMISSED);
    sessionStorage.removeItem('ai_generated_images');
  }, []);

  return (
    <AIContext.Provider value={{
      aiStatus,
      uploadedPhoto,
      progress,
      showNotification,
      generatedImages,
      uploadPhoto,
      generateRecommendations,
      resetAIState,
      dismissNotification
    }}>
      {children}
    </AIContext.Provider>
  );
};

export default AIContext;
