import type { BrowserWindow } from "electron";
import { shell } from "electron";

/**
 * Navigation + external link handling for the main window.
 *
 * - Navigation within https://app.zendowhisper.com (and localhost for dev)
 *   stays inside the Electron window.
 * - OAuth / auth flows on https://accounts.google.com are also allowed
 *   to stay inside the Electron window so Google Sign-In works in-app.
 * - Any other origin is opened in the user's default browser instead of
 *   creating a new Electron window or navigating the current one.
 */
export const registerNavigationHandlers = (mainWindow: BrowserWindow): void => {
  // Handle target=_blank / window.open calls.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      if (
        hostname === "app.zendowhisper.com" ||
        hostname === "localhost" ||
        hostname === "accounts.google.com" ||
        hostname === "odsoebcyqmipdqarlycz.supabase.co" ||
        hostname.endsWith(".supabase.co")
      ) {
        return { action: "allow" };
      }
    } catch {
      // If parsing fails, fall through to external open.
    }

    shell.openExternal(url);
    return { action: "deny" };
  });

  // Intercept top-level navigations (e.g., normal links).
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    try {
      const parsedUrl = new URL(navigationUrl);
      const hostname = parsedUrl.hostname;

      if (
        hostname === "app.zendowhisper.com" ||
        hostname === "localhost" ||
        hostname === "accounts.google.com" ||
        hostname === "odsoebcyqmipdqarlycz.supabase.co" ||
        hostname.endsWith(".supabase.co")
      ) {
        // Keep in app window.
        return;
      }

      // For any other origin, open in system browser.
      event.preventDefault();
      shell.openExternal(navigationUrl);
    } catch {
      // If URL parsing fails, let Electron handle it normally.
    }
  });
};
