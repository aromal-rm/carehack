import React, { useEffect, useState, useRef } from 'react';
import { Creature } from '../../types/GameTypes';
import { useAudio } from '../../hooks/useAudio';
import { useHaptics } from '../../hooks/useHaptics';

interface Decoy {
  id: string;
  position: { x: number; y: number };
  radius: number;
  intensity: number;
  color: string;
}

interface MultiSensoryModeProps {
  cursorPosition: { x: number; y: number };
  creaturePosition: { x: number; y: number };
  detectionRadius: number;
  gameAreaSize: { width: number; height: number };
  onCreatureFound: () => void;
  isFound: boolean;
  creature: Creature;
  level: number;
  decoys?: Decoy[];
}

const MultiSensoryMode: React.FC<MultiSensoryModeProps> = ({
  cursorPosition,
  creaturePosition,
  detectionRadius,
  gameAreaSize,
  onCreatureFound,
  isFound,
  creature,
  level,
  decoys = []
}) => {
  const [proximity, setProximity] = useState(0);
  const [decoyProximities, setDecoyProximities] = useState<{[key: string]: number}>({});
  const { playCreatureSoundWithProximity, playTone } = useAudio();
  const { vibrateWithIntensity, vibrateProximityPattern } = useHaptics();
  const lastAudioTimeRef = useRef(0);
  const lastHapticTimeRef = useRef(0);
  const lastDecoyFeedbackRef = useRef<{[key: string]: number}>({});

  useEffect(() => {
    if (isFound) return;

    const distance = Math.sqrt(
      Math.pow(cursorPosition.x - creaturePosition.x, 2) +
      Math.pow(cursorPosition.y - creaturePosition.y, 2)
    );

    // Apply level-specific radius expansion for multi-sensory feedback
    const multiSensoryRadiusMultiplier: Record<number, number> = {
      1: 2.0, // Beginner - large detection radius
      2: 1.7, // Easy
      3: 1.4, // Medium
      4: 1.2, // Hard
      5: 1.0  // Expert - no expansion
    };
    
    const expandedRadius = detectionRadius * (multiSensoryRadiusMultiplier[level] || 1.5);
    let proximityValue = Math.max(0, 1 - (distance / expandedRadius));
    
    // Apply non-linear adjustments for higher levels
    if (level > 2) {
      const sensoryCurve: Record<number, number> = {
        3: 0.75, // Medium - somewhat non-linear
        4: 0.6,  // Hard - more non-linear 
        5: 0.45  // Expert - extremely non-linear
      };
      
      proximityValue = Math.pow(proximityValue, sensoryCurve[level] || 0.75);
    }
    
    setProximity(proximityValue);

    // Process decoy proximities
    const now = Date.now();
    const newDecoyProximities: {[key: string]: number} = {};
    
    decoys.forEach(decoy => {
      const decoyDistance = Math.sqrt(
        Math.pow(cursorPosition.x - decoy.position.x, 2) +
        Math.pow(cursorPosition.y - decoy.position.y, 2)
      );
      
      const decoyProximity = Math.max(0, 1 - (decoyDistance / decoy.radius));
      newDecoyProximities[decoy.id] = decoyProximity * decoy.intensity;
      
      // Apply decoy feedback if sufficiently close
      if (decoyProximity > 0.3) {
        const lastDecoyTime = lastDecoyFeedbackRef.current[decoy.id] || 0;
        
        // Less frequent feedback for decoys
        if (now - lastDecoyTime > 1200) {
          // Visual feedback is handled by state
          
          // Audio feedback for decoys
          if (level >= 3) { // Only higher levels have audio decoys
            const frequency = 300 + Math.random() * 150; 
            const volume = 0.1 + (decoy.intensity * 0.15);
            playTone(frequency, volume * decoyProximity, 150);
          }
          
          // Haptic feedback for decoys only in higher levels
          if (level >= 4 && decoyProximity > 0.5) {
            vibrate(Math.floor(decoyProximity * 20));
          }
          
          lastDecoyFeedbackRef.current[decoy.id] = now;
        }
      }
    });
    
    setDecoyProximities(newDecoyProximities);

    // Apply level-specific thresholds for feedback
    if (proximityValue > 0) {
      // Audio feedback with creature sounds
      const audioThreshold: Record<number, number> = {
        1: 0.05, // Almost any proximity
        2: 0.1,  // Slight proximity
        3: 0.15, // Medium proximity
        4: 0.2,  // Significant proximity
        5: 0.25  // High proximity required
      };
      
      const audioMinProximity = audioThreshold[level] || 0.1;
      
      if (proximityValue > audioMinProximity) {
        const audioDelay = Math.max(300, 200 + (level * 50)); // Longer delays at higher levels
        
        if (now - lastAudioTimeRef.current > audioDelay) {
          playCreatureSoundWithProximity(creature.soundFile, proximityValue);
          lastAudioTimeRef.current = now;
        }
      }

      // Enhanced haptic feedback with intensity based on proximity
      const hapticThreshold: Record<number, number> = {
        1: 0.1,  // Almost any proximity
        2: 0.15, // Slight proximity
        3: 0.25, // Medium proximity
        4: 0.35, // High proximity
        5: 0.45  // Very high proximity required
      };
      
      if (proximityValue > (hapticThreshold[level] || 0.2) && now - lastHapticTimeRef.current > 300) {
        // Use distinct haptic patterns based on proximity zones
        if (proximityValue > 0.8) {
          // Very close - continuous strong vibration
          vibrateProximityPattern(proximityValue);
        } else if (proximityValue > 0.5) {
          // Medium proximity - pulsing pattern
          vibrateProximityPattern(proximityValue);
        } else {
          // Lower proximity - single intensity-based pulse
          vibrateWithIntensity(proximityValue);
        }
        
        lastHapticTimeRef.current = now;
      }
    }

    // Auto-discovery threshold gets smaller with higher levels
    const autoDiscoveryThreshold = Math.max(5, 20 - (level * 3));
    if (distance < autoDiscoveryThreshold) {
      onCreatureFound();
    }
  }, [
    cursorPosition, 
    creaturePosition, 
    detectionRadius, 
    gameAreaSize, 
    onCreatureFound, 
    isFound, 
    creature.soundFile,
    level,
    decoys,
    playCreatureSoundWithProximity,
    playTone,
    vibrateWithIntensity,
    vibrateProximityPattern
  ]);

  const glowIntensity = proximity * 40;
  const backgroundColor = `rgba(${creature.color}, ${proximity * 0.2})`;

  return (
    <div className="absolute inset-0">
      {/* Combined Visual and Audio Feedback */}
      <div
        className="absolute inset-0 transition-all duration-200 rounded-xl"
        style={{
          backgroundColor,
          boxShadow: `inset 0 0 ${glowIntensity}px rgba(${creature.color}, ${proximity * 0.5})`
        }}
      />

      {/* Decoy Glows */}
      {!isFound && decoys.map(decoy => {
        const decoyProximity = decoyProximities[decoy.id] || 0;
        if (decoyProximity <= 0.2) return null; // Only show somewhat close decoys
        
        const size = decoyProximity * 120;
        const halfSize = size / 2;
        
        // Calculate position with boundary constraints
        const left = Math.max(0, Math.min(decoy.position.x - halfSize, gameAreaSize.width - size));
        const top = Math.max(0, Math.min(decoy.position.y - halfSize, gameAreaSize.height - size));
        
        return (
          <div
            key={decoy.id}
            className="absolute transition-all duration-200 rounded-full"
            style={{
              backgroundColor: `rgba(${decoy.color}, ${decoyProximity * 0.15})`,
              boxShadow: `0 0 ${decoyProximity * 20}px rgba(${decoy.color}, ${decoyProximity * 0.4})`,
              width: size,
              height: size,
              left: left,
              top: top,
            }}
            aria-hidden="true"
          />
        );
      })}

      {/* Particle Effects - with boundary constraints */}
      {proximity > (0.3 + (level * 0.05)) && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(Math.min(10, Math.floor(proximity * 15 / level)))].map((_, i) => {
            // Calculate bounded position for particles
            const particleSize = 2; // Width/height of particle
            const variance = (100 - (level * 10)) / 2; // Half the range of random movement
            
            // Ensure particles stay within game area bounds
            const randomX = Math.random() * 2 - 1; // Value between -1 and 1
            const randomY = Math.random() * 2 - 1; // Value between -1 and 1
            
            const particleX = Math.max(
              particleSize, 
              Math.min(
                creaturePosition.x + (randomX * variance), 
                gameAreaSize.width - particleSize
              )
            );
            
            const particleY = Math.max(
              particleSize, 
              Math.min(
                creaturePosition.y + (randomY * variance), 
                gameAreaSize.height - particleSize
              )
            );
            
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: `rgb(${creature.color})`,
                  left: `${particleX}px`,
                  top: `${particleY}px`,
                  animationDelay: `${i * 100}ms`,
                  opacity: Math.min(1, proximity * (1.2 - (level * 0.15)))
                }}
              />
            );
          })}
        </div>
      )}

      {/* Creature Reveal with boundary constraints */}
      {isFound && (
        <div
          className="absolute text-6xl animate-bounce"
          style={{
            left: Math.max(10, Math.min(creaturePosition.x - 30, gameAreaSize.width - 60)),
            top: Math.max(10, Math.min(creaturePosition.y - 30, gameAreaSize.height - 60)),
            filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 1))',
            textShadow: `0 0 20px rgb(${creature.color})`
          }}
        >
          {creature.icon}
        </div>
      )}

      {/* Multi-Modal Feedback Panel - only for lower levels */}
      {level <= 3 && (
        <div className="absolute top-4 left-4 bg-black/80 p-3 rounded-lg text-white">
          <div className="text-xs mb-2">Multi-Sensory Feedback</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs">Audio:</span>
              <div className="w-16 h-1 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-400 transition-all duration-200"
                  style={{ width: `${proximity * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">Visual:</span>
              <div className="w-16 h-1 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-green-400 transition-all duration-200"
                  style={{ width: `${proximity * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">Haptic:</span>
              <div className="w-16 h-1 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-purple-400 transition-all duration-200"
                  style={{ width: `${Math.max(0, (proximity - 0.3) * 1.43) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Level indicator - only show in higher levels */}
      {level >= 4 && !isFound && (
        <div className="absolute bottom-4 right-4 bg-black/70 px-2 py-1 rounded text-xs text-emerald-400">
          Level {level}: {level === 4 ? 'Hard' : 'Expert'}
        </div>
      )}
    </div>
  );
};

export default MultiSensoryMode;

function vibrate(arg0: number) {
  throw new Error('Function not implemented.');
}
