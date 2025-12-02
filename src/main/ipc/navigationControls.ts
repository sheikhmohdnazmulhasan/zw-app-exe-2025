import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";

/**
 * Minimal navigation IPC handlers to support Back / Forward
 * from a custom title bar UI running in the renderer (via preload).
 */
export const registerNavigationControlHandlers = (
  getMainWindow: () => BrowserWindow | null
): void => {
  ipcMain.handle("navigation-go-back", () => {
    const mainWindow = getMainWindow();
    if (mainWindow && mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack();
    }
  });

  ipcMain.handle("navigation-go-forward", () => {
    const mainWindow = getMainWindow();
    if (mainWindow && mainWindow.webContents.canGoForward()) {
      mainWindow.webContents.goForward();
    }
  });
};
