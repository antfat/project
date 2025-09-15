// preload.js — мост между main и renderer
// Позволяет безопасно передавать данные между Electron main и React (renderer)
// Например, можно слушать IPC события или ограничивать доступ к API Node.js
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // Здесь можно добавить методы для общения с main процессом
})
