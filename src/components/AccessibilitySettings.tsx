import React from 'react';
import { Volume2, Eye, Zap, X } from 'lucide-react';
import { AccessibilityMode } from '../types/GameTypes';

interface AccessibilitySettingsProps {
  accessibilityMode: AccessibilityMode;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
  talkBackEnabled: boolean;
  setTalkBackEnabled: (enabled: boolean) => void;
  onClose: () => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  accessibilityMode,
  setAccessibilityMode,
  talkBackEnabled,
  setTalkBackEnabled,
  onClose
}) => {
  const modes = [
    {
      id: 'audio-first' as AccessibilityMode,
      icon: Volume2,
      title: 'Audio-First Mode',
      description: 'Optimized for blind and visually impaired players with spatial audio and keyboard navigation'
    },
    {
      id: 'visual-first' as AccessibilityMode,
      icon: Eye,
      title: 'Visual-First Mode',
      description: 'Enhanced visual feedback with colorblind-friendly patterns and clear visual cues'
    },
    {
      id: 'multi-sensory' as AccessibilityMode,
      icon: Zap,
      title: 'Multi-Sensory Mode',
      description: 'Combines audio, visual, and haptic feedback for a rich sensory experience'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-emerald-800 rounded-2xl p-8 max-w-2xl w-full border-2 border-emerald-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-300">Accessibility Settings</h2>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white transition-colors p-2"
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-emerald-300">Gameplay Mode</h3>
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setAccessibilityMode(mode.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  accessibilityMode === mode.id
                    ? 'border-emerald-400 bg-emerald-700/50'
                    : 'border-emerald-600/30 bg-emerald-900/30 hover:border-emerald-500'
                }`}
                aria-pressed={accessibilityMode === mode.id}
              >
                <div className="flex items-start gap-3">
                  <Icon size={24} className="text-emerald-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-emerald-300">{mode.title}</h4>
                    <p className="text-sm text-emerald-200 mt-1">{mode.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-emerald-600/30 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-emerald-300">Talk-Back Narration</h3>
              <p className="text-sm text-emerald-200">
                Provides spoken instructions and feedback
              </p>
            </div>
            <button
              onClick={() => setTalkBackEnabled(!talkBackEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                talkBackEnabled ? 'bg-emerald-600' : 'bg-gray-600'
              }`}
              aria-pressed={talkBackEnabled}
              aria-label="Toggle talk-back narration"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  talkBackEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;