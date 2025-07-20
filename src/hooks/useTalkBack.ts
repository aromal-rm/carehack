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
    utterance.rate = 0.85; // Slightly slower for better clarity
    utterance.pitch = 1.1; // Slightly higher pitch for more pleasant sound
    utterance.volume = 0.8;

    // Try to use a smooth, pleasant female or child voice
    const voices = window.speechSynthesis.getVoices();
    
    // First priority: Look for female/child voices from major providers
    let preferredVoice = voices.find(voice => 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') || 
       voice.name.toLowerCase().includes('girl') ||
       voice.name.toLowerCase().includes('child')) && 
      (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Apple')) &&
      voice.lang.startsWith('en')
    );
    
    // Second priority: Any female/child voice
    if (!preferredVoice) {
      preferredVoice = voices.find(voice => 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman') || 
         voice.name.toLowerCase().includes('girl') ||
         voice.name.toLowerCase().includes('child')) &&
        voice.lang.startsWith('en')
      );
    }
    
    // Third priority: Any good quality voice
    if (!preferredVoice) {
      preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log('Using voice:', preferredVoice.name);
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