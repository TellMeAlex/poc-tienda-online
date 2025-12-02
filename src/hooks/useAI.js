import { useContext } from 'react';
import AIContext from '../context/AIContext';

export const useAI = () => {
  const context = useContext(AIContext);

  if (!context) {
    throw new Error('useAI debe ser usado dentro de un AIProvider');
  }

  return context;
};

export default useAI;
