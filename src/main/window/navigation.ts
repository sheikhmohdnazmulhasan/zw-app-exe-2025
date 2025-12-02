import type { BrowserWindow } from "electron";

/**
 * Navigation hook for the main window.
 *
 * Intentionally left effectively empty so the hosted web app
 * controls navigation entirely inside the Electron window.
 */
export const registerNavigationHandlers = (
  _mainWindow: BrowserWindow
): void => {
  // No-op: allow Electron and the web app to handle all links normally.
};
