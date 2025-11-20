import { useState, useEffect } from 'react';
import { useAI } from '../hooks/useAI';

const AIUploadModal = ({ isOpen, onClose }) => {
  const { uploadPhoto, generateRecommendations, aiStatus } = useAI();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsUploading(false);
      setUploadSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  // Check if photo was already uploaded
  useEffect(() => {
    if (aiStatus === 'uploaded') {
      setUploadSuccess(true);
    }
  }, [aiStatus]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    
    try {
      await uploadPhoto(selectedFile);
      setUploadSuccess(true);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Error al subir la foto. Por favor, inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    try {
      await generateRecommendations();
      // Cerrar modal tras iniciar generación
      handleClose();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Error al generar recomendaciones. Por favor, inténtalo de nuevo.');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
    setUploadSuccess(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isUploading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-4">
          {uploadSuccess ? '¡Foto subida con éxito!' : 'Personaliza tu experiencia'}
        </h2>
        
        {!uploadSuccess ? (
          <>
            <p className="text-gray-600 mb-6">
              Sube tu foto para que podamos crear imágenes personalizadas de productos que se ajusten a tu estilo.
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Preview de imagen */}
            {previewUrl && (
              <div className="mb-6">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Input de archivo */}
            <div className="mb-6">
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
              >
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : 'Haz clic para seleccionar una foto'}
                  </span>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isUploading}
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1 px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Subiendo...
                  </>
                ) : (
                  'Subir foto'
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Estado después de subir */}
            <p className="text-gray-600 mb-6">
              Tu foto ha sido subida correctamente. Ahora puedes generar recomendaciones personalizadas basadas en tu estilo.
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Preview de la foto subida */}
            {previewUrl && (
              <div className="mb-6">
                <img
                  src={previewUrl}
                  alt="Foto subida"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Icono de éxito */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Botón de generar recomendaciones */}
            <button
              onClick={handleGenerateRecommendations}
              className="w-full px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Generar Recomendaciones
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AIUploadModal;
