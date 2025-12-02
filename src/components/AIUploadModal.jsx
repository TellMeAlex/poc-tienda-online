import { useState, useEffect, useRef } from 'react';
import { useAI } from '../hooks/useAI';

const AIUploadModal = ({ isOpen, onClose }) => {
  const { uploadPhoto, generateRecommendations, aiStatus } = useAI();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when modal closes (but not while uploading)
  useEffect(() => {
    if (!isOpen && !isUploading) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadSuccess(false);
      setError(null);
      // Reset the file input DOM element
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, isUploading]);

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
      // Close modal immediately after successful upload
      // The flow will continue automatically (mood fetch + product customization)
      console.log('✅ Upload successful, closing modal and starting automatic flow');
      
      // Let useEffect handle state cleanup when modal closes
      setIsUploading(false);
      onClose();
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Error al subir la foto. Por favor, inténtalo de nuevo.');
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    // Only allow closing if not currently uploading
    if (isUploading) {
      return;
    }
    
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadSuccess(false);
    setError(null);
    // Reset the file input DOM element
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          Personaliza tu experiencia
        </h2>
        
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
                  ref={fileInputRef}
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
      </div>
    </div>
  );
};

export default AIUploadModal;
