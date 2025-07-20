import React, { useState, useEffect } from 'react';
import { Volume2, Eye, Zap, Settings } from 'lucide-react';
import GameEngine from './components/GameEngine';
import Menu from './components/Menu';
import AccessibilitySettings from './components/AccessibilitySettings';
import LevelIntro from './components/LevelIntro';
import GameComplete from './components/GameComplete';
import { GameState, AccessibilityMode } from './types/GameTypes';
import { useAudio } from './hooks/useAudio';
import { useTalkBack } from './hooks/useTalkBack';

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [accessibilityMode, setAccessibilityMode] = useState<AccessibilityMode>('multi-sensory');
  const [showSettings, setShowSettings] = useState(false);
  const [talkBackEnabled, setTalkBackEnabled] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const { playSound, initializeAudio, startForestAmbience, stopForestAmbience } = useAudio();
  const { speak } = useTalkBack(talkBackEnabled);

  useEffect(() => {
    // Initialize audio on first user interaction
    const handleFirstInteraction = async () => {
      console.log('First user interaction detected, initializing audio...');
      try {
        await initializeAudio();
        setAudioInitialized(true);
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [initializeAudio]);

  // Start ambient sound when game begins (not just when reaching a level)
  useEffect(() => {
    if (gameState === 'levelIntro' || gameState === 'playing') {
      console.log("Game active, ensuring ambient sound is playing...");
      startForestAmbience();
    } else if (gameState === 'menu' || gameState === 'complete') {
      // Optionally stop ambient when returning to menu
      stopForestAmbience();
    }
  }, [gameState, startForestAmbience, stopForestAmbience]);

  useEffect(() => {
    if (gameState === 'menu') {
      speak("Welcome to Echo Grove, an inclusive sensory exploration game. Navigate to start your magical journey.");
    }
  }, [gameState, speak, talkBackEnabled]);

  const handleStartGame = async () => {
    console.log("Starting the game and ambient sound...");
    
    try {
      // Ensure audio is initialized first if not already
      if (!audioInitialized) {
        await initializeAudio();
        setAudioInitialized(true);
      }
      
      // Start the game
      setGameState('levelIntro');
      setCurrentLevel(1);
      
      // Start ambient sound immediately when adventure begins
      await startForestAmbience();
      console.log("Forest ambience should be playing now");
    } catch (error) {
      console.error("Error starting game:", error);
      // Still try to start the game even if audio fails
      setGameState('levelIntro');
      setCurrentLevel(1);
    }
  };

  const handleLevelStart = () => {
    setGameState('playing');
  };

  const handleLevelComplete = () => {
    if (currentLevel < 5) {
      setCurrentLevel(currentLevel + 1);
      setGameState('levelIntro');
    } else {
      setGameState('complete');
    }
  };

  const handleRestart = () => {
    setGameState('menu');
    setCurrentLevel(1);
    stopForestAmbience(); // Stop ambient sound when restarting
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
    speak(showSettings ? "Settings closed" : "Settings opened");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-green-800 to-emerald-900 text-white relative overflow-hidden">
      {/* Background Forest Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-600 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-green-500 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-emerald-500 rounded-full blur-2xl"></div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <AccessibilitySettings
          accessibilityMode={accessibilityMode}
          setAccessibilityMode={setAccessibilityMode}
          talkBackEnabled={talkBackEnabled}
          setTalkBackEnabled={setTalkBackEnabled}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Settings Button */}
      <button
        onClick={handleSettingsToggle}
        className="absolute top-4 right-4 z-50 p-3 bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label="Toggle accessibility settings"
      >
        <Settings size={24} />
      </button>

      {/* Accessibility Mode Indicator */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-emerald-800/80 px-3 py-2 rounded-lg">
        {accessibilityMode === 'audio-first' && <Volume2 size={20} />}
        {accessibilityMode === 'visual-first' && <Eye size={20} />}
        {accessibilityMode === 'multi-sensory' && <Zap size={20} />}
        <span className="text-sm font-medium capitalize">
          {accessibilityMode.replace('-', ' ')} Mode
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        {gameState === 'menu' && (
          <Menu onStartGame={handleStartGame} onShowSettings={handleSettingsToggle} />
        )}
        
        {gameState === 'levelIntro' && (
          <LevelIntro
            level={currentLevel}
            onStart={handleLevelStart}
            accessibilityMode={accessibilityMode}
          />
        )}
        
        {gameState === 'playing' && (
          <GameEngine
            level={currentLevel}
            accessibilityMode={accessibilityMode}
            onLevelComplete={handleLevelComplete}
            talkBackEnabled={talkBackEnabled}
          />
        )}
        
        {gameState === 'complete' && (
          <GameComplete onRestart={handleRestart} talkBackEnabled={talkBackEnabled} />
        )}
      </div>
    </div>
  );
}

export default App;