import React, { useEffect, useRef } from 'react';
import { Creature } from '../../types/GameTypes';
import { useAudio } from '../../hooks/useAudio';

interface Decoy {
  id: string;
  position: { x: number; y: number };
  radius: number;
  intensity: number;
  color: string;
}

interface AudioModeProps {
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

const AudioMode: React.FC<AudioModeProps> = ({
  cursorPosition,
  creaturePosition,
  detectionRadius,
  onCreatureFound,
  isFound,
  creature,
  level,
  decoys = []
}) => {
  const { startForestAmbience, stopForestAmbience, playCreatureSoundWithProximity, playTone } = useAudio();
  const hasStartedAmbience = useRef(false);
  const lastProximityRef = useRef(0);
  const lastPlayTimeRef = useRef(0);
  const lastDecoyPlayTimeRef = useRef<{[key: string]: number}>({});

  useEffect(() => {
    if (!hasStartedAmbience.current) {
      startForestAmbience();
      hasStartedAmbience.current = true;
    }

    return () => {
      stopForestAmbience();
    };
  }, [startForestAmbience, stopForestAmbience, isFound]);

  useEffect(() => {
    if (isFound) return;

    const distance = Math.sqrt(
      Math.pow(cursorPosition.x - creaturePosition.x, 2) +
      Math.pow(cursorPosition.y - creaturePosition.y, 2)
    );

    // Apply level-specific radius expansion for audio feedback
    const audioRadiusMultiplier = {
      1: 2.2, // Beginner - very large audio detection area
      2: 1.8, // Easy
      3: 1.5, // Medium
      4: 1.3, // Hard
      5: 1.1  // Expert - minimal audio expansion
    };
    
    const expandedRadius = detectionRadius * (audioRadiusMultiplier[level as keyof typeof audioRadiusMultiplier] || 1.5);
    const proximity = Math.max(0, 1 - (distance / expandedRadius));
    
    // Apply audio intensity adjustments based on level
    let adjustedProximity = proximity;
    if (level > 2) {
      // Non-linear audio response at higher levels
      // Makes it harder to locate creature by sound at higher levels
      const audioPower: Record<number, number> = {
        3: 0.7,  // Medium - slightly less linear
        4: 0.5,  // Hard - much less linear
        5: 0.35  // Expert - extremely non-linear
      };
      
      adjustedProximity = Math.pow(proximity, audioPower[level] || 0.7);
    }
    
    // Play creature sound with variable volume based on proximity
    const now = Date.now();
    
    // Higher levels have less frequent audio updates
    const audioUpdateDelay = {
      1: 200,  // Very responsive
      2: 350,  // Responsive
      3: 500,  // Moderate
      4: 800,  // Less frequent
      5: 1200  // Very infrequent - challenging
    };
    
    const delayThreshold = audioUpdateDelay[level as keyof typeof audioUpdateDelay] || 500;
    
    // Audio feedback threshold increases with level
    const minProximityForSound = {
      1: 0.05,  // Almost any detection
      2: 0.08,  // Slight proximity needed
      3: 0.12,  // More proximity needed
      4: 0.18,  // Significant proximity
      5: 0.25   // Very close for audio feedback
    };
    
    if (
      adjustedProximity >
        (minProximityForSound[level as keyof typeof minProximityForSound] || 0.1) &&
      (Math.abs(adjustedProximity - lastProximityRef.current) > 0.1 ||
        now - lastPlayTimeRef.current > delayThreshold)
    ) {
      playCreatureSoundWithProximity(creature.soundFile, adjustedProximity);
      lastProximityRef.current = adjustedProximity;
      lastPlayTimeRef.current = now;
    }
    
    // Handle decoy sounds in higher levels
    if (level >= 2 && decoys && decoys.length > 0) {
      decoys.forEach(decoy => {
        const decoyDistance = Math.sqrt(
          Math.pow(cursorPosition.x - decoy.position.x, 2) +
          Math.pow(cursorPosition.y - decoy.position.y, 2)
        );
        
        const decoyProximity = Math.max(0, 1 - (decoyDistance / decoy.radius));
        if (decoyProximity > 0.3) {
          const lastDecoyTime = lastDecoyPlayTimeRef.current[decoy.id] || 0;
          
          // Play decoy sounds less frequently than creature sounds
          if (now - lastDecoyTime > 1500) {
            // Decoy tones are different from creature sounds
            // Their frequency and volume depend on level
            const frequency = 300 + Math.random() * 200;
            const volume = Math.min(0.3, 0.1 + (decoy.intensity * 0.2));
            const duration = 100 + Math.random() * 300;
            
            // Higher level decoys sound more like real creatures
            if (level >= 4 && Math.random() > 0.7) {
              // Sometimes play a fake creature sound for high-level decoys
              // This makes them more confusing/misleading
              playTone(frequency, volume * decoyProximity, duration);
            } else {
              // Regular decoy tone
              playTone(frequency, volume * decoyProximity, duration);
            }
            
            lastDecoyPlayTimeRef.current[decoy.id] = now;
          }
        }
      });
    }

    // Auto-discovery threshold gets smaller with higher levels
    const autoDiscoveryThreshold = Math.max(5, 20 - (level * 3));
    if (distance < autoDiscoveryThreshold) {
      onCreatureFound();
    }
  }, [cursorPosition, creaturePosition, detectionRadius, onCreatureFound, isFound, creature.soundFile, 
      playCreatureSoundWithProximity, playTone, level, decoys]);

  return (
    <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
      {isFound ? (
        <div className="text-center p-8 bg-emerald-800/80 rounded-xl border border-emerald-500">
          <div className="text-6xl mb-4">{creature.icon}</div>
          <h3 className="text-2xl font-bold text-emerald-300 mb-2">
            {creature.name} Found!
          </h3>
          <p className="text-emerald-200">Listen for the fun fact!</p>
        </div>
      ) : (
        <div className="text-center p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Audio-First Mode Active
          </h3>
          <p className="text-gray-300 mb-4">
            Navigate using arrow keys and listen for creature sounds
          </p>
          <div className="text-sm text-gray-400">
            {level <= 2 ? (
              <>Forest ambience plays constantly. Creature sounds get stronger as you get closer to the {creature.name}</>
            ) : level <= 4 ? (
              <>Listen carefully to distinguish the {creature.name} from other forest sounds</>
            ) : (
              <>The {creature.name} is elusive and quiet. Move carefully and listen for subtle audio cues</>
            )}
          </div>
          {level > 1 && (
            <div className="text-xs text-yellow-500 mt-4">
              Level {level}: {level === 2 ? 'Easy' : level === 3 ? 'Medium' : level === 4 ? 'Hard' : 'Expert'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioMode;