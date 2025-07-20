import React from 'react';
import { Play } from 'lucide-react';
import { AccessibilityMode } from '../types/GameTypes';
import { creatures } from '../data/creatures';
import { useAudio } from '../hooks/useAudio';

interface LevelIntroProps {
  level: number;
  onStart: () => void;
  accessibilityMode: AccessibilityMode;
}

const LevelIntro: React.FC<LevelIntroProps> = ({ level, onStart, accessibilityMode }) => {
  const creature = creatures[level - 1];
  const { startForestAmbience } = useAudio();

  const getInstructions = () => {
    const baseInstructions = `Level ${level}: Welcome to the ${creature.name} Grove. `;
    
    switch (accessibilityMode) {
      case 'audio-first':
        return baseInstructions + `Listen carefully for spatial audio cues. Use arrow keys to move your cursor. The sound will get higher in pitch and louder as you get closer to the ${creature.name}. When you're very close, the creature will be automatically found.`;
      case 'visual-first':
        return baseInstructions + `Watch for visual feedback on the screen. The area will glow brighter and show patterns as you get closer to the ${creature.name}. Use your mouse or arrow keys to explore.`;
      case 'multi-sensory':
      default:
        return baseInstructions + `Use all your senses to find the ${creature.name}. Listen for audio cues, watch for visual feedback, and feel haptic vibrations if available. Move slowly and pay attention to the feedback.`;
    }
  };

  const getDifficultyDescription = () => {
    const descriptions = [
      "Large detection area, clear feedback",
      "Medium detection area, faster feedback",
      "Smaller area, more distractors", 
      "Very small area, overlapping zones",
      "Minimal feedback until very close"
    ];
    return descriptions[level - 1] || descriptions[0];
  };

  // Handle starting ambient sound when the button is clicked
  const handleStartGame = () => {
    // Start ambient forest sound that will play throughout the game
    startForestAmbience();
    // Then trigger the regular onStart handler
    onStart();
  };

  return (
    <div className="max-w-2xl mx-auto text-center p-6">
      <div className="mb-8">
        <div className="text-8xl mb-4">{creature.icon}</div>
        <h2 className="text-4xl font-bold text-emerald-300 mb-2">
          Level {level}: The {creature.name} Grove
        </h2>
        <p className="text-xl text-emerald-200 mb-4">
          {getDifficultyDescription()}
        </p>
      </div>

      <div className="bg-emerald-800/30 rounded-xl p-6 mb-8 border border-emerald-600/30">
        <h3 className="text-lg font-semibold text-emerald-300 mb-3">Instructions</h3>
        <p className="text-emerald-200 leading-relaxed">
          {getInstructions()}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
        <div className="bg-emerald-900/40 p-3 rounded-lg">
          <div className="font-semibold text-emerald-300">Controls</div>
          <div className="text-emerald-200">
            {accessibilityMode === 'audio-first' 
              ? 'Arrow keys to move'
              : 'Mouse or arrow keys'
            }
          </div>
        </div>
        <div className="bg-emerald-900/40 p-3 rounded-lg">
          <div className="font-semibold text-emerald-300">Discovery</div>
          <div className="text-emerald-200">
            Press Enter or get very close
          </div>
        </div>
        <div className="bg-emerald-900/40 p-3 rounded-lg">
          <div className="font-semibold text-emerald-300">Mode</div>
          <div className="text-emerald-200 capitalize">
            {accessibilityMode.replace('-', ' ')}
          </div>
        </div>
      </div>

      <button
        onClick={handleStartGame}
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
        aria-label={`Start Level ${level}: Find the ${creature.name}`}
      >
        <div className="flex items-center gap-3">
          <Play size={24} />
          Begin Search
        </div>
      </button>
    </div>
  );
};

export default LevelIntro;