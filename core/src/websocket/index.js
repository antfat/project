/**
 * WebSocket сервер
 * ----------------
 * Создаёт WS endpoint /ws
 * Подключение:
 *   ws://localhost:3000/ws?channel=logs&rentalId=123
 *
 * Каналы:
 *   - logs   → логи аренды
 *   - status → статусы сервера
 */

import { WebSocketServer } from 'ws';

export function initWebSocket(httpServer) {
    const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

    wss.on('connection', (ws, req) => {
        const url = new URL(req.url, 'http://localhost');
        const channel = url.searchParams.get('channel') || 'logs';
        const rentalId = url.searchParams.get('rentalId') || '0';

        // Приветственное сообщение
        ws.send(
            JSON.stringify({ type: 'hello', channel, rentalId })
        );

        // Каждые 1.5 сек отправляем тестовое сообщение
        const timer = setInterval(() => {
            ws.send(
                JSON.stringify({
                    type: channel,
                    ts: Date.now(),
                    line: `[demo] ${channel} for ${rentalId}`,
                })
            );
        }, 1500);

        ws.on('close', () => clearInterval(timer));
    });
}