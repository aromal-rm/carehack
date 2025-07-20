export type GameState = 'menu' | 'levelIntro' | 'playing' | 'complete';

export type AccessibilityMode = 'audio-first' | 'visual-first' | 'multi-sensory';

export interface Creature {
  id: string;
  name: string;
  level: number;
  position: { x: number; y: number };
  detectionRadius: number;
  soundFile: string;
  facts: string[];
  color: string;
  icon: string;
}

export interface ProximityFeedback {
  distance: number;
  intensity: number;
  audioFrequency: number;
  visualBrightness: number;
  hapticStrength: number;
}

export interface GameConfig {
  creatures: Creature[];
  difficultySettings: {
    [key: number]: {
      detectionRadius: number;
      distractorCount: number;
      feedbackDelay: number;
    };
  };
}