import { app, BrowserWindow, Menu } from "electron";
import * as path from "node:path";
import {
  APP_TITLE,
  APP_URL,
  AUTO_HIDE_MENU_BAR,
  WINDOW_BACKGROUND_COLOR,
  WINDOW_BOUNDS,
} from "./main/config/appConfig";
import { registerNavigationHandlers } from "./main/window/navigation";
import { registerWindowControlHandlers } from "./main/ipc/windowControls";
import { buildAppMenu } from "./main/menu/appMenu";

let mainWindow: BrowserWindow | null = null;

const getMainWindow = (): BrowserWindow | null => mainWindow;

const createWindow = (): void => {
  const logoPath = app.isPackaged
    ? path.join(process.resourcesPath, "assets", "logo.png")
    : path.join(__dirname, "..", "assets", "logo.png");

  const preloadPath = path.join(__dirname, "preload.js");

  mainWindow = new BrowserWindow({
    ...WINDOW_BOUNDS,
    title: APP_TITLE,
    icon: logoPath,
    autoHideMenuBar: AUTO_HIDE_MENU_BAR,
    backgroundColor: WINDOW_BACKGROUND_COLOR,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  });

  /**
   * Load the local index.html first so it can:
   * - Show an initial loading state.
   * - Detect missing internet and show a minimal offline state.
   *
   * The index.html then redirects to the remote APP_URL when online.
   */
  const indexPath = path.join(__dirname, "index.html");
  mainWindow.loadFile(indexPath);

  mainWindow.once("ready-to-show", () => {
    if (!mainWindow) {
      return;
    }
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  registerNavigationHandlers(mainWindow);
};

registerWindowControlHandlers(getMainWindow);

app.whenReady().then(() => {
  const logoPath = app.isPackaged
    ? path.join(process.resourcesPath, "assets", "logo.png")
    : path.join(__dirname, "..", "assets", "logo.png");

  if (process.platform === "darwin" && app.dock) {
    app.dock.setIcon(logoPath);
  }

  createWindow();

  const menu = buildAppMenu(getMainWindow);
  Menu.setApplicationMenu(menu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
