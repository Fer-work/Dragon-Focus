// src/utils/SoundManager.js
import startSoundFile from "../assets/sounds/ui/startSound.wav";
import stopSoundFile from "../assets/sounds/ui/stopSound.wav";
// import clickSoundFile from "../assets/sounds/ui/click.wav";

// Preload essential sounds
const sounds = {
  start: new Audio(startSoundFile),
  stop: new Audio(stopSoundFile),
  // click: new Audio(clickSoundFile),
  // Add more sounds here as needed
  // e.g., success: new Audio(successSoundFile),
};

// Optional: Set default volumes or other properties
sounds.start.volume = 0.4;
sounds.stop.volume = 0.4;
// sounds.click.volume = 0.5;

/**
 * Plays a preloaded sound by its name.
 * @param {string} name - The name of the sound to play (e.g., 'start', 'stop', 'click').
 */
export function playSound(name) {
  const audio = sounds[name];
  if (audio) {
    audio.currentTime = 0; // Rewind to the start
    audio.play().catch((error) => {
      // Autoplay policies might prevent playing without user interaction.
      // Or, if the sound hasn't loaded yet (though preloading helps).
      console.warn(
        `SoundManager: Could not play sound "${name}". Error:`,
        error
      );
    });
  } else {
    console.warn(`SoundManager: Sound "${name}" not found.`);
  }
}

// Example for playing sounds that might not be preloaded (e.g., focus loops)
// This is more advanced and would involve loading on demand.
const dynamicSoundsCache = {};

export async function playDynamicSound(src) {
  if (dynamicSoundsCache[src]) {
    dynamicSoundsCache[src].currentTime = 0;
    dynamicSoundsCache[src]
      .play()
      .catch((error) =>
        console.warn(
          `SoundManager: Could not play dynamic sound "${src}". Error:`,
          error
        )
      );
  } else {
    try {
      const audio = new Audio(src);
      dynamicSoundsCache[src] = audio; // Cache it
      await audio.play();
    } catch (error) {
      console.error(
        `SoundManager: Error loading or playing dynamic sound "${src}". Error:`,
        error
      );
    }
  }
}

// You might also want functions to stop sounds, control volume globally, etc.
// export function stopAllSounds() {
//   for (const key in sounds) {
//     if (sounds[key] && !sounds[key].paused) {
//       sounds[key].pause();
//       sounds[key].currentTime = 0;
//     }
//   }
//   for (const key in dynamicSoundsCache) {
//      if (dynamicSoundsCache[key] && !dynamicSoundsCache[key].paused) {
//       dynamicSoundsCache[key].pause();
//       dynamicSoundsCache[key].currentTime = 0;
//     }
//   }
// }
