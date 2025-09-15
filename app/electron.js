/**
 * Main-процесс Electron
 * ---------------------
 * - создаёт окно приложения
 * - в dev-режиме грузит Vite dev server (http://127.0.0.1:5173)
 * - в prod-режиме грузит сгенерированный dist/index.html
 */
import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (isDev) {
        // ✅ Загружаем dev-сервер Vite
        const devServerURL = "http://127.0.0.1:5173";
        mainWindow.loadURL(devServerURL).catch((err) => {
            console.error("Не удалось загрузить Vite dev server:", err);
        });

        // Откроем DevTools автоматически (по желанию)
        mainWindow.webContents.openDevTools({ mode: "detach" });

        // Чистим кэш, чтобы избежать белого экрана
        mainWindow.webContents.session.clearCache();
    } else {
        // ✅ Загружаем собранный frontend
        const indexPath = path.join(__dirname, "dist/index.html");
        mainWindow.loadFile(indexPath).catch((err) => {
            console.error("Не удалось загрузить index.html:", err);
        });
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});