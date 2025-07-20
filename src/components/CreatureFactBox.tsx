import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { Creature } from '../types/GameTypes';
import { useTalkBack } from '../hooks/useTalkBack';

interface CreatureFactBoxProps {
  creature: Creature;
  fact: string;
  onClose: () => void;
  onComplete: () => void;
  talkBackEnabled: boolean;
}

const CreatureFactBox: React.FC<CreatureFactBoxProps> = ({ creature, fact, onClose, onComplete, talkBackEnabled }) => {
  const { speak } = useTalkBack(talkBackEnabled);
  const [isNarrating, setIsNarrating] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const hasSpoken = useRef(false);
  const completedRef = useRef(false);
  const timersRef = useRef<{
    speechTimer?: ReturnType<typeof setTimeout>;
    countdownInterval?: ReturnType<typeof setInterval>;
  }>({});

  useEffect(() => {
    // Clear any existing timers
    if (timersRef.current.speechTimer) {
      clearTimeout(timersRef.current.speechTimer);
    }
    if (timersRef.current.countdownInterval) {
      clearInterval(timersRef.current.countdownInterval);
    }
    
    const startCountdown = () => {
      setIsNarrating(false);
      let countdownValue = 5;
      setCountdown(countdownValue);

      timersRef.current.countdownInterval = setInterval(() => {
        countdownValue--;
        setCountdown(countdownValue);

        if (countdownValue <= 0) {
          if (timersRef.current.countdownInterval) {
            clearInterval(timersRef.current.countdownInterval);
            timersRef.current.countdownInterval = undefined;
          }
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }
      }, 1000);
    };
    
    if (!hasSpoken.current && talkBackEnabled) {
      // We don't need to play the creature sound again, just narrate the fact
      const fullText = `Congratulations! You found the ${creature.name}! Here's an interesting fact: ${fact}`;
      speak(fullText);
      hasSpoken.current = true;
      
      // Estimate speech duration
      const wordCount = fullText.split(' ').length;
      const estimatedDuration = (wordCount / 150) * 60 * 1000;
      const minDuration = 5000;
      const speechDuration = Math.max(estimatedDuration, minDuration);
      
      timersRef.current.speechTimer = setTimeout(startCountdown, speechDuration);
    } else if (!talkBackEnabled) {
      // If talkback is disabled, skip narration and go straight to countdown
      startCountdown();
    }
    
    return () => {
      if (timersRef.current.speechTimer) {
        clearTimeout(timersRef.current.speechTimer);
      }
      if (timersRef.current.countdownInterval) {
        clearInterval(timersRef.current.countdownInterval);
      }
    };
  }, [creature.name, fact, speak, onComplete, talkBackEnabled]);

  useEffect(() => {
    return () => {
      if (timersRef.current.speechTimer) {
        clearTimeout(timersRef.current.speechTimer);
      }
      if (timersRef.current.countdownInterval) {
        clearInterval(timersRef.current.countdownInterval);
      }
    };
  }, []);

  // Ensure onComplete is called if user closes after narration/countdown
  const handleClose = () => {
    onClose();
    // Always advance to next level when closed
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-emerald-800 rounded-2xl p-8 max-w-2xl w-full border-2 border-emerald-500 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{creature.icon}</div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-300">
                {creature.name} Found!
              </h3>
              <p className="text-emerald-200">Did you know?</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-emerald-300 hover:text-white transition-colors p-2"
            aria-label="Close fact box"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-emerald-900/50 rounded-lg p-6 mb-6">
          <p className="text-lg text-emerald-100 leading-relaxed">
            {fact}
          </p>
        </div>

        <div className="text-center">
          {isNarrating ? (
            <p className="text-emerald-300 text-sm animate-pulse">
              🔊 Narrating fact...
            </p>
          ) : (
            <>
              <p className="text-emerald-300 text-sm">
                {countdown > 0 ? `Advancing to next level in ${countdown} seconds...` : 'Advancing...'}
              </p>
              <div className="mt-4 bg-emerald-700/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatureFactBox;