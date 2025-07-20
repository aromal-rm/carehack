import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AccessibilityMode } from '../types/GameTypes';
import ProximityEngine from './ProximityEngine';
import CreatureFactBox from './CreatureFactBox';
import AudioMode from './accessibility/AudioMode';
import VisualMode from './accessibility/VisualMode';
import MultiSensoryMode from './accessibility/MultiSensoryMode';
import { creatures } from '../data/creatures';
import { useTalkBack } from '../hooks/useTalkBack';
import { useAudio } from '../hooks/useAudio';

interface Decoy {
  id: string;
  position: { x: number; y: number };
  radius: number;
  intensity: number;
  color: string;
}

interface GameEngineProps {
  level: number;
  accessibilityMode: AccessibilityMode;
  onLevelComplete: () => void;
  talkBackEnabled: boolean;
}

const GameEngine: React.FC<GameEngineProps> = ({
  level,
  accessibilityMode,
  onLevelComplete,
  talkBackEnabled
}) => {
  const [gameAreaSize, setGameAreaSize] = useState({ width: 800, height: 600 });
  const [cursorPosition, setCursorPosition] = useState({ x: 100, y: 100 });
  const [isFound, setIsFound] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { speak } = useTalkBack(talkBackEnabled);
  const { playSound, startForestAmbience } = useAudio();
  
  const currentCreature = creatures[level - 1];

  // Calculate scaled creature position based on current game area size
  const scaledCreaturePosition = useMemo(() => {
    const baseWidth = 800; // Base design width
    const baseHeight = 600; // Base design height
    
    // Convert the fixed position to percentages
    const xPercent = currentCreature.position.x / baseWidth;
    const yPercent = currentCreature.position.y / baseHeight;
    
    // Calculate the scaled position based on current game area
    let scaledX = gameAreaSize.width * xPercent;
    let scaledY = gameAreaSize.height * yPercent;
    
    // Apply boundary constraints (keep creature within visible area)
    const creatureSize = 60; // Estimated size for the creature icon
    const padding = 20; // Additional padding from edges
    
    // Constrain X position
    scaledX = Math.max(padding, Math.min(scaledX, gameAreaSize.width - creatureSize - padding));
    
    // Constrain Y position
    scaledY = Math.max(padding, Math.min(scaledY, gameAreaSize.height - creatureSize - padding));
    
    return { x: scaledX, y: scaledY };
  }, [currentCreature.position, gameAreaSize]);

  // Generate decoys based on level difficulty
  const decoys = useMemo(() => {
    // No decoys at level 1
    if (level === 1) return [];
    
    // Number of decoys increases with level
    const decoyCount = {
      2: 2, // 2-3 decoys
      3: 4, // 4-5 decoys
      4: 8, // 7-10 decoys
      5: 12 // 10-12 decoys
    }[level] || 0;
    
    if (decoyCount === 0) return [];
    
    const result: Decoy[] = [];
    const creaturePos = scaledCreaturePosition; // Use the scaled position here
    const minDistFromCreature = level <= 3 ? 150 : 100; // Higher levels can have decoys closer to creature
    
    // Generate decoys with varied positions
    for (let i = 0; i < decoyCount; i++) {
      let valid = false;
      let x = 0;
      let y = 0;
      
      // Find a position that's not too close to creature or other decoys
      for (let attempts = 0; attempts < 20 && !valid; attempts++) {
        x = 50 + Math.random() * (gameAreaSize.width - 100);
        y = 50 + Math.random() * (gameAreaSize.height - 100);
        
        // Check distance from creature
        const distFromCreature = Math.sqrt(
          Math.pow(x - creaturePos.x, 2) + 
          Math.pow(y - creaturePos.y, 2)
        );
        
        if (distFromCreature < minDistFromCreature) continue;
        
        // Check distance from other decoys
        valid = true;
        for (const decoy of result) {
          const distFromDecoy = Math.sqrt(
            Math.pow(x - decoy.position.x, 2) + 
            Math.pow(y - decoy.position.y, 2)
          );
          
          if (distFromDecoy < 70) {
            valid = false;
            break;
          }
        }
      }
      
      // Generate random decoy attributes
      const radius = Math.max(40, Math.min(100, currentCreature.detectionRadius * (0.3 + Math.random() * 0.4)));
      
      // Decoy intensity - higher levels have more convincing decoys
      // Level 2: Weak decoys (0.2-0.4 intensity)
      // Level 5: Strong decoys (0.5-0.9 intensity)
      const minIntensity = Math.min(0.2 + (level - 2) * 0.1, 0.5);
      const maxIntensity = Math.min(0.4 + (level - 2) * 0.15, 0.9);
      const intensity = minIntensity + Math.random() * (maxIntensity - minIntensity);
      
      // Generate a color similar to but distinguishable from creature color
      const creatureColorParts = currentCreature.color.split(',').map(Number);
      const colorVariation = 30 + Math.random() * 50;
      const color = creatureColorParts.map(c => {
        return Math.max(0, Math.min(255, c + (Math.random() > 0.5 ? colorVariation : -colorVariation)));
      }).join(', ');
      
      result.push({
        id: `decoy-${i}`,
        position: { x, y },
        radius,
        intensity,
        color
      });
    }
    
    return result;
  }, [level, scaledCreaturePosition, gameAreaSize.width, gameAreaSize.height]);

  useEffect(() => {
    const updateGameAreaSize = () => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        setGameAreaSize({ width: rect.width, height: rect.height });
      }
    };

    updateGameAreaSize();
    window.addEventListener('resize', updateGameAreaSize);
    return () => window.removeEventListener('resize', updateGameAreaSize);
  }, []);

  useEffect(() => {
    // Ensure forest ambience is playing during gameplay
    startForestAmbience();
    
    // Only speak instructions if talkBackEnabled
    if (talkBackEnabled) {
      const creature = creatures.find(c => c.level === level);
      if (creature) {
        speak(`Level ${level}: Find the hidden ${creature.name}. Move your cursor slowly and listen for audio cues. Press Enter when you think you've found it.`);
      }
    }
  }, [level, speak, startForestAmbience]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (gameAreaRef.current && !isFound) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPosition({ x, y });
    }
  }, [isFound]);

  const handleTouch = useCallback((e: React.TouchEvent) => {
    if (gameAreaRef.current && !isFound) {
      e.preventDefault(); // Prevent default scrolling behavior
      const rect = gameAreaRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setCursorPosition({ x, y });
    }
  }, [isFound]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isFound) return;

    // Higher levels have finer movement control required
    const moveDistance = Math.max(10, 25 - (level * 3));
    let newPosition = { ...cursorPosition };

    switch (e.key) {
      case 'ArrowUp':
        newPosition.y = Math.max(0, cursorPosition.y - moveDistance);
        break;
      case 'ArrowDown':
        newPosition.y = Math.min(gameAreaSize.height, cursorPosition.y + moveDistance);
        break;
      case 'ArrowLeft':
        newPosition.x = Math.max(0, cursorPosition.x - moveDistance);
        break;
      case 'ArrowRight':
        newPosition.x = Math.min(gameAreaSize.width, cursorPosition.x + moveDistance);
        break;
      case 'Enter':
      case ' ':
        handleCreatureFound();
        return;
    }

    setCursorPosition(newPosition);
  }, [cursorPosition, gameAreaSize, isFound, level]);

  const handleCreatureFound = useCallback(() => {
    if (isFound) return;

    setIsFound(true);
    
    // Play creature sound after a short delay
    setTimeout(() => {
      console.log('Playing creature sound:', currentCreature.soundFile);
      playSound(currentCreature.soundFile);
    }, 500);
    
    const randomFact = currentCreature.facts[Math.floor(Math.random() * currentCreature.facts.length)];
    setCurrentFact(randomFact);
    setShowFact(true);
    
    // Announce discovery
    speak(`${currentCreature.name} found! Listen for the fun fact.`, 'assertive');
  }, [isFound, currentCreature, playSound, speak]);

  const handleFactComplete = useCallback(() => {
    setShowFact(false);
    onLevelComplete();
  }, [onLevelComplete]);

  const renderAccessibilityMode = () => {
    const commonProps = {
      cursorPosition,
      creaturePosition: scaledCreaturePosition, // Use scaled position
      detectionRadius: currentCreature.detectionRadius,
      gameAreaSize,
      onCreatureFound: handleCreatureFound,
      isFound,
      creature: currentCreature,
      level,
      decoys
    };

    switch (accessibilityMode) {
      case 'audio-first':
        return <AudioMode {...commonProps} />;
      case 'visual-first':
        return <VisualMode {...commonProps} />;
      case 'multi-sensory':
      default:
        return <MultiSensoryMode {...commonProps} />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Game Instructions */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-emerald-300 mb-2">
          Level {level}: The {currentCreature.name} Grove
        </h2>
        <p className="text-emerald-200">
          Use your {accessibilityMode.replace('-', ' ')} to find the hidden {currentCreature.name}
        </p>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative bg-emerald-900/50 rounded-xl border-2 border-emerald-600/30 mx-auto backdrop-blur-sm touch-none"
        style={{ width: '100%', maxWidth: '800px', height: '600px' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouch}
        onTouchStart={(e) => e.preventDefault()} // Prevent default on touchstart
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="application"
        aria-label={`Game area for finding the ${currentCreature.name}. Use arrow keys to move or mouse to explore.`}
      >
        {/* Render decoys */}
        {!isFound && decoys.map(decoy => (
          <div
            key={decoy.id}
            className="absolute opacity-0" // Invisible but still active for proximity
            style={{
              left: decoy.position.x,
              top: decoy.position.y,
              width: 1,
              height: 1
            }}
            aria-hidden="true"
          />
        ))}
      
        {/* Main proximity engine for the real creature */}
        <ProximityEngine
          cursorPosition={cursorPosition}
          creaturePosition={scaledCreaturePosition} // Use scaled position
          detectionRadius={currentCreature.detectionRadius}
          level={level}
          creatureSoundFile={currentCreature.soundFile}
        />
        
        {renderAccessibilityMode()}

        {/* Cursor */}
        {!isFound && (
          <div
            className="absolute w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-300 shadow-lg transition-all duration-100"
            style={{
              left: cursorPosition.x - 8,
              top: cursorPosition.y - 8,
              boxShadow: '0 0 20px rgba(234, 179, 8, 0.6)'
            }}
          />
        )}
      </div>

      {/* Fact Display */}
      {showFact && (
        <CreatureFactBox
          creature={currentCreature}
          fact={currentFact}
          onClose={handleFactComplete}
          onComplete={handleFactComplete}
          talkBackEnabled={talkBackEnabled}
        />
      )}

      {/* Level Indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex gap-1">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className={`w-3 h-3 rounded-full ${
                lvl === level ? 'bg-emerald-400' : 
                lvl < level ? 'bg-emerald-700' : 'bg-emerald-900'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="mt-4 text-center text-sm text-emerald-400 md:hidden">
        Touch and drag to explore • Listen for audio cues
      </div>
      
      {/* Desktop Instructions */}
      <div className="mt-4 text-center text-sm text-emerald-400 hidden md:block">
        Use arrow keys or mouse to explore • Press Enter when you find the creature
      </div>
    </div>
  );
};

export default GameEngine;