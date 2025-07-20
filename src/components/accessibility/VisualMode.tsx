import React, { useEffect, useState } from 'react';
import { Creature } from '../../types/GameTypes';

interface VisualModeProps {
  cursorPosition: { x: number; y: number };
  creaturePosition: { x: number; y: number };
  detectionRadius: number;
  gameAreaSize: { width: number; height: number };
  onCreatureFound: () => void;
  isFound: boolean;
  creature: Creature;
}

const VisualMode: React.FC<VisualModeProps> = ({
  cursorPosition,
  creaturePosition,
  detectionRadius,
  gameAreaSize,
  onCreatureFound,
  isFound,
  creature
}) => {
  const [proximity, setProximity] = useState(0);

  useEffect(() => {
    if (isFound) return;

    const distance = Math.sqrt(
      Math.pow(cursorPosition.x - creaturePosition.x, 2) +
      Math.pow(cursorPosition.y - creaturePosition.y, 2)
    );

    const proximityValue = Math.max(0, 1 - (distance / detectionRadius));
    setProximity(proximityValue);

    // Auto-discovery only at very close range (much smaller threshold)
    if (distance < 15) {
      onCreatureFound();
    }
  }, [cursorPosition, creaturePosition, detectionRadius, onCreatureFound, isFound]);

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

      {/* Directional Patterns */}
      {proximity > 0.2 && (
        <div className="absolute inset-0">
          {/* Concentric circles pattern for better visual feedback */}
          {[0.3, 0.5, 0.7].map((threshold, index) => (
            proximity > threshold && (
              <div
                key={index}
                className="absolute border-2 border-dashed rounded-full animate-pulse"
                style={{
                  borderColor: `rgba(${creature.color}, ${proximity * 0.6})`,
                  width: `${(index + 1) * 100}px`,
                  height: `${(index + 1) * 100}px`,
                  left: `${Math.max(0, Math.min(creaturePosition.x - ((index + 1) * 50), gameAreaSize.width - 100))}px`,
                  top: `${Math.max(0, Math.min(creaturePosition.y - ((index + 1) * 50), gameAreaSize.height - 100))}px`,
                  animationDuration: `${2 - (proximity * 1.5)}s`
                }}
              />
            )
          ))}
        </div>
      )}

      {/* Creature Reveal - ensure position stays within bounds */}
      {isFound && (
        <div
          className="absolute text-6xl animate-bounce"
          style={{
            left: Math.max(10, Math.min(creaturePosition.x - 30, gameAreaSize.width - 60)),
            top: Math.max(10, Math.min(creaturePosition.y - 30, gameAreaSize.height - 60)),
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))'
          }}
        >
          {creature.icon}
        </div>
      )}

      {/* Proximity Indicator */}
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
    </div>
  );
};

export default VisualMode;