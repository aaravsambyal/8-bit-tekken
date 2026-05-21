/**
 * NEO SHATTER: 8-Bit Tournament
 * Core Game Engine
 * Developed for DeepMind Antigravity Studio pair-programming
 */

// ==========================================
// 1. SOUND & MUSIC SYNTHESIZER (Web Audio)
// ==========================================
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicInterval = null;
    this.musicTempo = 165; // Intense fighting game BPM
    this.musicBeatStep = 0;
    
    // 64-step high-energy E minor fighting theme
    this.musicLead = [
      329, 329, 0,   329, 392, 0,   440, 0,
      329, 329, 0,   293, 329, 0,   0,   0,
      329, 329, 0,   329, 493, 0,   440, 0,
      392, 0,   329, 0,   293, 0,   0,   0,
      659, 659, 0,   659, 783, 0,   880, 0,
      659, 659, 0,   587, 659, 0,   0,   0,
      987, 0,   880, 0,   783, 0,   659, 0,
      587, 0,   0,   0,   392, 440, 493, 587
    ];
    this.musicBass = [
      82, 82, 82, 82, 82, 82, 82, 82,
      73, 73, 73, 73, 73, 73, 73, 73,
      82, 82, 82, 82, 82, 82, 82, 82,
      98, 98, 98, 98, 110, 110, 110, 110,
      82, 82, 82, 82, 82, 82, 82, 82,
      73, 73, 73, 73, 73, 73, 73, 73,
      82, 82, 82, 82, 82, 82, 82, 82,
      123, 123, 123, 123, 110, 110, 110, 110
    ];
  }

  init() {
    if (this.ctx) return;
    // Create AudioContext on user gesture
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.muted;
  }

  playSFX(type) {
    if (this.muted || !this.ctx) return;
    
    // Resume context if suspended (browser security)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const now = this.ctx.currentTime;
      switch (type) {
        case 'select': {
          // Quick high-pitch retro beep
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }
        case 'start': {
          // Retro start chime arpeggio
          const notes = [261.63, 329.63, 392.00, 523.25]; // C major triad
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.15, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.15);
          });
          break;
        }
        case 'punch': {
          // Energetic Punch: Heavy sub-bass thump + sharp mid-range smack + noise burst
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain1 = this.ctx.createGain();
          const gain2 = this.ctx.createGain();
          
          osc1.type = 'sine'; // Sub drop
          osc1.frequency.setValueAtTime(150, now);
          osc1.frequency.exponentialRampToValueAtTime(20, now + 0.15);
          gain1.gain.setValueAtTime(0.8, now);
          gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          
          osc2.type = 'square'; // Smack
          osc2.frequency.setValueAtTime(300, now);
          osc2.frequency.exponentialRampToValueAtTime(100, now + 0.05);
          gain2.gain.setValueAtTime(0.3, now);
          gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

          osc1.connect(gain1); gain1.connect(this.ctx.destination);
          osc2.connect(gain2); gain2.connect(this.ctx.destination);
          
          osc1.start(now); osc1.stop(now + 0.15);
          osc2.start(now); osc2.stop(now + 0.05);
          
          this.playNoise(0.1, 0.5, 1200); // Sharp swoosh/smack noise
          break;
        }
        case 'kick': {
          // Energetic Kick: Deep heavy sweep with a sharp snap
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain1 = this.ctx.createGain();
          const gain2 = this.ctx.createGain();
          
          osc1.type = 'sine'; // Sub boom
          osc1.frequency.setValueAtTime(200, now);
          osc1.frequency.exponentialRampToValueAtTime(20, now + 0.2);
          gain1.gain.setValueAtTime(1.0, now);
          gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          
          osc2.type = 'triangle'; // Snap
          osc2.frequency.setValueAtTime(400, now);
          osc2.frequency.exponentialRampToValueAtTime(50, now + 0.1);
          gain2.gain.setValueAtTime(0.5, now);
          gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

          osc1.connect(gain1); gain1.connect(this.ctx.destination);
          osc2.connect(gain2); gain2.connect(this.ctx.destination);
          
          osc1.start(now); osc1.stop(now + 0.2);
          osc2.start(now); osc2.stop(now + 0.1);
          
          this.playNoise(0.15, 0.6, 800); // Heavier wind noise
          break;
        }
        case 'block': {
          // Solid Metallic Clang
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
          this.playNoise(0.05, 0.4, 3000); // Sharp clink
          break;
        }
        case 'hit': {
          // Visceral crunch and explosion
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.linearRampToValueAtTime(10, now + 0.2);
          gain.gain.setValueAtTime(0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          
          this.playNoise(0.2, 1.2, 500); // VERY loud explosion noise
          break;
        }
        case 'special': {
          // Anime beam charge up -> boom
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(50, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.8);
          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.6, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.8);
          
          setTimeout(() => this.playNoise(0.4, 1.0, 1000), 400); // Boom at peak
          break;
        }
        case 'jump': {
          // Sine sweep up
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(350, now + 0.12);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }
        case 'ko': {
          // Dramatic game over chime
          const chimeNotes = [440, 415, 392, 311];
          chimeNotes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.15);
            gain.gain.setValueAtTime(0.2, now + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.3);
          });
          break;
        }
        case 'victory': {
          // Uplifting victory fanfare
          const notes = [293.66, 349.23, 440.00, 587.33, 587.33, 587.33];
          const durations = [0.1, 0.1, 0.1, 0.15, 0.15, 0.4];
          let accumulatedTime = 0;
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + accumulatedTime);
            gain.gain.setValueAtTime(0.2, now + accumulatedTime);
            gain.gain.exponentialRampToValueAtTime(0.01, now + accumulatedTime + durations[idx]);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + accumulatedTime);
            osc.stop(now + accumulatedTime + durations[idx]);
            accumulatedTime += durations[idx] * 0.8;
          });
          break;
        }
      }
    } catch(e) {
      console.warn("Audio Context Error: ", e);
    }
  }

  playNoise(duration, volume, filterFreq) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Create static noise buffer
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to shape the noise
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noiseNode.start(now);
    noiseNode.stop(now + duration);
  }

  startMusic() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stopMusic();

    const beatDuration = 60 / this.musicTempo / 2; // Eighth notes
    this.musicInterval = setInterval(() => {
      if (this.muted || !this.ctx) return;
      
      const now = this.ctx.currentTime;
      const step = this.musicBeatStep % this.musicLead.length;
      
      // Play Lead channel
      const leadFreq = this.musicLead[step];
      if (leadFreq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(leadFreq, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + beatDuration * 0.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + beatDuration * 0.9);
      }

      // Play Bass channel (pumping 16th notes)
      const bassFreq = this.musicBass[step];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(bassFreq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + beatDuration * 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + beatDuration * 0.8);

      // Play Drum channel (Heavy kick & snare)
      if (this.musicBeatStep % 4 === 0) {
        // Thump Kick
        const kOsc = this.ctx.createOscillator();
        const kGain = this.ctx.createGain();
        kOsc.type = 'sine';
        kOsc.frequency.setValueAtTime(150, now);
        kOsc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
        kGain.gain.setValueAtTime(0.5, now);
        kGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        kOsc.connect(kGain); kGain.connect(this.ctx.destination);
        kOsc.start(now); kOsc.stop(now + 0.1);
      } 
      
      if (this.musicBeatStep % 4 === 2) {
        // Snare burst
        this.playNoise(0.08, 0.12, 2000);
      }
      
      if (this.musicBeatStep % 2 === 1 || this.musicBeatStep % 4 === 0) {
        // Driving hi-hat
        this.playNoise(0.02, 0.04, 8000);
      }

      this.musicBeatStep++;
    }, beatDuration * 1000);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

// Instantiate Sound Engine
const audio = new SoundSynth();

// ==========================================
// 1.5 IMAGE ASSET LOADER (Sprites)
// ==========================================
class ImageLoader {
  constructor() {
    this.sprites = {};
    this.bgImage = null;
    this.loaded = 0;
    this.total = 5; // 4 characters + 1 background
  }
  
  loadAll(callback) {
    // Load background
    this.bgImage = new Image();
    this.bgImage.src = 'assets/jungle_bg.png';
    this.bgImage.onload = () => {
      this.loaded++;
      if (this.loaded === this.total && callback) callback();
    };

    const chars = ['goku', 'naruto', 'luffy', 'ichigo'];
    chars.forEach(char => {
      const img = new Image();
      img.src = `assets/${char}.png`;
      img.onload = () => {
        this.sprites[char] = this.processTransparent(img);
        this.loaded++;
        if (this.loaded === this.total && callback) callback();
      };
      img.onerror = () => {
        console.error(`Failed to load ${char}.png`);
        this.sprites[char] = img; // Fallback
        this.loaded++;
        if (this.loaded === this.total && callback) callback();
      };
    });
  }

  processTransparent(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        // If pixel is near-white (background), make it transparent
        if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
          data[i+3] = 0; // Set alpha to 0
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch(e) {
      console.warn("Canvas ImageData error (CORS):", e);
    }
    return canvas;
  }
}

const imageAssets = new ImageLoader();

// ==========================================
// 2. CHARACTER METADATA & PROFILE SCHEMA
// ==========================================
const FIGHTERS_DB = {
  goku: {
    name: 'GOKU',
    pow: 85, spd: 80, rng: 65,
    colors: {
      primary: '#ff5500',   // Orange Gi
      secondary: '#0033cc', // Blue undershirt/boots
      skin: '#ffdbac',      // Skin
      detail: '#ffffff',    // White belt / accents
      accent: '#ffff00'     // SSJ Yellow / Aura
    },
    description: 'Legendary Saiyan warrior.',
    specialName: 'KAMEHAMEHA'
  },
  naruto: {
    name: 'NARUTO',
    pow: 75, spd: 90, rng: 60,
    colors: {
      primary: '#ff7700',   // Orange tracksuit
      secondary: '#1a1a1a', // Black accents
      skin: '#ffdbac',      // Skin
      detail: '#9e9e9e',    // Grey forehead protector
      accent: '#ffff00'     // Spiky yellow hair
    },
    description: 'Hero of the Hidden Leaf.',
    specialName: 'RASENGAN'
  },
  luffy: {
    name: 'LUFFY',
    pow: 70, spd: 85, rng: 90,
    colors: {
      primary: '#cc0000',   // Red vest
      secondary: '#0066cc', // Blue shorts
      skin: '#ffdbac',      // Skin
      detail: '#e6b800',    // Straw Hat yellow
      accent: '#8b0000'     // Red ribbon on hat
    },
    description: 'Rubber-bodied pirate captain.',
    specialName: 'GUM-GUM PISTOL'
  },
  ichigo: {
    name: 'ICHIGO',
    pow: 90, spd: 70, rng: 80,
    colors: {
      primary: '#111111',   // Black Shinigami kimono
      secondary: '#ffffff', // White sash
      skin: '#ffdbac',      // Skin
      detail: '#ff6600',    // Spiky orange hair
      accent: '#333333'     // Massive sword guard
    },
    description: 'Soul Reaper with a massive Zanpakuto.',
    specialName: 'GETSUGA TENSHO'
  }
};

// ==========================================
// 3. FIGHTER CLASS (Entity & Controls)
// ==========================================
class Fighter {
  constructor(charId, x, y, direction, isPlayer = true) {
    this.charId = charId;
    this.data = FIGHTERS_DB[charId];
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = 60;
    this.height = 110;
    this.direction = direction; // 1 = right, -1 = left
    this.isPlayer = isPlayer;

    // Combat Stats
    this.health = 100;
    this.maxHealth = 100;
    this.roundsWon = 0;

    // Movement Physics
    this.gravity = 0.6;
    this.friction = 0.85;
    this.groundY = 380 - this.height; // Arena ground line is 380px from top
    this.isGrounded = true;

    // Input States
    this.isCrouching = false;
    this.isBlocking = false;
    this.isAttacking = false;
    this.attackType = null; // 'punch', 'kick', 'special'
    this.attackFrame = 0;
    this.attackCooldown = 0;
    this.specialCooldown = 0; // seconds remaining

    // Hit reaction
    this.state = 'idle'; // idle, walk, jump, crouch, punch, kick, special, block, hit, defeat
    this.hitStun = 0;
    this.flashFrame = false;

    // Animation System
    this.animTimer = 0;
    this.animFrame = 0;
    
    // Combo counters
    this.comboCount = 0;
    this.comboTimer = 0;
  }

  reset(x, y, direction) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.direction = direction;
    this.health = 100;
    this.isCrouching = false;
    this.isBlocking = false;
    this.isAttacking = false;
    this.attackType = null;
    this.attackFrame = 0;
    this.attackCooldown = 0;
    this.specialCooldown = 0;
    this.state = 'idle';
    this.hitStun = 0;
    this.isGrounded = true;
    this.comboCount = 0;
    this.comboTimer = 0;
  }

  jump() {
    if (this.isGrounded && this.hitStun <= 0 && !this.isAttacking) {
      this.vy = -14;
      this.isGrounded = false;
      this.state = 'jump';
      audio.playSFX('jump');
    }
  }

  crouch(crouchState) {
    if (this.isGrounded && this.hitStun <= 0 && !this.isAttacking) {
      this.isCrouching = crouchState;
      if (crouchState) {
        this.vx *= 0.5; // slow down when crouching
        this.state = 'crouch';
      }
    }
  }

  attack(type) {
    if (this.hitStun > 0 || this.isAttacking || this.attackCooldown > 0) return;
    
    if (type === 'special' && this.specialCooldown > 0) return;

    this.isAttacking = true;
    this.attackType = type;
    this.attackFrame = 0;
    this.state = type;
    
    if (type === 'punch') {
      this.attackCooldown = 15; // frame counts
      audio.playSFX('punch');
    } else if (type === 'kick') {
      this.attackCooldown = 22;
      audio.playSFX('kick');
    } else if (type === 'special') {
      this.attackCooldown = 40;
      this.specialCooldown = 5; // 5 second cooldown
      audio.playSFX('special');
      
      // Character specific special moves velocities
      if (this.charId === 'goku') {
        // Kamehameha hover slightly
        this.vy = -2;
        this.vx = this.direction * 2;
      } else if (this.charId === 'naruto') {
        // Rasengan high speed dash
        this.vx = this.direction * 15;
      } else if (this.charId === 'luffy') {
        // Gum-Gum stretch punch (stand ground)
        this.vx = this.direction * 1;
      } else if (this.charId === 'ichigo') {
        // Getsuga sword swing leap forward
        this.vy = -4;
        this.vx = this.direction * 5;
      }
    }
  }

  getHit(damage, directionForce, attackType) {
    if (this.state === 'defeat') return;

    // Check Block: blocking occurs if opposing input is pressed (move backwards from opponent)
    if (this.isBlocking && this.hitStun <= 0 && this.state !== 'jump') {
      // successful block!
      audio.playSFX('block');
      this.vx = directionForce * 0.3; // minor block pushback
      this.health -= damage * 0.1; // 10% chip damage
      if (this.health < 0) this.health = 0;
      
      // Trigger temporary blocking state visual
      this.state = 'block';
      this.hitStun = 5; // very brief freeze
      
      // Floating text or shield effect
      gameEngine.addHitSpark(this.x + this.width / 2, this.y + this.height / 3, 'BLOCK!', '#00f3ff');
      return;
    }

    // Unblocked hit
    audio.playSFX('hit');
    this.health -= damage;
    if (this.health < 0) this.health = 0;
    
    this.vx = directionForce; // pushback force
    this.vy = -3; // slight pop-up
    this.hitStun = attackType === 'special' ? 25 : 15; // frame length of recoil
    this.state = 'hit';
    this.isAttacking = false;
    this.isCrouching = false;

    // Trigger Screen Shake
    gameEngine.screenShake = attackType === 'special' ? 15 : 6;

    // Spark effect
    const sparkX = this.x + (this.direction === 1 ? 0 : this.width);
    const sparkY = this.y + this.height / 3;
    gameEngine.addHitSpark(sparkX, sparkY, `-${Math.round(damage)}`, '#ff3333');
    
    // Check for defeat
    if (this.health <= 0) {
      this.state = 'defeat';
      audio.playSFX('ko');
    }
  }

  update(opponent) {
    // Cooldown clocks
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hitStun > 0) this.hitStun--;
    
    if (this.specialCooldown > 0) {
      this.specialCooldown -= (1 / 60); // Subtract roughly one frame at 60fps
      if (this.specialCooldown < 0) this.specialCooldown = 0;
    }

    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    // Physics
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;

    // Arena Floor collisions
    const currentGround = this.isCrouching ? this.groundY + 30 : this.groundY;
    if (this.y >= currentGround) {
      this.y = currentGround;
      this.vy = 0;
      this.isGrounded = true;
    }

    // Direction auto-facing based on opponent position (unless locked in action)
    if (this.hitStun <= 0 && !this.isAttacking && this.state !== 'defeat') {
      this.direction = (this.x < opponent.x) ? 1 : -1;
    }

    // Check if player is holding block (moving away from opponent)
    if (this.hitStun <= 0 && !this.isAttacking && this.state !== 'defeat' && this.isGrounded) {
      if (this.vx * this.direction < -0.2) {
        this.isBlocking = true;
        this.state = 'block';
      } else {
        this.isBlocking = false;
      }
    }

    // Handle Attack frames
    if (this.isAttacking) {
      this.attackFrame++;
      if (this.attackFrame >= this.attackCooldown) {
        this.isAttacking = false;
        this.attackType = null;
        this.state = 'idle';
      }
    }

    // Set non-action states
    if (this.state !== 'defeat') {
      if (this.hitStun > 0) {
        this.state = 'hit';
        this.flashFrame = Math.floor(Date.now() / 50) % 2 === 0;
      } else if (!this.isAttacking && !this.isBlocking) {
        if (!this.isGrounded) {
          this.state = 'jump';
        } else if (this.isCrouching) {
          this.state = 'crouch';
        } else if (Math.abs(this.vx) > 0.8) {
          this.state = 'walk';
        } else {
          this.state = 'idle';
        }
      }
    }

    // Animations timer
    this.animTimer++;
    if (this.animTimer > 8) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4; // 4-frame looping
    }
  }

  // Draw procedural 8-bit sprites on the 2D canvas context
  draw(ctx) {
    ctx.save();
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(this.x + this.width / 2, this.groundY + this.height, 35, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flash red during hitStun
    if (this.state === 'hit' && this.flashFrame) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff3333';
      ctx.globalCompositeOperation = 'lighten';
    }

    // Flip sprite depending on direction
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    
    // Luffy and Ichigo's base assets face left, so invert their direction
    let drawDir = this.direction;
    if (this.charId === 'luffy' || this.charId === 'ichigo') {
      drawDir = -this.direction;
    }
    ctx.scale(drawDir, 1);

    const img = imageAssets.sprites[this.charId];
    
    // Ensure image is loaded and valid
    if (img && img.width > 0) {
      // Character drawing routines
      if (this.state === 'defeat') {
        ctx.rotate(-Math.PI / 2);
        const scaleFactor = Math.min(this.width / (img.width || 1), 120 / (img.height || 1)) * 1.5;
        ctx.scale(scaleFactor, scaleFactor);
        ctx.drawImage(img, -img.width/2, -img.height/2);
      } else {
        // Bobbing
        let bob = 0;
        if (this.state === 'idle') bob = (this.animFrame % 2 === 0) ? 3 : 0;
        
        const crouchOffset = this.isCrouching ? 20 : 0;
        ctx.translate(0, bob + crouchOffset);

        if (this.state === 'punch') {
          ctx.translate(15, 0); // Lunge forward
          ctx.rotate(0.05);
        } else if (this.state === 'kick') {
          ctx.translate(20, -10);
          ctx.rotate(0.1);
        } else if (this.state === 'block') {
          ctx.translate(-5, 5);
          ctx.rotate(-0.05);
        }

        // Draw image with scale factor
        ctx.save();
        const scaleFactor = Math.min(this.width / (img.width || 1), 120 / (img.height || 1)) * 1.5;
        ctx.scale(scaleFactor, scaleFactor);
        
        if (this.state === 'special' && this.charId === 'goku') {
          ctx.strokeStyle = 'rgba(255, 243, 0, 0.85)';
          ctx.lineWidth = 3 / scaleFactor;
          ctx.strokeRect(-img.width/2 - 10, -img.height/2 - 10, img.width + 20, img.height + 20);
        }
        ctx.drawImage(img, -img.width/2, -img.height/2);
        ctx.restore();

        // --- DRAW DYNAMIC OVERLAYS (FIGHT ANIMATIONS) ---
        // These are now drawn at 1:1 scale with the character's physical size
        if (this.state === 'special') {
          if (this.charId === 'goku') {
            if (this.attackFrame > 10 && this.attackFrame < 38) {
              const beamGrad = ctx.createLinearGradient(30, -20, 300, 20);
              beamGrad.addColorStop(0, '#ffffff');
              beamGrad.addColorStop(0.3, '#00f3ff');
              beamGrad.addColorStop(1, 'rgba(0, 243, 255, 0)');
              ctx.fillStyle = beamGrad;
              ctx.fillRect(40, -30, 350, 60);
            }
          }
          else if (this.charId === 'naruto') {
             // Rasengan
             const randAngle = Math.random() * Math.PI * 2;
             ctx.save();
             ctx.translate(35, 0);
             ctx.rotate(randAngle);
             ctx.fillStyle = 'rgba(0, 243, 255, 0.7)';
             ctx.beginPath();
             ctx.arc(0, 0, 25, 0, Math.PI * 2);
             ctx.fill();
             ctx.strokeStyle = '#ffffff';
             ctx.lineWidth = 2;
             ctx.beginPath();
             ctx.arc(0, 0, 20, 0, Math.PI);
             ctx.stroke();
             ctx.restore();
          }
          else if (this.charId === 'ichigo') {
            if (this.attackFrame > 12 && this.attackFrame < 32) {
               ctx.fillStyle = 'rgba(255, 0, 50, 0.85)';
               ctx.beginPath();
               ctx.arc(50 + (this.attackFrame - 12) * 8, 0, 50, -Math.PI / 2.5, Math.PI / 2.5);
               ctx.lineTo(70 + (this.attackFrame - 12) * 8, 0);
               ctx.closePath();
               ctx.fill();
             }
          }
          else if (this.charId === 'luffy') {
            // Stretched fist
            ctx.fillStyle = '#cc0000';
            ctx.fillRect(10, -5, 120, 12); // Arm
            ctx.fillStyle = '#ffdbac';
            ctx.fillRect(130, -10, 20, 20); // Fist
          }
        }
      }
    } else {
      // Fallback box if image is still loading
      ctx.fillStyle = this.data.colors.primary || '#ffffff';
      ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    }

    ctx.restore();
  }

  // Get physical bounding box of the fighter (hurtbox)
  getHurtbox() {
    const crouchOffset = this.isCrouching ? 30 : 0;
    return {
      x: this.x,
      y: this.y + crouchOffset,
      width: this.width,
      height: this.height - crouchOffset
    };
  }

  // Get current active hit box of the fighter when attacking
  getHitbox() {
    if (!this.isAttacking) return null;

    const crouchOffset = this.isCrouching ? 20 : 0;

    if (this.attackType === 'punch') {
      return {
        // Punch is at shoulder height, extends forward
        x: this.direction === 1 ? this.x + this.width - 10 : this.x - 45,
        y: this.y + 25 + crouchOffset,
        width: 55,
        height: 18
      };
    } 
    else if (this.attackType === 'kick') {
      return {
        // Kick is lower, extends further
        x: this.direction === 1 ? this.x + this.width - 5 : this.x - 65,
        y: this.y + 60 + crouchOffset,
        width: 70,
        height: 22
      };
    } 
    else if (this.attackType === 'special') {
      // Special attack size details
      if (this.charId === 'goku') {
        // Kamehameha large energy blast wave (long range)
        return {
          x: this.direction === 1 ? this.x + this.width : this.x - 320,
          y: this.y + 15,
          width: 320,
          height: 50
        };
      } 
      else if (this.charId === 'naruto') {
        // Rasengan swirling sphere in hand (close/medium range)
        return {
          x: this.direction === 1 ? this.x + this.width - 5 : this.x - 75,
          y: this.y + 20,
          width: 80,
          height: 70
        };
      } 
      else if (this.charId === 'luffy') {
        // Gum-Gum stretched punch (very long range)
        return {
          x: this.direction === 1 ? this.x + this.width : this.x - 200,
          y: this.y + 25 + crouchOffset,
          width: 200,
          height: 25
        };
      }
      else if (this.charId === 'ichigo') {
        // Getsuga Tensho crescent projectile
        return {
          x: this.direction === 1 ? this.x + this.width : this.x - 140,
          y: this.y + 10,
          width: 140,
          height: 90
        };
      }
    }

    return null;
  }
}

// ==========================================
// 4. GAME MANAGER & ENGINE LOOP
// ==========================================
class GameEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    
    // Core game entities
    this.player1 = null;
    this.player2 = null; // AI or Player 2

    // Game loop configs
    this.isPaused = false;
    this.gameState = 'menu'; // menu, select, loading, fight, gameover
    this.lastTime = 0;
    this.timer = 60;
    this.timerClockInterval = null;
    
    // Arena Configs
    this.arenaId = 'temple'; // temple, cyber, volcano
    this.screenShake = 0;
    this.hitSparks = [];
    this.particles = [];

    // Keys Mapping P1
    this.keys = {
      KeyA: false, // Move Left
      KeyD: false, // Move Right
      KeyW: false, // Jump
      KeyS: false, // Crouch
      KeyJ: false, // Punch
      KeyK: false, // Kick
      KeyI: false  // Special
    };
    
    // Match round info
    this.currentRound = 1;
    this.maxRounds = 3;
    this.roundActive = false;
    this.announcementActive = false;
    this.announcementTimer = 0;
  }

  init() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    
    // Keyboard inputs
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Register Button Interactions
    this.bindUIEvents();
    
    // Start game ticks
    requestAnimationFrame((t) => this.tick(t));
  }

  resizeCanvas() {
    // Rigid game size for pixel density
    this.canvas.width = 800;
    this.canvas.height = 480;
  }

  bindUIEvents() {
    // Menu buttons
    document.getElementById('btn-insert-coin').addEventListener('click', () => {
      audio.init();
      audio.playSFX('start');
      audio.startMusic();
      this.switchState('select');
    });

    // Audio toggle
    document.getElementById('btn-audio-toggle').addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      document.getElementById('btn-audio-toggle').innerText = isMuted ? '🔇' : '🔊';
    });

    // Character Grid interactions
    const cells = document.querySelectorAll('.char-grid-cell');
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        const char = cell.getAttribute('data-char');
        this.selectCharacterP1(char);
        audio.playSFX('select');
      });
    });

    // Start fight button
    document.getElementById('btn-fight').addEventListener('click', () => {
      if (this.player1 && this.player2) {
        audio.playSFX('start');
        this.switchState('loading');
      }
    });

    // Rematch / Main Menu buttons
    document.getElementById('btn-rematch').addEventListener('click', () => {
      audio.playSFX('start');
      this.resetMatch();
      this.switchState('fight');
    });

    document.getElementById('btn-main-menu').addEventListener('click', () => {
      audio.playSFX('select');
      this.resetMatch();
      this.switchState('menu');
    });

    // Pause menu buttons
    document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());
    document.getElementById('btn-quit').addEventListener('click', () => {
      this.togglePause();
      this.switchState('menu');
    });

    // Controller panel listeners (touch & click)
    const ctrlActions = [
      { id: 'ctrl-punch', key: 'KeyJ' },
      { id: 'ctrl-kick', key: 'KeyK' },
      { id: 'ctrl-special', key: 'KeyI' }
    ];
    ctrlActions.forEach(action => {
      const el = document.getElementById(action.id);
      el.addEventListener('mousedown', () => {
        if (this.gameState === 'fight' && this.roundActive) {
          this.keys[action.key] = true;
          // Trigger keyup after brief delay to simulate press
          setTimeout(() => { this.keys[action.key] = false; }, 80);
        }
      });
    });

    // Mobile Touch Controls
    const touchBtns = document.querySelectorAll('.touch-btn');
    touchBtns.forEach(btn => {
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // prevent zoom/scroll
        btn.classList.add('active');
        const key = btn.getAttribute('data-key');
        if (key) {
          this.keys[key] = true;
          this.handleKeyDown({ code: key });
        }
      }, { passive: false });
      
      const releaseTouch = (e) => {
        e.preventDefault();
        btn.classList.remove('active');
        const key = btn.getAttribute('data-key');
        if (key) {
          this.keys[key] = false;
          this.handleKeyUp({ code: key });
        }
      };
      
      btn.addEventListener('touchend', releaseTouch, { passive: false });
      btn.addEventListener('touchcancel', releaseTouch, { passive: false });
    });
  }

  handleKeyDown(e) {
    if (this.gameState === 'menu') {
      audio.init();
      audio.playSFX('start');
      audio.startMusic();
      this.switchState('select');
      return;
    }

    if (e.code === 'Escape' && this.gameState === 'fight') {
      this.togglePause();
      return;
    }

    // Block movements during round transition or hitstun
    if (this.gameState === 'fight' && this.roundActive) {
      if (e.code in this.keys) {
        this.keys[e.code] = true;
        
        // Joystick decorative rotation
        const jShaft = document.getElementById('visual-joystick');
        if (e.code === 'KeyA') jShaft.style.transform = 'rotate(-20deg)';
        if (e.code === 'KeyD') jShaft.style.transform = 'rotate(20deg)';
        if (e.code === 'KeyW') jShaft.style.transform = 'translateY(-6px)';
        if (e.code === 'KeyS') jShaft.style.transform = 'translateY(6px)';
      }
    }

    // Character Selection screen navigation shortcut
    if (this.gameState === 'select') {
      const cells = Array.from(document.querySelectorAll('.char-grid-cell'));
      const activeIdx = cells.findIndex(c => c.classList.contains('active'));
      let nextIdx = activeIdx;
      
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        nextIdx = activeIdx - 1;
        if (nextIdx < 0) nextIdx = cells.length - 1;
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        nextIdx = (activeIdx + 1) % cells.length;
      }
      
      if (nextIdx !== activeIdx) {
        cells[activeIdx].classList.remove('active');
        cells[nextIdx].classList.add('active');
        this.selectCharacterP1(cells[nextIdx].getAttribute('data-char'));
        audio.playSFX('select');
      }

      if (e.code === 'KeyJ' || e.code === 'Enter') {
        document.getElementById('btn-fight').click();
      }
    }
  }

  handleKeyUp(e) {
    if (e.code in this.keys) {
      this.keys[e.code] = false;
      
      // Reset Joystick decoration
      if (['KeyA', 'KeyD', 'KeyW', 'KeyS'].includes(e.code)) {
        document.getElementById('visual-joystick').style.transform = 'none';
      }
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const pauseScreen = document.getElementById('pause-screen');
    if (this.isPaused) {
      pauseScreen.classList.add('active');
      audio.stopMusic();
    } else {
      pauseScreen.classList.remove('active');
      audio.startMusic();
    }
  }

  selectCharacterP1(charId) {
    // Select Player 1
    const p1Data = FIGHTERS_DB[charId];
    this.player1 = new Fighter(charId, 180, 270, 1, true);
    
    // Highlight grid P1 selection
    document.querySelectorAll('.char-grid-cell').forEach(cell => {
      cell.classList.remove('p1-selected', 'p2-selected', 'both-selected');
      const cellChar = cell.getAttribute('data-char');
      if (cellChar === charId) {
        cell.classList.add('p1-selected');
      }
    });

    // Update P1 Preview Card
    document.getElementById('p1-name').innerText = p1Data.name;
    document.getElementById('p1-preview').classList.add('selected-active');
    this.renderAvatar('p1-avatar', charId);

    // Apply stat fills
    const card = document.getElementById('p1-preview');
    card.querySelectorAll('.stat-bar .fill')[0].style.width = `${p1Data.pow}%`;
    card.querySelectorAll('.stat-bar .fill')[1].style.width = `${p1Data.spd}%`;
    card.querySelectorAll('.stat-bar .fill')[2].style.width = `${p1Data.rng}%`;

    // Auto-select CPU Opponent (random or next in database)
    const fightersList = Object.keys(FIGHTERS_DB);
    let cpuId = fightersList.find(id => id !== charId); // pick first different opponent
    this.selectOpponentCPU(cpuId);
  }

  selectOpponentCPU(charId) {
    const p2Data = FIGHTERS_DB[charId];
    this.player2 = new Fighter(charId, 560, 270, -1, false);

    // Highlight grid CPU selection
    document.querySelectorAll('.char-grid-cell').forEach(cell => {
      const cellChar = cell.getAttribute('data-char');
      if (cellChar === charId) {
        if (cell.classList.contains('p1-selected')) {
          cell.classList.add('both-selected');
        } else {
          cell.classList.add('p2-selected');
        }
      }
    });

    // Update CPU Card
    document.getElementById('p2-name').innerText = p2Data.name;
    document.getElementById('p2-preview').classList.add('selected-active');
    this.renderAvatar('p2-avatar', charId);

    // Apply stat fills
    const card = document.getElementById('p2-preview');
    card.querySelectorAll('.stat-bar .fill')[0].style.width = `${p2Data.pow}%`;
    card.querySelectorAll('.stat-bar .fill')[1].style.width = `${p2Data.spd}%`;
    card.querySelectorAll('.stat-bar .fill')[2].style.width = `${p2Data.rng}%`;

    // Enable Fight button
    const btn = document.getElementById('btn-fight');
    btn.classList.remove('disabled');
  }

  renderAvatar(elementId, charId) {
    const el = document.getElementById(elementId);
    el.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    
    // Draw character portrait head procedurally on preview card
    ctx.imageSmoothingEnabled = false;
    const colors = FIGHTERS_DB[charId].colors;
    
    // Background gradient for avatar card
    const grad = ctx.createRadialGradient(50, 60, 10, 50, 60, 60);
    grad.addColorStop(0, colors.primary);
    grad.addColorStop(1, '#0f0a20');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,100,120);

    // Draw Head
    ctx.fillStyle = colors.skin;
    ctx.fillRect(32, 40, 36, 40); // head
    
    // Hair
    // Hair
    if (charId === 'goku') {
      ctx.fillStyle = '#111111'; // black spikes
      ctx.fillRect(20, 15, 12, 20);
      ctx.fillRect(68, 15, 12, 20);
      ctx.fillRect(28, 10, 44, 25);
    }
    else if (charId === 'naruto') {
      ctx.fillStyle = '#ffff00'; // yellow spikes
      ctx.fillRect(22, 12, 10, 20);
      ctx.fillRect(68, 12, 10, 20);
      ctx.fillRect(28, 8, 44, 25);
      // Headband
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(28, 44, 44, 12);
      ctx.fillStyle = '#9e9e9e';
      ctx.fillRect(40, 46, 20, 8);
    }
    else if (charId === 'luffy') {
      // straw hat
      ctx.fillStyle = '#e6b800';
      ctx.fillRect(16, 28, 68, 10); // brim
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(26, 24, 48, 4);  // red ribbon
      ctx.fillStyle = '#e6b800';
      ctx.fillRect(26, 12, 48, 12); // crown
    }
    else if (charId === 'ichigo') {
      ctx.fillStyle = '#ff6600'; // orange spikes
      ctx.fillRect(20, 15, 15, 20);
      ctx.fillRect(65, 15, 15, 20);
      ctx.fillRect(28, 10, 44, 25);
    }
    
    // Eyes (angry look)
    ctx.fillStyle = '#000000';
    ctx.fillRect(44, 56, 6, 4);
    ctx.fillRect(60, 56, 6, 4);
    
    // Clothes collar
    if (charId === 'goku') {
      ctx.fillStyle = '#ff5500'; // orange Gi
      ctx.fillRect(25, 80, 50, 40);
      ctx.fillStyle = '#0033cc'; // blue shirt v
      ctx.fillRect(43, 80, 14, 40);
    } else if (charId === 'naruto') {
      ctx.fillStyle = '#ff7700'; // orange tracksuit jacket
      ctx.fillRect(25, 80, 50, 40);
      ctx.fillStyle = '#1a1a1a'; // black shoulders collar
      ctx.fillRect(25, 80, 50, 10);
      ctx.fillStyle = '#ffffff'; // zipper
      ctx.fillRect(48, 85, 4, 35);
    } else if (charId === 'luffy') {
      ctx.fillStyle = '#cc0000'; // red vest
      ctx.fillRect(25, 80, 50, 40);
      ctx.fillStyle = colors.skin; // open skin chest
      ctx.fillRect(42, 80, 16, 40);
    } else if (charId === 'ichigo') {
      ctx.fillStyle = '#111111'; // black shinigami robes
      ctx.fillRect(25, 80, 50, 40);
      ctx.fillStyle = '#ffffff'; // white collar showing
      ctx.fillRect(44, 80, 12, 40);
    }
    
    el.appendChild(canvas);
  }

  switchState(newState) {
    this.gameState = newState;
    
    // Manage display overlays
    document.querySelectorAll('.game-overlay').forEach(screen => {
      screen.classList.remove('active');
    });

    if (newState === 'menu') {
      document.getElementById('menu-screen').classList.add('active');
      audio.stopMusic();
    } 
    else if (newState === 'select') {
      document.getElementById('char-select-screen').classList.add('active');
      // Set default character P1 on select entry
      this.selectCharacterP1('goku');
    } 
    else if (newState === 'loading') {
      document.getElementById('loading-screen').classList.add('active');
      
      // Sync Loading VS portraits
      this.renderAvatar('load-p1-avatar', this.player1.charId);
      this.renderAvatar('load-p2-avatar', this.player2.charId);
      document.getElementById('load-p1-name').innerText = this.player1.data.name;
      document.getElementById('load-p2-name').innerText = this.player2.data.name;
      
      // Animate Loading Progress
      const fill = document.getElementById('load-progress');
      fill.style.width = '0%';
      let progress = 0;
      const interval = setInterval(() => {
        progress += 4;
        fill.style.width = `${progress}%`;
        if (progress >= 100) {
          clearInterval(interval);
          this.switchState('fight');
        }
      }, 50);
    } 
    else if (newState === 'fight') {
      document.getElementById('gameplay-container').classList.add('active');
      
      // Randomly pick an arena backdrop
      const arenas = ['temple', 'cyber', 'volcano'];
      this.arenaId = arenas[Math.floor(Math.random() * arenas.length)];
      
      this.resetMatch();
      this.startRound();
    } 
    else if (newState === 'gameover') {
      document.getElementById('gameover-screen').classList.add('active');
      
      // Stop fight clocks
      this.stopTimer();
      audio.stopMusic();
      audio.playSFX('victory');

      // Determine match winner
      const winner = this.player1.roundsWon >= 2 ? this.player1 : this.player2;
      document.getElementById('winner-declaration').innerText = `${winner.data.name} WINS THE TOURNAMENT!`;
      this.renderAvatar('podium-portrait', winner.charId);
    }
  }

  resetMatch() {
    this.currentRound = 1;
    this.player1.roundsWon = 0;
    this.player2.roundsWon = 0;
    
    // Sync HUD names
    document.getElementById('hud-p1-name').innerText = this.player1.data.name;
    document.getElementById('hud-p2-name').innerText = this.player2.data.name;
    
    // Reset round dots
    this.updateRoundHUD();
  }

  updateRoundHUD() {
    const dots1 = document.getElementById('p1-rounds').children;
    const dots2 = document.getElementById('p2-rounds').children;
    
    for (let i = 0; i < 2; i++) {
      dots1[i].className = i < this.player1.roundsWon ? 'round-dot won' : 'round-dot';
      dots2[i].className = i < this.player2.roundsWon ? 'round-dot won' : 'round-dot';
    }
  }

  startRound() {
    this.roundActive = false;
    this.timer = 60;
    document.getElementById('timer-display').innerText = this.timer;
    document.getElementById('timer-display').classList.remove('low-time');
    
    document.getElementById('round-display').innerText = `ROUND ${this.currentRound}`;

    // Reset fighters positions
    this.player1.reset(180, 270, 1);
    this.player2.reset(560, 270, -1);

    // Announce Round X -> FIGHT!
    this.triggerAnnouncement(`ROUND ${this.currentRound}`, 1500, () => {
      this.triggerAnnouncement("FIGHT!", 800, () => {
        this.roundActive = true;
        this.startTimer();
      });
      audio.playSFX('select');
    });
  }

  startTimer() {
    this.stopTimer();
    this.timerClockInterval = setInterval(() => {
      if (this.isPaused || !this.roundActive) return;
      
      this.timer--;
      const display = document.getElementById('timer-display');
      display.innerText = this.timer;

      if (this.timer <= 15) {
        display.classList.add('low-time');
      }

      if (this.timer <= 0) {
        this.endRound('timeup');
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerClockInterval) {
      clearInterval(this.timerClockInterval);
      this.timerClockInterval = null;
    }
  }

  triggerAnnouncement(text, durationMs, callback) {
    const el = document.getElementById('announcement-text');
    el.innerText = text;
    el.className = 'announcement active';
    
    if (text === 'FIGHT!') el.classList.add('fight');
    if (text === 'K.O.') el.classList.add('ko');

    this.announcementActive = true;
    this.announcementTimer = setTimeout(() => {
      el.className = 'announcement';
      this.announcementActive = false;
      if (callback) callback();
    }, durationMs);
  }

  // Handle damage collision hitbox intersects hurtbox
  checkCollisions() {
    if (!this.roundActive) return;

    // Check P1 attacks
    const hitbox1 = this.player1.getHitbox();
    const hurtbox2 = this.player2.getHurtbox();
    
    if (hitbox1 && this.intersects(hitbox1, hurtbox2)) {
      // P1 successfully hit P2!
      let damage = 5;
      if (this.player1.attackType === 'kick') damage = 9;
      if (this.player1.attackType === 'special') damage = 16;
      
      // Calculate character strength modifier
      damage *= (this.player1.data.pow / 70);

      this.player2.getHit(damage, this.player1.direction * 8, this.player1.attackType);
      this.player1.isAttacking = false; // consume attack hitbox immediately on hit

      // Update Combo Counter
      this.player1.comboCount++;
      this.player1.comboTimer = 75; // frames
      this.showCombo(1, this.player1.comboCount);

      if (this.player2.health <= 0) {
        this.endRound('ko', this.player1);
      }
    }

    // Check P2 attacks
    const hitbox2 = this.player2.getHitbox();
    const hurtbox1 = this.player1.getHurtbox();
    
    if (hitbox2 && this.intersects(hitbox2, hurtbox1)) {
      // P2 hit P1!
      let damage = 5;
      if (this.player2.attackType === 'kick') damage = 9;
      if (this.player2.attackType === 'special') damage = 16;
      
      damage *= (this.player2.data.pow / 70);

      this.player1.getHit(damage, this.player2.direction * 8, this.player2.attackType);
      this.player2.isAttacking = false;

      // Update Combo Counter
      this.player2.comboCount++;
      this.player2.comboTimer = 75;
      this.showCombo(2, this.player2.comboCount);

      if (this.player1.health <= 0) {
        this.endRound('ko', this.player2);
      }
    }
  }

  intersects(r1, r2) {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }

  showCombo(playerNum, count) {
    if (count < 2) return;
    const elId = playerNum === 1 ? 'p1-combo' : 'p2-combo';
    const el = document.getElementById(elId);
    el.style.display = 'block';
    el.innerText = `${count} HIT COMBO!`;
    
    // Clear combo message after 1 sec
    setTimeout(() => { el.style.display = 'none'; }, 1000);
  }

  endRound(mode, winner) {
    this.roundActive = false;
    this.stopTimer();

    if (mode === 'ko') {
      this.triggerAnnouncement("K.O.", 2000, () => this.resolveRoundPoints(winner));
    } else if (mode === 'timeup') {
      let roundWinner = null;
      if (this.player1.health > this.player2.health) roundWinner = this.player1;
      else if (this.player2.health > this.player1.health) roundWinner = this.player2;

      this.triggerAnnouncement("TIME UP!", 2000, () => this.resolveRoundPoints(roundWinner));
    }
  }

  resolveRoundPoints(roundWinner) {
    if (roundWinner === this.player1) {
      this.player1.roundsWon++;
    } else if (roundWinner === this.player2) {
      this.player2.roundsWon++;
    } else {
      // Draw (both get point or neither)
      this.player1.roundsWon++;
      this.player2.roundsWon++;
    }

    this.updateRoundHUD();

    // Check Match Win Condition (Best of 3)
    if (this.player1.roundsWon >= 2 || this.player2.roundsWon >= 2) {
      setTimeout(() => this.switchState('gameover'), 500);
    } else {
      // Proceed to next round
      this.currentRound++;
      this.startRound();
    }
  }

  // --- STATE-MACHINE AI LOGIC ---
  runAI() {
    if (!this.roundActive || this.player2.hitStun > 0 || this.player2.state === 'defeat') return;

    const dist = Math.abs(this.player2.x - this.player1.x);
    const rand = Math.random();

    // AI decisions based on frames ticks (runs roughly every 12 frames to avoid artificial feel)
    if (Math.floor(Date.now() / 16) % 12 !== 0) return;

    // Auto-defend/Block logic if player is attacking
    if (this.player1.isAttacking && dist < 150) {
      const blockChance = 0.65; // Challenger average block
      if (rand < blockChance) {
        // Hold back direction to trigger block
        this.player2.vx = -this.player2.direction * 3;
        this.player2.isBlocking = true;
        return;
      }
    }

    if (dist > 220) {
      // Far: Walk towards player P1
      this.player2.vx = this.player2.direction * 3.5;
      
      // Randomly trigger special to close gap
      if (rand < 0.15 && this.player2.specialCooldown === 0) {
        this.player2.attack('special');
      }
    } 
    else if (dist > 80) {
      // Medium distance: slowly close-in or jump
      if (rand < 0.7) {
        this.player2.vx = this.player2.direction * 2;
      } else if (rand < 0.85) {
        this.player2.jump();
      }
    } 
    else {
      // Close range combat
      if (rand < 0.4) {
        this.player2.attack('punch');
      } else if (rand < 0.7) {
        this.player2.attack('kick');
      } else if (rand < 0.85) {
        this.player2.crouch(true);
        setTimeout(() => this.player2.crouch(false), 300);
      } else {
        // Retreat back
        this.player2.vx = -this.player2.direction * 4;
      }
    }
  }

  // --- PARTICLES ENGINE ---
  addHitSpark(x, y, text, color) {
    this.hitSparks.push({
      x: x, y: y,
      text: text,
      color: color,
      alpha: 1.0,
      scale: 1.0,
      vy: -1.5,
      life: 45 // frames
    });

    // Add explosion debris blocks
    for(let i=0; i<8; i++) {
      this.particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        size: Math.random() * 6 + 3,
        color: color,
        alpha: 1.0,
        life: 25 + Math.random() * 15
      });
    }
  }

  updateParticles() {
    // Sparks
    for (let i = this.hitSparks.length - 1; i >= 0; i--) {
      const sp = this.hitSparks[i];
      sp.y += sp.vy;
      sp.alpha -= 0.02;
      sp.scale += 0.01;
      sp.life--;
      if (sp.life <= 0 || sp.alpha <= 0) {
        this.hitSparks.splice(i, 1);
      }
    }

    // Explosion debris particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity effect on debris
      p.alpha -= 0.035;
      p.life--;
      if (p.life <= 0 || p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  // --- RENDERING ROUTINES ---
  drawHUD() {
    if (this.gameState !== 'fight') return;
    
    // Sync life bars widths based on fighter health values
    const p1H = Math.max(0, this.player1.health);
    const p2H = Math.max(0, this.player2.health);
    
    document.getElementById('p1-health').style.width = `${p1H}%`;
    document.getElementById('p2-health').style.width = `${p2H}%`;
    
    // Damage buffer delay indicators
    document.getElementById('p1-health-damage').style.width = `${p1H}%`;
    document.getElementById('p2-health-damage').style.width = `${p2H}%`;
  }

  drawArenaBackground() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Apply Screen Shake
    if (this.screenShake > 0) {
      const dx = (Math.random() - 0.5) * this.screenShake;
      const dy = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(dx, dy);
      this.screenShake *= 0.9;
      if (this.screenShake < 0.5) this.screenShake = 0;
    }

    // Draw the 8-bit Jungle Background
    if (imageAssets.bgImage && imageAssets.bgImage.complete) {
      this.ctx.drawImage(imageAssets.bgImage, 0, 0, w, h);
    } else {
      // Fallback while loading
      this.ctx.fillStyle = '#1a0d1a';
      this.ctx.fillRect(0, 0, w, h);
    }
  }

  drawParticles() {
    // sparks text numbers
    this.ctx.font = `italic 14px 'Press Start 2P'`;
    this.hitSparks.forEach(sp => {
      this.ctx.save();
      this.ctx.globalAlpha = sp.alpha;
      this.ctx.fillStyle = sp.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = sp.color;
      this.ctx.fillText(sp.text, sp.x, sp.y);
      this.ctx.restore();
    });

    // explosion cubes
    this.particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    });
  }

  // --- CORE GAME LOOP ---
  tick(timestamp) {
    if (this.lastTime === 0) this.lastTime = timestamp;
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (!this.isPaused) {
      // 1. Update Game Objects
      if (this.gameState === 'fight') {
        // Player Inputs P1
        if (this.roundActive && this.player1.hitStun <= 0) {
          // Movement Left/Right
          if (this.keys.KeyA) {
            this.player1.vx = -4.5;
          } else if (this.keys.KeyD) {
            this.player1.vx = 4.5;
          }

          // Jump W
          if (this.keys.KeyW) {
            this.player1.jump();
          }

          // Crouch S
          this.player1.crouch(this.keys.KeyS);

          // Attack buttons P1
          if (this.keys.KeyJ) {
            this.player1.attack('punch');
          } else if (this.keys.KeyK) {
            this.player1.attack('kick');
          } else if (this.keys.KeyI) {
            this.player1.attack('special');
          }
        }

        // Apply boundary screen walls constraints
        const boundX = (fighter) => {
          if (fighter.x < 10) fighter.x = 10;
          if (fighter.x > this.canvas.width - fighter.width - 10) {
            fighter.x = this.canvas.width - fighter.width - 10;
          }
        };

        // Update physics positions
        this.player1.update(this.player2);
        this.player2.update(this.player1);

        boundX(this.player1);
        boundX(this.player2);

        // Run AI Controller
        this.runAI();

        // Hit collision Checks
        this.checkCollisions();

        // Particle dynamics
        this.updateParticles();

        // HUD lifespans
        this.drawHUD();
      }
    }

    // 2. Render Loop
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameState === 'fight') {
      this.ctx.save();
      this.drawArenaBackground();
      
      // Render entities
      this.player1.draw(this.ctx);
      this.player2.draw(this.ctx);

      // Render sparks FX
      this.drawParticles();
      
      this.ctx.restore();
    }

    // Loop
    requestAnimationFrame((t) => this.tick(t));
  }
}

// Global Game Engine Instantiation & Booting
const gameEngine = new GameEngine();
window.addEventListener('load', () => {
  imageAssets.loadAll(() => {
    gameEngine.init();
  });
});
