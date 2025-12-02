import { useState, useEffect } from 'react';

/**
 * Custom hook to create a typewriter effect
 * @param {string} text - The text to animate
 * @param {number} delay - Delay in milliseconds between each character (default: 500ms)
 * @returns {string} The current displayed text
 */
const useTypewriter = (text, delay = 200) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (!text || currentIndex >= text.length) {
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, currentIndex, delay]);

  return displayedText;
};

export default useTypewriter;
