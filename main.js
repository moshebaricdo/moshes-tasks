// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
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

app.whenReady().then(() => {
  createWindow();

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