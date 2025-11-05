// Sound Manager with both pre-recorded and generated sounds

class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.3; // 30% volume (adjustable)
    
    // Load pre-recorded sounds if available
    this.sounds = {
      success: new Audio('/sounds/success.mp3'),
      error: new Audio('/sounds/error.mp3'),
      click: new Audio('/sounds/click.mp3'),
      coin: new Audio('/sounds/coin.mp3'),
      welcome: new Audio('/sounds/welcome.mp3'),
    };

    // Set volume for all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });

    // Check if sounds loaded successfully
    this.useFallback = false;
    Object.values(this.sounds).forEach(sound => {
      sound.addEventListener('error', () => {
        this.useFallback = true;
      });
    });
  }

  // Play a sound
  play(soundName) {
    if (!this.enabled) return;

    try {
      // Try to play pre-recorded sound
      if (!this.useFallback && this.sounds[soundName]) {
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = this.volume;
        sound.play().catch(() => {
          // If it fails, use generated sound
          this.playGenerated(soundName);
        });
      } else {
        // Use generated sound
        this.playGenerated(soundName);
      }
    } catch (error) {
      console.log('Sound playback failed:', error);
    }
  }

  // Generate sounds using Web Audio API (fallback)
  playGenerated(soundName) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);


    // Different sounds have different frequencies and patterns
    switch(soundName) {
      case 'success':
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        // Add second note for harmony
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 659.25; // E5
          gain2.gain.setValueAtTime(this.volume, audioContext.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          osc2.start(audioContext.currentTime);
          osc2.stop(audioContext.currentTime + 0.3);
        }, 100);
        break;

      case 'error':
        oscillator.frequency.value = 200; // Lower frequency
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;

      case 'click':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(this.volume * 0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
        break;

      case 'coin':
        oscillator.frequency.value = 1000;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);

        case 'welcome':
  // Upward arpeggio - sounds welcoming and positive
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, index) => {
    setTimeout(() => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(this.volume * 0.6, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.3);
    }, index * 100);
  });
  break;

        
        // Add sparkle effect
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 1500;
          osc2.type = 'sine';
          gain2.gain.setValueAtTime(this.volume * 0.5, audioContext.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          osc2.start(audioContext.currentTime);
          osc2.stop(audioContext.currentTime + 0.15);
        }, 50);
        break;

      default:
        console.warn('Unknown sound:', soundName);
    }
  }

  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Set volume (0.0 to 1.0)
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }

  // Check if sounds are enabled
  isEnabled() {
    return this.enabled;
  }
}

// Create a singleton instance
const soundManager = new SoundManager();

// Export easy-to-use functions
export const playSuccess = () => soundManager.play('success');
export const playError = () => soundManager.play('error');
export const playClick = () => soundManager.play('click');
export const playCoin = () => soundManager.play('coin');
export const toggleSound = () => soundManager.toggle();
export const setSoundVolume = (vol) => soundManager.setVolume(vol);
export const isSoundEnabled = () => soundManager.isEnabled();
export const playWelcome = () => soundManager.play('welcome');

export default soundManager;

