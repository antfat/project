/**
 * Middleware: идемпотентность запросов.
 * Если есть заголовок Idempotency-Key → возвращаем сохранённый результат.
 */

import crypto from 'crypto';
import db_connection from '../db/db_connection.js';

export default async function idempotency(req, res, next) {
    const key = req.header('Idempotency-Key');
    if (!key) return next();

    const raw = JSON.stringify({
        m: req.method,
        u: req.originalUrl,
        b: req.body || {},
    });

    const keyHash = crypto
        .createHash('sha256')
        .update(`${key}:${raw}`)
        .digest('hex');

    try {
        const [rows] = await db_connection.query(
            'SELECT result FROM idempotency_keys WHERE key_hash=?',
            [keyHash]
        );

        if (rows.length) return res.json(JSON.parse(rows[0].result));

        const original = res.json.bind(res);

        res.json = async (payload) => {
            try {
                await db_connection.query(
                    'INSERT INTO idempotency_keys (key_hash, result) VALUES (?,?)',
                    [keyHash, JSON.stringify(payload)]
                );
            } catch {
                /* ignore */
            }
            return original(payload);
        };

        next();
    } catch (e) {
        next(e);
    }
}