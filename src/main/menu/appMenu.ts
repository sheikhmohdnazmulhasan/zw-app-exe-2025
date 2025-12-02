import type { BrowserWindow } from "electron";
import { Menu, type MenuItemConstructorOptions } from "electron";

/**
 * Builds a tiny application menu focused on navigation.
 * This avoids changing the web app UI while still giving users
 * Back/Forward controls and keyboard shortcuts.
 */
export const buildAppMenu = (
  getMainWindow: () => BrowserWindow | null
): Menu => {
  const navigationSubmenu: MenuItemConstructorOptions[] = [
    {
      label: "Back",
      accelerator: "Alt+Left",
      click: () => {
        const mainWindow = getMainWindow();
        if (mainWindow && mainWindow.webContents.canGoBack()) {
          mainWindow.webContents.goBack();
        }
      },
    },
    {
      label: "Forward",
      accelerator: "Alt+Right",
      click: () => {
        const mainWindow = getMainWindow();
        if (mainWindow && mainWindow.webContents.canGoForward()) {
          mainWindow.webContents.goForward();
        }
      },
    },
  ];

  const template: MenuItemConstructorOptions[] = [
    {
      label: "Navigation",
      submenu: navigationSubmenu,
    },
  ];

  return Menu.buildFromTemplate(template);
};
