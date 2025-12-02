/**
 * Core application configuration and window defaults.
 * Kept intentionally small so the Electron wrapper simply loads the web app.
 */

export const APP_URL = "https://app.zendowhisper.com/";

export const APP_TITLE = "ZendoWhisper";

export const WINDOW_BOUNDS = {
  width: 1280,
  height: 800,
  minWidth: 800,
  minHeight: 600,
} as const;

export const WINDOW_BACKGROUND_COLOR = "#ffffff";

export const AUTO_HIDE_MENU_BAR = true;
