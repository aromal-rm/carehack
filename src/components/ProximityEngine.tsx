import React, { useEffect, useRef } from 'react';
import { useAudio } from '../hooks/useAudio';
import { useHaptics } from '../hooks/useHaptics';

interface ProximityEngineProps {
  cursorPosition: { x: number; y: number };
  creaturePosition: { x: number; y: number };
  detectionRadius: number;
  level: number;
  creatureSoundFile: string;
}

const ProximityEngine: React.FC<ProximityEngineProps> = ({
  cursorPosition,
  creaturePosition,
  detectionRadius,
  level,
  creatureSoundFile
}) => {
  const { playCreatureSoundWithProximity } = useAudio();
  const { vibrate } = useHaptics();
  const lastHapticTime = useRef(0);

  useEffect(() => {
    // Calculate distance between cursor and creature
    const distance = Math.sqrt(
      Math.pow(cursorPosition.x - creaturePosition.x, 2) +
      Math.pow(cursorPosition.y - creaturePosition.y, 2)
    );

    // Apply level-specific radius expansion
    // Level 1: Much larger detection range (2.5x)
    // Level 5: Minimal expansion (1.2x)
    const levelRadiusMultiplier: { [key: number]: number } = {
      1: 2.5, // Beginner - very large radius
      2: 2.0, // Easy
      3: 1.6, // Medium
      4: 1.4, // Hard
      5: 1.2  // Expert - minimal expansion
    };
    
    // Use the multiplier for this level (or default to 1.5)
    const multiplier = levelRadiusMultiplier[level] || 1.5;
    const expandedRadius = detectionRadius * multiplier;
    
    // Convert to proximity value (0-1, where 1 is closest)
    const normalizedDistance = Math.min(distance / expandedRadius, 1);
    const proximityValue = Math.max(0, 1 - normalizedDistance);
    
    // Apply level-specific intensity curve
    let adjustedProximity = proximityValue;
    if (level > 2) {
      // Apply non-linear scaling for higher levels (makes feedback more subtle until very close)
      // Level 3: Square root (more gradual)
      // Level 4: Cube root (even more gradual)
      // Level 5: Fourth root (extremely gradual until very close)
      const power: { [key: number]: number } = {
        3: 0.6, // Medium - less linear
        4: 0.4, // Hard - much less linear
        5: 0.25 // Expert - extremely non-linear
      };
      
      adjustedProximity = Math.pow(proximityValue, power[level] || 0.5);
    }
    
    // Update sound with current proximity - our improved hook will handle
    // starting/stopping based on whether cursor is in radius
    playCreatureSoundWithProximity(creatureSoundFile, adjustedProximity);
    
    // Apply haptic feedback based on proximity, but with rate limiting
    // Higher levels require closer proximity for haptic feedback
    const hapticThreshold: { [key: number]: number } = {
      1: 0.08,  // Level 1: Feel vibration from far away
      2: 0.12,  // Level 2: Moderate distance
      3: 0.18,  // Level 3: Need to get closer
      4: 0.25,  // Level 4: Much closer
      5: 0.35   // Level 5: Very close for haptic feedback
    };
    
    const currentThreshold = hapticThreshold[level] || 0.15;
    
    if (adjustedProximity > currentThreshold) {
      const now = Date.now();
      // Difficulty-based delay between haptic pulses
      // Lower levels: slower pulses
      // Higher levels: faster pulses when closer
      const difficultyDelay = Math.max(150, 300 - ((level - 1) * 30));
      
      if (now - lastHapticTime.current > difficultyDelay) {
        // Stronger vibration when closer to creature
        // Level-specific intensity scaling
        const intensityMultiplier = level >= 4 ? 0.7 : 1.0;
        const duration = Math.floor(adjustedProximity * 100 * intensityMultiplier);
        vibrate(duration > 0 ? duration : 0);
        lastHapticTime.current = now;
      }
    }
  }, [cursorPosition, creaturePosition, detectionRadius, level, creatureSoundFile, playCreatureSoundWithProximity, vibrate]);

  return null; // This component handles logic only, no rendering
};

export default ProximityEngine;