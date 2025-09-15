/**
 * =====================================================
 * ShWrapper — универсальная обёртка для вызова функций из .sh файлов
 * =====================================================
 *
 * Как использовать:
 *
 * 1️⃣ Импортировать класс:
 *    import { ShWrapper } from "./env/sh-wrapper.js";
 *
 * 2️⃣ Создать объект класса (директория по умолчанию /core/env):
 *    const sh = new ShWrapper();
 *
 * 3️⃣ Получить список всех скриптов:
 *    console.log(sh.listScripts());
 *
 * 4️⃣ Выполнить любую функцию из скрипта:
 *    await sh.run("имя_скрипта", "имя_функции", "аргументы");
 *    Пример:
 *      await sh.run("nvm", "node-version");
 *
 * 5️⃣ Для удобства работы с nvm.sh можно использовать обёртку:
 *    const nvm = sh.nvm(); // если nvm.sh лежит в /core/env
 *    await nvm.nodeVersion();
 *    await nvm.nodeUse("18");
 *
 * 6️⃣ Скрипты из вложенных папок будут доступны через имя с подчеркиваниями:
 *    env/tools/nvm.sh -> "tools_nvm"
 * =====================================================
 */

import { exec } from "child_process";
import fs from "fs";
import path from "path";

// =====================================================
// Локальная константа для директории скриптов
// =====================================================
const ENV = path.resolve(__dirname, "/core/env"); // директория с .sh скриптами

// =====================================================
// Вспомогательная функция: рекурсивный поиск .sh файлов
// =====================================================
function findShFilesRecursive(dir, filesList = []) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            findShFilesRecursive(fullPath, filesList);
        } else if (item.isFile() && item.name.endsWith(".sh")) {
            filesList.push(fullPath);
        }
    }
    return filesList;
}

// =====================================================
// Класс обёртки для .sh файлов
// =====================================================
export class ShWrapper {
    /**
     * @param {string} envDir - директория с .sh файлами, по умолчанию ENV
     */
    constructor(envDir = ENV) {
        this.envDir = path.resolve(envDir);
        this.scripts = {};

        // Рекурсивно ищем все .sh файлы
        const files = findShFilesRecursive(this.envDir);
        files.forEach(file => {
            // имя скрипта = путь относительно env без расширения, заменяем / на _
            const relativePath = path.relative(this.envDir, file);
            const name = relativePath.replace(/[/\\]/g, "_").replace(/\.sh$/, "");
            this.scripts[name] = file;
        });
    }

    /**
     * Выполнить функцию из .sh файла
     * @param {string} scriptName - имя скрипта, сгенерированное автоматически
     * @param {string} funcName - функция или команда внутри скрипта
     * @param {string} args - аргументы команды
     * @returns {Promise<string>}
     */
    run(scriptName, funcName, args = "") {
        return new Promise((resolve, reject) => {
            const shFilePath = this.scripts[scriptName];
            if (!shFilePath) return reject(`❌ Скрипт ${scriptName} не найден в ${this.envDir}`);

            const cmd = `zsh -c 'source ${shFilePath} && ${funcName} ${args}'`;
            exec(cmd, (error, stdout, stderr) => {
                if (error) return reject(`Ошибка: ${error.message}`);
                if (stderr) return reject(`stderr: ${stderr}`);
                resolve(stdout.trim());
            });
        });
    }

    /**
     * Удобная обёртка для nvm.sh
     */
    nvm(scriptName = "nvm") {
        return {
            nvmVersion: () => this.run(scriptName, "nvm-version"),
            nvmUpdate: () => this.run(scriptName, "nvm-update"),
            nodeVersion: () => this.run(scriptName, "node-version"),
            nodeInstallLts: () => this.run(scriptName, "node-install-lts"),
            nodeInstall: (ver) => this.run(scriptName, "node-install", ver),
            nodeUse: (ver) => this.run(scriptName, "node-use", ver),
            nodeList: () => this.run(scriptName, "node-list")
        };
    }

    /**
     * Получить список всех скриптов (имена с подчеркиваниями для вложенных папок)
     */
    listScripts() {
        return Object.keys(this.scripts);
    }
}