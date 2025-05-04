
import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | 'none';

export const useScrollDirection = (threshold = 10): ScrollDirection => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none');
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      // Only update direction when scroll amount exceeds threshold
      if (Math.abs(scrollY - lastScrollY) > threshold) {
        setScrollDirection(direction);
        lastScrollY = scrollY > 0 ? scrollY : 0;
      }
    };
    
    window.addEventListener('scroll', updateScrollDirection);
    
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [threshold]);

  return scrollDirection;
};
