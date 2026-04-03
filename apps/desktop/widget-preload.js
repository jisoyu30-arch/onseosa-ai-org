const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('widget', {
  hide: () => ipcRenderer.send('hide-widget'),
  openMain: () => ipcRenderer.send('show-main'),
  resize: (mode) => ipcRenderer.send('widget-resize', { mode }),
});
