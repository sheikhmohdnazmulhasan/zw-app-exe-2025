import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "node:path";

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  // Get the logo path - works in both dev and production
  // extraResources puts assets in resources/assets/ in production
  const logoPath = app.isPackaged
    ? path.join(process.resourcesPath, "assets", "logo.png")
    : path.join(__dirname, "..", "assets", "logo.png");

  const APP_URL = "https://app.zendowhisper.com/";

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "ZendoWhisper",
    icon: logoPath,
    autoHideMenuBar: true,
    backgroundColor: "#ffffff", // Default white background, will be overridden by remote site
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  });

  // Load the remote application directly.
  mainWindow.loadURL(APP_URL);

  mainWindow.once("ready-to-show", () => {
    if (!mainWindow) return;
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links - open in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Open all new window/tab requests in the default browser
    shell.openExternal(url);
    return { action: "deny" }; // Prevent opening in Electron window
  });

  // Handle navigation to external URLs (when user clicks links)
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    try {
      const parsedUrl = new URL(navigationUrl);
      const currentUrl = mainWindow?.webContents.getURL();

      // Allow navigation to app.zendowhisper.com (the main app domain)
      if (
        parsedUrl.hostname === "app.zendowhisper.com" ||
        parsedUrl.hostname === "localhost" ||
        parsedUrl.protocol === "file:"
      ) {
        return; // Allow navigation
      }

      // If navigating to a different domain, open in default browser
      if (currentUrl) {
        const currentParsedUrl = new URL(currentUrl);
        if (parsedUrl.origin !== currentParsedUrl.origin) {
          event.preventDefault();
          shell.openExternal(navigationUrl);
        }
      }
    } catch (error) {
      // If URL parsing fails, allow navigation
      console.error("Error parsing URL:", error);
    }
  });
};

// Handle window controls
ipcMain.handle("window-minimize", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle("window-maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle("window-close", () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle("window-is-maximized", () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

app.whenReady().then(() => {
  // Set app icon (useful for macOS dock and Windows taskbar)
  const logoPath = app.isPackaged
    ? path.join(process.resourcesPath, "assets", "logo.png")
    : path.join(__dirname, "..", "assets", "logo.png");
  if (process.platform === "darwin" && app.dock) {
    app.dock.setIcon(logoPath);
  }

  createWindow();

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
