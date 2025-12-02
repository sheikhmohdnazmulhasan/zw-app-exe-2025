import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";

/**
 * Wires up minimal window control IPC handlers so the web app can
 * optionally control the native window (minimize / maximize / close).
 * The handlers are kept generic and use an accessor to avoid tight coupling
 * to a specific BrowserWindow instance.
 */
export const registerWindowControlHandlers = (
  getMainWindow: () => BrowserWindow | null
): void => {
  ipcMain.handle("window-minimize", () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  ipcMain.handle("window-maximize", () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle("window-close", () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.close();
    }
  });

  ipcMain.handle("window-is-maximized", () => {
    const mainWindow = getMainWindow();
    return mainWindow ? mainWindow.isMaximized() : false;
  });
};
