import React from 'react';
import { Play, TreePine } from 'lucide-react';

interface MenuProps {
  onStartGame: () => void;
  onShowSettings: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStartGame }) => {
  return (
    <div className="text-center max-w-2xl mx-auto px-6">
      <div className="mb-8 flex items-center justify-center gap-4">
        <TreePine size={48} className="text-emerald-400" />
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
          Echo Grove
        </h1>
      </div>
      
      <p className="text-xl md:text-2xl text-emerald-200 mb-4 leading-relaxed">
        An Inclusive Sensory Exploration Adventure
      </p>
      
      <p className="text-lg text-emerald-300 mb-12 max-w-lg mx-auto leading-relaxed">
        Discover mystical creatures hidden in an enchanted forest using your senses. 
        Designed for all abilities with full accessibility support.
      </p>
      
      <button
        onClick={onStartGame}
        className="group bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 shadow-lg hover:shadow-xl"
        aria-label="Start the Echo Grove adventure"
      >
        <div className="flex items-center gap-3">
          <Play size={24} className="group-hover:animate-pulse" />
          Begin Adventure
        </div>
      </button>
      
      <div className="mt-12 text-sm text-emerald-400 space-y-2">
        <p>🎧 Audio-First • 👁️ Visual-First • ⚡ Multi-Sensory</p>
        <p>Fully accessible for visual, auditory, and motor differences</p>
      </div>
      
      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        {['🦉 Owl', '🦊 Fox', '🦌 Deer', '🐿️ Squirrel', '🔥 Phoenix'].map((creature, index) => (
          <div
            key={creature}
            className="bg-emerald-800/30 rounded-lg p-3 border border-emerald-600/30"
          >
            <div className="text-2xl mb-1">{creature.split(' ')[0]}</div>
            <div className="text-xs text-emerald-300">Level {index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;