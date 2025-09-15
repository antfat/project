/**
 * HTTP-клиент для общения с backend API
 * -------------------------------------
 * Использует fetch и возвращает JSON.
 */

const BASE = 'http://localhost:3000/api';

export async function getHealth() {
    const r = await fetch(`${BASE}/health`);
    return r.json();
}

export async function getOffers(params = {}) {
    const q = new URLSearchParams(params).toString();
    const r = await fetch(`${BASE}/market/offers?${q}`);
    return r.json();
}

export async function addWhitelist(body) {
    const r = await fetch(`${BASE}/servers/whitelist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return r.json();
}

export async function addBlacklist(body) {
    const r = await fetch(`${BASE}/servers/blacklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return r.json();
}

export async function rent(body, idemKey) {
    const r = await fetch(`${BASE}/rentals`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idemKey || crypto.randomUUID(),
        },
        body: JSON.stringify(body),
    });
    return r.json();
}