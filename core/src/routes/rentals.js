/**
 * Маршрут: /api/rentals
 * Управление арендой (аренда / релиз сервера)
 * Поддерживает идемпотентность через Idempotency-Key
 */

import { Router } from 'express';
import idempotency from '../middlewares/idempotency.js';
import * as clore from '../services/clore.js';
import db_connection from '../db/db_connection.js';

const router = Router();

// Аренда
router.post('/', idempotency, async (req, res, next) => {
    try {
        const { provider = 'clore', offerId, params = {} } = req.body || {};
        const rent = await clore.rent(offerId, params);

        await db_connection.query(
            'INSERT INTO rentals (user_id, provider, offer_id, status, access) VALUES (?,?,?,?,?)',
            [1, provider, offerId, 'active', JSON.stringify(rent.access || {})]
        );

        res.json({ ok: true, rentalId: rent.rentalId, access: rent.access });
    } catch (e) {
        next(e);
    }
});

// Релиз
router.post('/release', async (req, res, next) => {
    try {
        const { rentalId } = req.body || {};
        await clore.release(rentalId);

        await db_connection.query(
            'UPDATE rentals SET status="released", ended_at=NOW() WHERE id=?',
            [rentalId]
        );

        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
});

export default router;