// src/utils/sounds.js
class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.3;
        
        // 1. ADD MP3 SOUNDS (INCLUDING WELCOME)
        this.sounds = {
            success: new Audio('/sounds/success.mp3'),
            error: new Audio('/sounds/error.mp3'),
            click: new Audio('/sounds/click.mp3'),
            coin: new Audio('/sounds/coin.mp3'),
            welcome: new Audio('/sounds/welcome.mp3'), // ADDED THIS
        };

        // 2. ADD PRELOAD TO AUDIO OBJECTS
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
            sound.preload = 'auto'; // ADDED THIS - preload sounds
        });
        
        // Renamed to clarify: we use the .mp3 first, then generate as fallback
    }

    // Renamed from play to playGenerated to be used as fallback
    playGenerated(name) {
        if (!this.enabled) return;
        try {
            switch (name) {
                case 'click':
                    this._playOsc({ freq: 1000, type: 'sine', duration: 0.05, gain: 0.25 });
                    break;
                case 'success':
                    // happy arpeggio
                    this._playOsc({ freq: 660, duration: 0.12, gain: 0.26 });
                    this._playOsc({ freq: 880, duration: 0.12, gain: 0.22, when: 0.08 });
                    this._playOsc({ freq: 990, duration: 0.12, gain: 0.2, when: 0.16 });
                    break;
                case 'error':
                    // low, short descending tone
                    this._playOsc({ freq: 220, duration: 0.18, gain: 0.28, type: 'sawtooth' });
                    this._playOsc({ freq: 180, duration: 0.12, gain: 0.18, type: 'sawtooth', when: 0.08 });
                    break;
                case 'coin':
                    // bright beep + tiny sparkle
                    this._playOsc({ freq: 1200, duration: 0.12, gain: 0.32 });
                    this._playOsc({ freq: 1500, duration: 0.08, gain: 0.18, when: 0.06 });
                    break;
                case 'welcome':
                    // little 3-note up arpeggio
                    this._playOsc({ freq: 523.25, duration: 0.12, gain: 0.24 });
                    this._playOsc({ freq: 659.25, duration: 0.12, gain: 0.22, when: 0.09 });
                    this._playOsc({ freq: 783.99, duration: 0.12, gain: 0.2, when: 0.18 });
                    break;
                default:
                    // noop
            }
        } catch (e) {
            // console.warn('sound play failed', e);
        }
    }

    _ensureCtx() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return null;
            this.ctx = new AudioContext();
        }
        return this.ctx;
    }

    _playOsc({ freq = 440, type = 'sine', duration = 0.15, gain = 0.3, when = 0 }) {
        if (!this.enabled) return;
        const ctx = this._ensureCtx();
        if (!ctx) return;
        const now = ctx.currentTime + when;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(gain * this.volume, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.02);
    }
    
    // 3. UPDATE PLAY METHOD FOR RELIABLE CLICKS
    play(soundName) {
        if (!this.enabled) return;
        try {
            // Use the preloaded HTML Audio elements first
            const sound = this.sounds[soundName];
            if (sound) {
                sound.currentTime = 0; // Reset to start for reliable clicks
                sound.play().catch(() => this.playGenerated(soundName)); // Use generated as fallback
            } else {
                this.playGenerated(soundName); // Fallback to generated sound
            }
        } catch (error) {
            // If the HTML Audio method fails (e.g., volume issues), use generated sound
            this.playGenerated(soundName);
        }
    }


    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }

    setVolume(v) {
        this.volume = Math.max(0, Math.min(1, v));
    }
}

const soundManager = new SoundManager();

// convenience named exports used around your app
export const toggleSound = () => soundManager.toggle();
export const isSoundEnabled = () => soundManager.isEnabled();
export const setSoundVolume = (v) => soundManager.setVolume(v);
export const playClick = () => soundManager.play('click');
export const playSuccess = () => soundManager.play('success');
export const playError = () => soundManager.play('error');
export const playCoin = () => soundManager.play('coin');
export const playWelcome = () => soundManager.play('welcome');

export default soundManager;