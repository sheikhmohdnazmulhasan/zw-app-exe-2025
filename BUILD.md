# Building ZendoWhisper Executable

## Prerequisites
- Node.js installed
- All dependencies installed (`npm install`)

## Building the Executable

### For Windows (.exe)

1. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

2. **Create the executable:**
   ```bash
   npm run dist:win
   ```
   
   Or for all platforms:
   ```bash
   npm run dist
   ```

3. **Output Location:**
   The built executables will be in the `release` folder:
   - **Installer**: `release/ZendoWhisper-1.0.0-x64.exe` (NSIS installer)
   - **Portable**: `release/ZendoWhisper-1.0.0-portable.exe` (No installation needed)

### Build Options

- `npm run dist` - Build for current platform
- `npm run dist:win` - Build specifically for Windows
- `npm run pack` - Build without creating installer (for testing)

## Notes

- The installer allows users to choose installation directory
- Desktop and Start Menu shortcuts are created automatically
- The portable version can run without installation
- The logo.png is used as the application icon (electron-builder will convert it automatically)

## Icon Note

For best results on Windows, consider converting `assets/logo.png` to `assets/logo.ico` format. You can use online converters or tools like ImageMagick. Then update the `icon` field in `package.json` to `"assets/logo.ico"`.

