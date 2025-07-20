import React, { useEffect, useState } from 'react';
import { Creature } from '../../types/GameTypes';

interface Decoy {
  id: string;
  position: { x: number; y: number };
  radius: number;
  intensity: number;
  color: string;
}

interface VisualModeProps {
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

const VisualMode: React.FC<VisualModeProps> = ({
  cursorPosition,
  creaturePosition,
  detectionRadius,
  onCreatureFound,
  isFound,
  creature,
  level,
  decoys = []
}) => {
  const [proximity, setProximity] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [decoyProximities, setDecoyProximities] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (isFound) return;

    const distance = Math.sqrt(
      Math.pow(cursorPosition.x - creaturePosition.x, 2) +
      Math.pow(cursorPosition.y - creaturePosition.y, 2)
    );

    // Apply level-specific visual feedback adjustment
    // Level 1: Full linear feedback
    // Level 5: Very subtle until extremely close
    const levelAdjustment: Record<number, number> = {
      1: 1.0,  // Beginner - full feedback
      2: 0.85, // Easy
      3: 0.7,  // Medium
      4: 0.5,  // Hard
      5: 0.35  // Expert - very subtle feedback
    };

    const expandedRadius = detectionRadius * (level === 1 ? 1.5 : 1.2);
    let proximityValue = Math.max(0, 1 - (distance / expandedRadius));
    
    // Non-linear adjustment based on level
    if (level > 2) {
      proximityValue = Math.pow(proximityValue, 1.0 + (level - 2) * 0.25);
    }
    
    // Apply level adjustment
    proximityValue *= levelAdjustment[level] || 0.7;
    
    setProximity(proximityValue);
    setPulseIntensity(proximityValue);

    // Process decoy proximities
    const newDecoyProximities: {[key: string]: number} = {};
    decoys.forEach(decoy => {
      const decoyDistance = Math.sqrt(
        Math.pow(cursorPosition.x - decoy.position.x, 2) +
        Math.pow(cursorPosition.y - decoy.position.y, 2)
      );
      
      const decoyProximity = Math.max(0, 1 - (decoyDistance / decoy.radius)) * decoy.intensity;
      newDecoyProximities[decoy.id] = decoyProximity;
    });
    
    setDecoyProximities(newDecoyProximities);

    // Auto-discovery threshold gets smaller with higher levels
    const autoDiscoveryThreshold = Math.max(5, 20 - (level * 3));
    if (distance < autoDiscoveryThreshold) {
      onCreatureFound();
    }
  }, [cursorPosition, creaturePosition, detectionRadius, onCreatureFound, isFound, level, decoys]);

  const backgroundColor = `rgba(${creature.color}, ${proximity * 0.3})`;
  const borderGlow = `0 0 ${proximity * 40}px rgba(${creature.color}, ${proximity * 0.8})`;

  return (
    <div className="absolute inset-0">
      {/* Proximity Glow */}
      <div
        className="absolute inset-0 transition-all duration-300 rounded-xl"
        style={{
          backgroundColor,
          boxShadow: borderGlow,
        }}
      />

      {/* Decoy Glows */}
      {!isFound && decoys.map(decoy => {
        const decoyProximity = decoyProximities[decoy.id] || 0;
        if (decoyProximity <= 0) return null;
        
        return (
          <div
            key={decoy.id}
            className="absolute transition-all duration-300 rounded-full"
            style={{
              backgroundColor: `rgba(${decoy.color}, ${decoyProximity * 0.25})`,
              boxShadow: `0 0 ${decoyProximity * 30}px rgba(${decoy.color}, ${decoyProximity * 0.6})`,
              width: decoyProximity * 150,
              height: decoyProximity * 150,
              left: decoy.position.x - (decoyProximity * 75),
              top: decoy.position.y - (decoyProximity * 75),
            }}
            aria-hidden="true"
          />
        );
      })}

      {/* Directional Patterns - reduced clarity at higher levels */}
      {proximity > (0.15 + (level * 0.05)) && (
        <div className="absolute inset-0">
          {/* Concentric circles pattern for better visual feedback */}
          {[0.3, 0.5, 0.7].map((threshold, index) => {
            // Higher level = higher threshold to see circles
            const levelThreshold = threshold + ((level - 1) * 0.05);
            return (
              proximity > levelThreshold && (
                <div
                  key={index}
                  className="absolute border-2 border-dashed rounded-full animate-pulse"
                  style={{
                    borderColor: `rgba(${creature.color}, ${proximity * (0.6 - ((level - 1) * 0.08))})`,
                    width: `${(index + 1) * 100}px`,
                    height: `${(index + 1) * 100}px`,
                    left: `${creaturePosition.x - ((index + 1) * 50)}px`,
                    top: `${creaturePosition.y - ((index + 1) * 50)}px`,
                    animationDuration: `${2 - (proximity * 1.5)}s`,
                    opacity: Math.min(1, Math.max(0, 1.2 - ((level - 1) * 0.2)))
                  }}
                />
              )
            );
          })}
        </div>
      )}

      {/* Creature Reveal */}
      {isFound && (
        <div
          className="absolute text-6xl animate-bounce"
          style={{
            left: creaturePosition.x - 30,
            top: creaturePosition.y - 30,
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))'
          }}
        >
          {creature.icon}
        </div>
      )}

      {/* Proximity Indicator - only visible in lower levels */}
      {level <= 3 && (
        <div className="absolute bottom-4 left-4 bg-black/70 p-3 rounded-lg">
          <div className="text-white text-sm mb-2">Visual Feedback</div>
          <div className="w-32 h-2 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${proximity * 100}%`,
                backgroundColor: `rgb(${creature.color})`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualMode;