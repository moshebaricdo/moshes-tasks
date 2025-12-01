// main.js
const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
const path = require('path');

// Define stable storage paths
const APP_DATA_DIR = path.join(app.getPath('home'), '.moshestasks');
const TASKS_FILE = 'tasks.json';
const BACKUP_FILE = 'tasks_backup.json';

// Ensure data directory exists
function ensureDataDirectory() {
  if (!fs.existsSync(APP_DATA_DIR)) {
    fs.mkdirSync(APP_DATA_DIR, { recursive: true });
  }
}

function getTasksFilePath() {
  ensureDataDirectory();
  return path.join(APP_DATA_DIR, TASKS_FILE);
}

function getBackupFilePath() {
  ensureDataDirectory();
  return path.join(APP_DATA_DIR, BACKUP_FILE);
}

// Try to migrate data from old location if it exists
function migrateOldData() {
  const oldPath = path.join(app.getPath('userData'), 'tasks.json');
  const newPath = getTasksFilePath();
  
  if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
    try {
      const data = fs.readFileSync(oldPath, 'utf8');
      fs.writeFileSync(newPath, data);
      console.log('Successfully migrated data from old location');
    } catch (err) {
      console.error('Error migrating data:', err);
    }
  }
}

function loadTasksFromFile() {
  try {
    migrateOldData();
    const filePath = getTasksFilePath();
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading tasks file:', err);
    // Try to load from backup if main file fails
    try {
      const backupPath = getBackupFilePath();
      if (fs.existsSync(backupPath)) {
        const backupData = fs.readFileSync(backupPath, 'utf8');
        return JSON.parse(backupData);
      }
    } catch (backupErr) {
      console.error('Error reading backup file:', backupErr);
    }
  }
  return [];
}

function saveTasksToFile(tasks) {
  try {
    const filePath = getTasksFilePath();
    const backupPath = getBackupFilePath();
    
    // Create backup of current file if it exists
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
    }
    
    // Write new data
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving tasks file:', err);
    return false;
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1512,
    height: 982,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      // Keep nodeIntegration off for security
      nodeIntegration: false,
      contextIsolation: true,
      // Point to your preload script
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
}

/**
 * Configure auto-updates via GitHub Releases.
 * Requires signing/notarization on macOS for updates to apply.
 */
function setupAutoUpdates() {
  try {
    autoUpdater.autoDownload = true;
    autoUpdater.on('error', (err) => {
      console.error('Auto update error:', err);
    });
    autoUpdater.on('update-available', () => {
      dialog.showMessageBox({
        type: 'info',
        message: 'An update is available and will be downloaded in the background.',
        buttons: ['OK'],
      });
    });
    autoUpdater.on('update-downloaded', () => {
      const result = dialog.showMessageBoxSync({
        type: 'question',
        buttons: ['Install and Restart', 'Later'],
        defaultId: 0,
        cancelId: 1,
        message: 'Update ready to install. Restart now?',
      });
      if (result === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  } catch (e) {
    console.error('Failed to initialize auto updates:', e);
  }
}

/**
 * Create the macOS application menu with a custom About item.
 * The About item computes the resolved tasks count at click-time and
 * shows the native About panel with that metadata.
 */
function createAppMenu() {
  // Helper to compute the total resolved tasks (seeded base + persisted resolved)
  function getTotalResolvedTasks() {
    const BASE_SEEDED_RESOLVED = 100;
    const tasks = loadTasksFromFile();
    const resolvedCount = tasks.filter(t => t && t.isResolved).length;
    return BASE_SEEDED_RESOLVED + resolvedCount;
  }

  function showAboutPanel() {
    const totalResolved = getTotalResolvedTasks();
    // Update about panel options right before showing to keep it dynamic
    app.setAboutPanelOptions({
      applicationName: app.name,
      applicationVersion: app.getVersion(),
      credits: `Resolved tasks: ${totalResolved}`,
    });
    app.showAboutPanel();
  }

  // Only customize the macOS menu; other platforms can keep defaults
  if (process.platform === 'darwin') {
    const template = [
      {
        label: app.name,
        submenu: [
          {
            label: `About ${app.name}`,
            click: () => showAboutPanel(),
          },
          {
            label: 'Check for Updates…',
            click: () => {
              try {
                autoUpdater.checkForUpdates();
              } catch (e) {
                console.error('Manual update check failed:', e);
              }
            },
          },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      },
      // Minimal Edit menu for standard shortcuts
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' },
        ],
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          { type: 'separator' },
          { role: 'front' },
        ],
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}

app.whenReady().then(() => {
  createWindow();
  createAppMenu();
  setupAutoUpdates();
  // Background check on startup; will also notify
  try {
    autoUpdater.checkForUpdatesAndNotify();
  } catch (e) {
    console.error('Initial update check failed:', e);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// IPC Handlers
ipcMain.handle('load-tasks', () => {
  return loadTasksFromFile();
});

ipcMain.handle('save-tasks', (event, tasks) => {
  return saveTasksToFile(tasks);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});