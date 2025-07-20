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
    utterance.rate = 0.9; // Slightly slower for better clarity and smoother sound
    utterance.pitch = 1.15; // Slightly higher pitch for more feminine/child-like sound
    utterance.volume = 0.85; // Slightly louder for better clarity

    // Try to use a smooth, pleasant female or child voice
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    
    // Known smooth female voices by specific name (common across platforms)
    const knownSmoothVoices = [
      'Google UK English Female', 
      'Microsoft Zira', 
      'Samantha',
      'Google US English Female',
      'Microsoft Hazel',
      'Karen',
      'Victoria'
    ];
    
    // First priority: Look for known smooth female voices
    let preferredVoice = voices.find(voice => 
      knownSmoothVoices.includes(voice.name) && 
      voice.lang.startsWith('en')
    );
    
    // Second priority: Look for female/child voices from major providers
    if (!preferredVoice) {
      preferredVoice = voices.find(voice => 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman') || 
         voice.name.toLowerCase().includes('girl') ||
         voice.name.toLowerCase().includes('child')) && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Apple')) &&
        voice.lang.startsWith('en')
      );
    }
    
    // Third priority: Any female/child voice
    if (!preferredVoice) {
      preferredVoice = voices.find(voice => 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman') || 
         voice.name.toLowerCase().includes('girl') ||
         voice.name.toLowerCase().includes('child')) &&
        voice.lang.startsWith('en')
      );
    }
    
    // Fourth priority: Any good quality voice
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