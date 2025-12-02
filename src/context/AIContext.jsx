import { createContext, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { selectIsAuthenticated, selectCurrentToken } from '../store/slices/authSlice';
import { useUploadUserImagesMutation } from '../store/services/airisLoaderApi';
import { 
  useCustomizeProductByUserMutation, 
  useGetLatestUserMoodQuery,
  useGetSuggestedProductsQuery,
  airisApi
} from '../store/services/airisApi';

const AIContext = createContext();

const AI_STORAGE_KEYS = {
  STATUS: 'ai_status', // idle | uploading | fetching_mood | products_ready | generating | completed
  PHOTO_UPLOADED: 'ai_photo_uploaded',
  COMPLETED: 'ai_completed',
  DISMISSED: 'ai_notification_dismissed',
  HAS_RECOMMENDATIONS: 'ai_has_recommendations'
};

export const AIProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectCurrentToken);
  const [aiStatus, setAiStatus] = useState('idle');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [showNotification, setShowNotification] = useState(true);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [shouldFetchMood, setShouldFetchMood] = useState(false);
  const [hasRecommendations, setHasRecommendations] = useState(false);

  // API hooks
  const [uploadUserImages] = useUploadUserImagesMutation();
  const [customizeProduct] = useCustomizeProductByUserMutation();
  
  // Get user mood after upload
  const {
    data: userMood,
    isLoading: isMoodLoading
  } = useGetLatestUserMoodQuery(undefined, {
    skip: !shouldFetchMood || !isAuthenticated,
  });

  // Get suggested products based on mood
  const { 
    data: suggestedProducts,
    isLoading: isSuggestedProductsLoading 
  } = useGetSuggestedProductsQuery(userMood?.related_products_query || '', {
    skip: !userMood?.related_products_query,
  });

  // Cargar estado desde localStorage al montar
  useEffect(() => {
    const storedStatus = localStorage.getItem(AI_STORAGE_KEYS.STATUS);
    const storedPhotoUploaded = localStorage.getItem(AI_STORAGE_KEYS.PHOTO_UPLOADED);
    const storedCompleted = localStorage.getItem(AI_STORAGE_KEYS.COMPLETED);
    const storedDismissed = localStorage.getItem(AI_STORAGE_KEYS.DISMISSED);
    const storedHasRecommendations = localStorage.getItem(AI_STORAGE_KEYS.HAS_RECOMMENDATIONS);

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

    if (storedHasRecommendations === 'true') {
      setHasRecommendations(true);
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

      console.log('✅ Image uploaded successfully, fetching mood...');

      // Trigger mood fetch after successful upload
      setShouldFetchMood(true);
      setAiStatus('fetching_mood');
      localStorage.setItem(AI_STORAGE_KEYS.STATUS, 'fetching_mood');
      localStorage.setItem(AI_STORAGE_KEYS.PHOTO_UPLOADED, 'true');
    } catch (error) {
      console.error('Error uploading photo:', error);
      setAiStatus('idle');
      throw error;
    }
  }, [uploadUserImages, getUserIdFromToken]);

  const generateRecommendations = useCallback(async (productsToCustomize) => {
    if (!productsToCustomize || productsToCustomize.length === 0) {
      throw new Error('No hay productos disponibles para personalizar');
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error('Usuario no identificado');
    }

    console.log('🎨 Starting product customization for', productsToCustomize.length, 'products');
    setAiStatus('generating');
    setProgress({ current: 0, total: productsToCustomize.length });
    setGeneratedImages([]);

    const images = [];

    try {
      // Personalizar cada producto secuencialmente para mejor UX
      for (let i = 0; i < productsToCustomize.length; i++) {
        const product = productsToCustomize[i];
        try {
          console.log(`🎨 Customizing product ${i + 1}/${productsToCustomize.length}: ${product.product_name}`);
          
          const result = await customizeProduct({ 
            productId: product.product_id, 
            userId: userId 
          }).unwrap();
          
          // La API devuelve las imágenes en product_images_urls
          const productImages = result.product_images_urls || result.images || [];
          const lastImage = productImages[productImages.length - 1] || productImages[0];
          
          const generatedImage = {
            productId: product.product_id,
            productName: product.product_name,
            image: lastImage,
            originalProduct: product
          };
          
          images.push(generatedImage);
          setGeneratedImages([...images]);
          setProgress(prev => ({ ...prev, current: prev.current + 1 }));
          
          console.log(`✅ Product ${i + 1} customized successfully`);
        } catch (err) {
          console.error(`Error personalizando producto ${product.product_id}:`, err);
          setProgress(prev => ({ ...prev, current: prev.current + 1 }));
        }
      }

      console.log('✅ Generation completed. Valid images:', images.length);

      // Guardar las imágenes en localStorage para que persistan entre recargas
      if (images.length > 0) {
        localStorage.setItem('aiGeneratedImages', JSON.stringify(images));
        console.log('📝 localStorage updated with', images.length, 'images');
        completeProcessing(images);
      } else {
        throw new Error('No se pudieron generar recomendaciones personalizadas');
      }
    } catch (err) {
      console.error('Error generando recomendaciones:', err);
      setAiStatus('uploaded');
      throw err;
    }
  }, [customizeProduct, getUserIdFromToken]);

  // When products are ready, change status to show CTA instead of auto-starting
  useEffect(() => {
    if (aiStatus === 'fetching_mood' && suggestedProducts && !isSuggestedProductsLoading && userMood) {
      console.log('✅ Mood and suggested products ready!');
      console.log('📋 Mood phrase:', userMood.mood_phrase);
      console.log('🔍 Related products query:', userMood.related_products_query);
      console.log('📦 Suggested products count:', suggestedProducts.length);

      // Set status to products_ready to show CTA button
      setAiStatus('products_ready');
      localStorage.setItem(AI_STORAGE_KEYS.STATUS, 'products_ready');
    }
  }, [aiStatus, suggestedProducts, isSuggestedProductsLoading, userMood]);

  // Set hasRecommendations flag when user has active recommendations
  useEffect(() => {
    if (aiStatus === 'products_ready' || aiStatus === 'generating' || aiStatus === 'completed') {
      setHasRecommendations(true);
      localStorage.setItem(AI_STORAGE_KEYS.HAS_RECOMMENDATIONS, 'true');
    }
  }, [aiStatus]);

  // Function to start customization when user clicks CTA
  const startCustomization = useCallback(() => {
    if (suggestedProducts && suggestedProducts.length > 0) {
      generateRecommendations(suggestedProducts).catch(err => {
        console.error('Error in customization:', err);
      });
    }
  }, [suggestedProducts, generateRecommendations]);

  const completeProcessing = (images) => {
    console.log('🎉 completeProcessing called with', images?.length, 'images');
    setAiStatus('completed');
    setGeneratedImages(images);

    // Guardar en sessionStorage para la página de resultados
    sessionStorage.setItem('ai_generated_images', JSON.stringify(images));

    // Persistir estado completado
    localStorage.setItem(AI_STORAGE_KEYS.STATUS, 'completed');
    localStorage.setItem(AI_STORAGE_KEYS.COMPLETED, 'true');
    console.log('✅ localStorage ai_status set to: completed');
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
    setShouldFetchMood(false);
    setHasRecommendations(false);

    // Limpiar TODO el estado de AI en localStorage
    localStorage.removeItem(AI_STORAGE_KEYS.STATUS);
    localStorage.removeItem(AI_STORAGE_KEYS.PHOTO_UPLOADED);
    localStorage.removeItem(AI_STORAGE_KEYS.COMPLETED);
    localStorage.removeItem(AI_STORAGE_KEYS.DISMISSED);
    localStorage.removeItem(AI_STORAGE_KEYS.HAS_RECOMMENDATIONS);
    localStorage.removeItem('aiGeneratedImages');
    sessionStorage.removeItem('ai_generated_images');

    // Invalidar cache de RTK Query para mood y productos
    dispatch(airisApi.util.invalidateTags(['UserMood', 'Products']));

    console.log('🧹 AI state completely reset including RTK Query cache');
  }, [dispatch]);

  // Create a map of productId -> customized image URL for easy lookup
  const customizedImagesMap = generatedImages.reduce((acc, img) => {
    acc[img.productId] = img.image;
    return acc;
  }, {});

  return (
    <AIContext.Provider value={{
      aiStatus,
      uploadedPhoto,
      progress,
      showNotification,
      generatedImages,
      customizedImagesMap,
      hasRecommendations,
      uploadPhoto,
      generateRecommendations,
      startCustomization,
      resetAIState,
      dismissNotification
    }}>
      {children}
    </AIContext.Provider>
  );
};

export default AIContext;
