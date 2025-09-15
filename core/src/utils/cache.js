/**
 * In-memory кэш с TTL
 * -------------------
 * Используется для кэширования API-запросов (например, офферов с Clore).
 *
 * cache.set('offers', items, 120000)
 * cache.get('offers') → вернёт значение или null, если устарело
 */

const store = new Map();

/**
 * Сохранить значение в кэше
 * @param {string} key — ключ
 * @param {any} value — данные
 * @param {number} ttlMs — время жизни (по умолчанию 2 минуты)
 */
export function set(key, value, ttlMs = 2 * 60 * 1000) {
    store.set(key, { value, expires: Date.now() + ttlMs });
}

/**
 * Получить значение из кэша
 * @param {string} key — ключ
 * @returns {any|null}
 */
export function get(key) {
    const v = store.get(key);
    if (!v) return null;

    if (Date.now() > v.expires) {
        store.delete(key);
        return null;
    }

    return v.value;
}