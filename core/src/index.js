/**
 * Точка входа backend
 * -------------------
 * - Express HTTP API
 * - WebSocket сервер
 * - Подключение роутов и middleware
 */

import express from 'express';
import cors from 'cors';
import http from 'http';

import { env } from './config/env.js';
import errorHandler from './middlewares/errorHandler.js';
import { initWebSocket } from './websocket/index.js';

// Роуты
import market from './routes/market.js';
import rentals from './routes/rentals.js';
import servers from './routes/servers.js';
import scripts from './routes/scripts.js';
import status from './routes/status.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Роуты API
app.use('/api/market', market);
app.use('/api/rentals', rentals);
app.use('/api/servers', servers);
app.use('/api/scripts', scripts);
app.use('/api', status);

// Error handler
app.use(errorHandler);

// HTTP + WS сервер
const server = http.createServer(app);
initWebSocket(server);

// Запуск
server.listen(env.APP_PORT, () => {
    console.log(`✅ Backend listening on :${env.APP_PORT} [${env.NODE_ENV}]`);
});