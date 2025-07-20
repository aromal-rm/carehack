import { useCallback, useRef } from 'react';

export const useTalkBack = (enabled: boolean) => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenTextRef = useRef<string>('');

  const speak = useCallback((text: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!enabled || !window.speechSynthesis) return;

    // Prevent repetition of the same text
    if (lastSpokenTextRef.current === text && priority !== 'assertive') {
      return;
    }
    lastSpokenTextRef.current = text;
    // Cancel any current speech if assertive
    if (priority === 'assertive' && utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Try to use a clear, natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      // Clear the last spoken text after speech ends
      setTimeout(() => {
        lastSpokenTextRef.current = '';
      }, 1000);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [enabled]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    lastSpokenTextRef.current = '';
  }, []);

  return { speak, stop };
};