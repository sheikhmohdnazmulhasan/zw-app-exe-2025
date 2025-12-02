## ZendoWhisper Desktop

ZendoWhisper is a desktop wrapper around the `app.zendowhisper.com` web application, built with **Electron** and **TypeScript**. It provides a native-feeling desktop experience with controlled in‑app navigation, external link handling, and packaged installers for distribution (including Windows `.exe` builds).

---

## Features

- **Electron + TypeScript** main process with strongly typed configuration.
- **Dedicated main window** that loads the ZendoWhisper web app (`APP_URL` in `src/main/config/appConfig.ts`).
- **Safe navigation handling**:
  - In‑app hosts (e.g. `app.zendowhisper.com` and localhost for development) stay inside the Electron window.
  - OAuth/auth flows (e.g. `accounts.google.com`) are allowed in‑app.
  - All other external links open in the system browser.
- **Custom application menu** and window controls wired through IPC.
- **Packaged assets** (like `assets/logo.png`) included in production builds.
- **Cross‑platform builds** via `electron-builder`, with Windows installers and portable builds.

---

## Project Structure

- **`src/main.ts`** – Electron app entry point (creates main window, sets menu, handles lifecycle).
- **`src/main/config/appConfig.ts`** – Application configuration constants (title, URL, window bounds, colors, etc.).
- **`src/main/window/navigation.ts`** – Navigation and external link handling for the main window.
- **`src/main/ipc/windowControls.ts`** – IPC handlers for window control (minimize, maximize, close).
- **`src/main/menu/appMenu.ts`** – Application menu construction.
- **`assets/`** – Static assets (e.g. `logo.png` used as app/window icon).
- **`dist/`** – Compiled JavaScript output from TypeScript (`npm run build`).
- **`release/`** – Packaging output created by `electron-builder` (installers and portable builds).

> The `dist/` and `release/` directories are generated and should typically not be committed to source control.

---

## Prerequisites

- **Node.js** (LTS recommended).
- **npm** (ships with Node.js).

To verify:

```bash
node -v
npm -v
```

---

## Setup

Install dependencies in the project root:

```bash
cd /home/sheikh/Int/zw-app-exe-2025
npm install
```

---

## Development

### Run the app in development

The simplest way to run the app during development is:

```bash
npm start
```

This command:

- Compiles the TypeScript sources to `dist/` using `tsc`.
- Starts Electron with `dist/main.js` as the main entry.

Ensure that the backend/web app configured in `APP_URL` (inside `src/main/config/appConfig.ts`) is reachable; for example, a local dev server or the hosted `https://app.zendowhisper.com`.

### TypeScript build only

If you want to compile TypeScript without launching Electron:

```bash
npm run build
```

The compiled output will be written into the `dist/` directory.

---

## Building Executables

This project uses **electron-builder** to generate distributable binaries. For more details, see `BUILD.md`, but the key commands are summarized below.

### Build for current platform

```bash
npm run dist
```

This will:

- Compile the TypeScript sources.
- Package the app for the current OS into the `release/` directory.

### Build Windows `.exe` (from any platform that supports cross‑compilation)

```bash
npm run dist:win
```

Outputs (paths may vary with version):

- **Installer**: `release/ZendoWhisper-<version>-x64.exe` (NSIS installer).
- **Portable**: `release/ZendoWhisper-<version>-portable.exe` (no installation required).

### Pack without creating an installer

```bash
npm run pack
```

This performs a build and packaging pass without producing an installer, which is useful for testing.

---

## Configuration & Customization

- **App configuration**  
  Adjust window size, title, initial URL, and other behavior in:

  - `src/main/config/appConfig.ts`

- **Navigation rules**  
  Hostnames that should remain in the in‑app window vs. open externally are controlled by:

  - `src/main/window/navigation.ts`
  - `src/main/window/navigationConfig.ts`

- **Application menu**  
  To change menu items, accelerators, or labels, edit:

  - `src/main/menu/appMenu.ts`

- **Icons & branding**
  - Main icon is currently `assets/logo.png` (referenced in `package.json` under the `build.win.icon` field and in `src/main.ts`).
  - For optimal Windows support, you can convert `assets/logo.png` to `assets/logo.ico` and update the `icon` paths accordingly (see notes in `BUILD.md`).

---

## Scripts Overview

From `package.json`:

- **`npm run build`** – Compile TypeScript into `dist/` using `tsc`.
- **`npm start`** – Build TypeScript and start Electron in development mode.
- **`npm run dist`** – Build and package the app for the current platform using `electron-builder`.
- **`npm run dist:win`** – Build and package Windows installers and portable `.exe`.
- **`npm run pack`** – Build and create unpacked directory output without an installer.

---

## Distribution Notes

- The **Electron Builder** configuration is in `package.json` under the `build` field.
- Windows builds use:
  - **NSIS** for installer (`oneClick` disabled, allows custom install directory, and creates Desktop and Start Menu shortcuts).
  - **Portable** target for a no‑install executable.
- Assets under `assets/` are copied into the packaged app under `resources/assets`.

---

## License

This project is licensed under the **ISC License** as specified in `package.json`.
