// src/themes/index.js

// 1. Import each individual theme object from its file.
import { flameTheme } from "./fireTheme.js";
import { jungleTheme } from "./jungleTheme.js";

/**
 * 2. Create a single object that holds all your themes.
 * The keys ('flame', 'jungle') are the names you will use in your
 * theme manager to switch between them.
 */
export const themes = {
  flame: flameTheme,
  jungle: jungleTheme,
  // When you create a new theme (e.g., waterTheme),
  // you will import it and add it here like so:
  // water: waterTheme,
};
