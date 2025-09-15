/** Подключение к WS: канал logs|status + rentalId
 * WebSocket клиент
 * ----------------
 * Подключение:
 *   connect('logs', '123', msg => console.log(msg))
 */

export function connect(channel = 'logs', rentalId = '0', onMessage = () => {}) {
    const ws = new WebSocket(`ws://localhost:3000/ws?channel=${channel}&rentalId=${rentalId}`);
    ws.onmessage = (ev) => onMessage(JSON.parse(ev.data));
    return ws;
}