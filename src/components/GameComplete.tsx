import React, { useEffect } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import { useTalkBack } from '../hooks/useTalkBack';

interface GameCompleteProps {
  onRestart: () => void;
  talkBackEnabled: boolean;
}

const GameComplete: React.FC<GameCompleteProps> = ({ onRestart, talkBackEnabled }) => {
  const { speak } = useTalkBack(talkBackEnabled);

  useEffect(() => {
    if (talkBackEnabled) {
      speak("Congratulations! You have successfully completed all five levels of Echo Grove. You discovered the Owl, Fox, Deer, Squirrel, and Phoenix. Well done, brave explorer!");
    }
  }, [speak, talkBackEnabled]);

  return (
    <div className="max-w-2xl mx-auto text-center p-6">
      <div className="mb-8">
        <Trophy size={80} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-4xl font-bold text-emerald-300 mb-4">
          Adventure Complete!
        </h2>
        <p className="text-xl text-emerald-200 mb-6">
          You've successfully discovered all mystical creatures in Echo Grove!
        </p>
      </div>

      <div className="bg-emerald-800/30 rounded-xl p-6 mb-8 border border-emerald-600/30">
        <h3 className="text-lg font-semibold text-emerald-300 mb-4">Creatures Discovered</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { icon: '🦉', name: 'Owl', level: 1 },
            { icon: '🦊', name: 'Fox', level: 2 },
            { icon: '🦌', name: 'Deer', level: 3 },
            { icon: '🐿️', name: 'Squirrel', level: 4 },
            { icon: '🔥', name: 'Phoenix', level: 5 }
          ].map((creature) => (
            <div key={creature.level} className="text-center">
              <div className="text-4xl mb-2">{creature.icon}</div>
              <div className="text-sm text-emerald-300">{creature.name}</div>
              <div className="text-xs text-emerald-400">Level {creature.level}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-emerald-300 mb-3">
          Thank you for playing Echo Grove!
        </h3>
        <p className="text-emerald-200 leading-relaxed">
          This inclusive game was designed to be enjoyed by players of all abilities. 
          We hope you learned something new about these amazing creatures while 
          exploring the magic of accessible game design.
        </p>
      </div>

      <button
        onClick={onRestart}
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
        aria-label="Restart Echo Grove adventure"
      >
        <div className="flex items-center gap-3">
          <RotateCcw size={24} />
          Play Again
        </div>
      </button>
    </div>
  );
};

export default GameComplete;