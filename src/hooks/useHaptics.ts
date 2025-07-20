import { useCallback } from 'react';

export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator && navigator.vibrate) {
      // Amplify vibration intensity for mobile devices
      if (typeof pattern === 'number') {
        // Increase single vibration by 1.5x for better perception on mobile
        navigator.vibrate(Math.min(400, pattern * 1.5));
      } else if (Array.isArray(pattern)) {
        // Amplify pattern vibrations while maintaining timing
        const amplifiedPattern = pattern.map((value, index) => 
          index % 2 === 0 ? Math.min(400, value * 1.5) : value
        );
        navigator.vibrate(amplifiedPattern);
      }
    }
  }, []);

  // Enhanced vibrate functions for better mobile feedback
  const vibrateWithIntensity = useCallback((intensity: number) => {
    if ('vibrate' in navigator && navigator.vibrate) {
      // Apply non-linear scaling to make differences more perceptible
      // Square the intensity to create more distinction between low and high values
      const amplifiedIntensity = Math.min(400, Math.floor(250 * Math.pow(intensity, 1.8)));
      navigator.vibrate(amplifiedIntensity);
    }
  }, []);

  // Pattern vibration for proximity feedback
  const vibrateProximityPattern = useCallback((intensity: number) => {
    if ('vibrate' in navigator && navigator.vibrate) {
      if (intensity < 0.3) return; // No vibration for very low intensities
      
      // Create different patterns based on intensity ranges
      if (intensity > 0.8) {
        // Very close - continuous strong vibration
        const duration = Math.floor(intensity * 300);
        navigator.vibrate(duration);
      } else if (intensity > 0.5) {
        // Medium close - double pulse pattern
        const base = Math.floor(intensity * 150);
        navigator.vibrate([base, 60, base * 1.2, 60]);
      } else {
        // Far - single pulse
        const base = Math.floor(intensity * 100);
        navigator.vibrate(base);
      }
    }
  }, []);

  const isSupported = useCallback(() => {
    return 'vibrate' in navigator && navigator.vibrate;
  }, []);

  return { vibrate, vibrateWithIntensity, vibrateProximityPattern, isSupported };
};