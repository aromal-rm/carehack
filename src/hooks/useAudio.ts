import { useCallback, useRef, useEffect } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeTonesRef = useRef<Set<OscillatorNode>>(new Set());
  const forestAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const isInitializedRef = useRef(false);

  // Track currently active creature sounds
  const activeCreatureSoundsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  const initializeAudio = useCallback(async () => {
    if (isInitializedRef.current) {
      console.log('Audio already initialized');
      return;
    }
    
    try {
      console.log('Initializing audio system...');
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context on user interaction if needed
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      console.log('Audio context state:', audioContextRef.current.state);

      // Preload sound files
      const soundFiles = [
        'owl.mp3',
        'fox.mp3', 
        'deer.mp3',
        'squirrel.mp3',
        'phoenix.mp3'
      ];

      soundFiles.forEach(soundFile => {
        const audio = new Audio(`sounds/creatures/${soundFile}`);
        audio.preload = 'auto';
        audio.volume = 0.7;
        audio.onerror = () => {
          console.warn(`Could not load sound file: ${soundFile}`);
        };
        audio.oncanplaythrough = () => {
          console.log(`Successfully loaded: ${soundFile}`);
        };
        audioElementsRef.current.set(`sounds/creatures/${soundFile}`, audio);
      });

      // Preload forest ambience separately
      const forestAudio = new Audio('sounds/ambient/forest.mp3');
      forestAudio.preload = 'auto';
      forestAudio.loop = true;
      forestAudio.volume = 0.3;
      forestAudio.onerror = (e) => {
        console.warn('Could not load forest ambience file:', e);
      };
      forestAudio.oncanplaythrough = () => {
        console.log('Successfully loaded: forest.mp3');
      };
      forestAudioRef.current = forestAudio;
      
      isInitializedRef.current = true;
      console.log('Audio system initialized successfully');
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      throw error; // Re-throw to handle in the calling function
    }
  }, []);

  const startForestAmbience = useCallback(async () => {
    console.log('Attempting to start forest ambience...');
    
    // Make sure audio is initialized
    if (!isInitializedRef.current) {
      await initializeAudio();
    }
    
    if (!forestAudioRef.current) {
      console.error('Forest ambience not loaded yet, creating now');
      const forestAudio = new Audio('sounds/ambient/forest.mp3');
      forestAudio.loop = true;
      forestAudio.volume = 0.3;
      forestAudioRef.current = forestAudio;
    }
    
    if (forestAudioRef.current) {
      try {
        // Ensure audio context is running
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        if (forestAudioRef.current.paused) {
          const playPromise = forestAudioRef.current.play();
          playPromise.then(() => {
            console.log('Forest ambience started successfully');
          }).catch((error) => {
            console.warn('Could not play forest ambience:', error);
          });
        } else {
          console.log('Forest ambience already playing');
        }
      } catch (error) {
        console.error('Error starting forest ambience:', error);
      }
    } else {
      console.error('Forest ambience audio element not available');
    }
  }, [initializeAudio]);

  const stopForestAmbience = useCallback(() => {
    if (forestAudioRef.current && !forestAudioRef.current.paused) {
      forestAudioRef.current.pause();
      forestAudioRef.current.currentTime = 0;
    }
  }, []);

  const playTone = useCallback((frequency: number, volume: number, duration: number) => {
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration / 1000);

      activeTonesRef.current.add(oscillator);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);

      oscillator.onended = () => {
        activeTonesRef.current.delete(oscillator);
      };
    } catch (error) {
      console.warn('Error playing tone:', error);
    }
  }, []);

  const playSpatialAudio = useCallback((frequency: number, volume: number, pan: number, duration: number) => {
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      const pannerNode = audioContextRef.current.createStereoPanner();

      oscillator.connect(gainNode);
      gainNode.connect(pannerNode);
      pannerNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = 'sine';

      // Clamp pan value between -1 and 1
      const clampedPan = Math.max(-1, Math.min(1, pan));
      pannerNode.pan.setValueAtTime(clampedPan, audioContextRef.current.currentTime);

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration / 1000);

      activeTonesRef.current.add(oscillator);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);

      oscillator.onended = () => {
        activeTonesRef.current.delete(oscillator);
      };
    } catch (error) {
      console.warn('Error playing spatial audio:', error);
    }
  }, []);

  const playSound = useCallback(async (soundFile: string) => {
    console.log(`Attempting to play sound: ${soundFile}`);
    // Fix: Remove leading slash for relative path
    const fullPath = soundFile.startsWith('sounds/') ? soundFile : `sounds/creatures/${soundFile}`;
    // Ensure audio is initialized
    if (!isInitializedRef.current) {
      await initializeAudio();
    }
    const audio = audioElementsRef.current.get(fullPath);
    if (audio) {
      try {
        audio.currentTime = 0;
        audio.volume = 0.8;
        await audio.play();
        console.log(`Successfully playing sound: ${fullPath}`);
        return;
      } catch (error) {
        console.warn(`Could not play sound file: ${fullPath}`, error);
      }
    } else {
      console.warn(`Sound file not found: ${fullPath}`);
      console.log('Available sounds:', Array.from(audioElementsRef.current.keys()));
    }
  }, [initializeAudio]);

  const playCreatureProximitySound = useCallback((creatureType: string, proximity: number) => {
    if (!audioContextRef.current || proximity <= 0) return;

    const creatureFrequencies: { [key: string]: number } = {
      'owl': 400,
      'fox': 600, 
      'deer': 300,
      'squirrel': 800,
      'phoenix': 500
    };

    const baseFreq = creatureFrequencies[creatureType] || 400;
    const frequency = baseFreq + (proximity * 200);
    const volume = proximity * 0.3;
    
    playTone(frequency, volume, 200);
  }, [playTone]);

  const playCreatureSoundWithProximity = useCallback(async (creatureSound: string, proximity: number) => {
    console.log(`Proximity feedback for sound: ${creatureSound} with proximity: ${proximity}`);
    
    // Lower threshold to start audio from farther away (from 0.2 to 0.1)
    const isInRadius = proximity > 0.1;
    
    try {
      // Make sure audio is initialized
      if (!isInitializedRef.current) {
        await initializeAudio();
      }
      
      // Get full path for the sound
      const fullPath = creatureSound.startsWith('sounds/') ? creatureSound : `sounds/creatures/${creatureSound}`;
      
      // Check if we're already playing this creature sound
      const activeSound = activeCreatureSoundsRef.current.get(fullPath);
      
      if (isInRadius) {
        // Cursor is within radius - start or adjust sound
        let audio = activeSound;
        
        // If not already playing, start the sound
        if (!audio || audio.paused) {
          console.log(`Starting new continuous playback for: ${fullPath}`);
          
          // Get or create audio element
          audio = audioElementsRef.current.get(fullPath);
          if (!audio) {
            audio = new Audio(fullPath);
            audio.preload = 'auto';
            audio.loop = true; // Make it loop continuously
            audioElementsRef.current.set(fullPath, audio);
          }
          
          // Store as active sound
          activeCreatureSoundsRef.current.set(fullPath, audio);
          
          // Start with a lower volume and play immediately
          audio.volume = 0.1;
          
          try {
            await audio.play();
            console.log(`Successfully started playback for: ${fullPath}`);
            
            // Now apply the real volume after playback has started
            // Create a more dynamic volume curve using exponential scaling for better perception
            // Minimum volume 0.1, maximum 1.0 with non-linear scaling
            const volumeCurve = Math.pow(proximity, 1.5); // Exponent enhances differences
            const volume = 0.1 + (volumeCurve * 0.9); // Scale from 0.1 to 1.0
            console.log(`Setting initial volume to ${volume.toFixed(2)} for proximity ${proximity.toFixed(2)}`);
            audio.volume = volume;
          } catch (error) {
            console.error(`Error starting playback: ${error}`);
          }
        } else {
          // Sound is already playing, update volume based on proximity
          // Use exponential curve for more noticeable changes in volume
          const volumeCurve = Math.pow(proximity, 1.5); // Non-linear scaling
          const volume = 0.1 + (volumeCurve * 0.9); // Scale from 0.1 to 1.0
          
          // Only update if volume change is significant enough to be noticeable
          if (Math.abs(audio.volume - volume) > 0.05) {
            console.log(`Updating volume to ${volume.toFixed(2)} for proximity ${proximity.toFixed(2)}`);
            audio.volume = volume;
          }
        }
      } else if (activeSound && !activeSound.paused) {
        // Cursor exited radius - stop the sound
        console.log(`Stopping sound as cursor left radius: ${fullPath}`);
        activeSound.pause();
        activeSound.currentTime = 0;
        activeCreatureSoundsRef.current.delete(fullPath);
      }
    } catch (error) {
      console.error('Error in playCreatureSoundWithProximity:', error);
    }
  }, [initializeAudio]);

  // Clean up all active sounds when component unmounts
  useEffect(() => {
    return () => {
      // Stop any active creature sounds
      activeCreatureSoundsRef.current.forEach((audio) => {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      activeCreatureSoundsRef.current.clear();
    };
  }, []);

  return {
    initializeAudio,
    playTone,
    playSound,
    playSpatialAudio,
    startForestAmbience,
    stopForestAmbience,
    playCreatureProximitySound,
    playCreatureSoundWithProximity
  };
};