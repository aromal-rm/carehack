import { useCallback } from 'react';

export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const isSupported = useCallback(() => {
    return 'vibrate' in navigator && navigator.vibrate;
  }, []);

  return { vibrate, isSupported };
};