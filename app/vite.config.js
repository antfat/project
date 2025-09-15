/**
 * Vite-конфигурация для React + Electron
 * --------------------------------------
 * - JSX/React через @vitejs/plugin-react
 * - alias '@' → app/src
 * - dev-сервер на порту 5173
 * - build: обычный (минификация, cssMinify)
 * - build:analyze → дополнительно генерит отчёт в analyze/stats.html
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

// Определяем: включать ли анализатор?
const isAnalyze = process.env.ANALYZE === "true";

export default defineConfig({
    plugins: [
        react(),
        ...(isAnalyze
            ? [
                visualizer({
                    filename: "analyze/stats.html", // папка analyze/
                    open: true, // сразу открыть в браузере
                }),
            ]
            : []),
    ],
    server: {
        host: "127.0.0.1", // ✅ фикс, чтобы Electron и браузер видели Vite
        port: 5173,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    build: {
        minify: "esbuild",
        sourcemap: false,
        cssMinify: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ["react", "react-dom"], // вынесем React отдельно
                },
            },
        },
    },
    define: {
        'process.env': {}
    }
});
