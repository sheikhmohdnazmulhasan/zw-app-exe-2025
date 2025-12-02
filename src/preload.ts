import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("zendowhisperEnv", {
  appName: "ZendoWhisper"
});

contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.invoke("window-minimize"),
  maximizeWindow: () => ipcRenderer.invoke("window-maximize"),
  closeWindow: () => ipcRenderer.invoke("window-close"),
  isMaximized: () => ipcRenderer.invoke("window-is-maximized"),
  onMaximizeChange: (callback: (isMaximized: boolean) => void) => {
    ipcRenderer.on("window-maximize-changed", (_event, isMaximized: boolean) => {
      callback(isMaximized);
    });
  }
});

declare global {
  interface Window {
    zendowhisperEnv?: {
      appName: string;
    };
    electronAPI?: {
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
      onMaximizeChange: (callback: (isMaximized: boolean) => void) => void;
    };
  }
}
