// preload.js
const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expose methods to the renderer via window.electronAPI
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // Load tasks from main
  loadTasks: () => ipcRenderer.invoke('load-tasks'),

  // Save tasks to main
  saveTasks: (tasks) => ipcRenderer.invoke('save-tasks', tasks),
});