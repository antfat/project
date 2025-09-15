/**
 * Маршрут: /api/market
 * Получение списка офферов от провайдера (Clore API)
 * Использует кэш с TTL для оптимизации
 */

import { Router } from 'express';
import { listOffers } from '../services/clore.js';
import * as cache from '../utils/cache.js';

const router = Router();

router.get('/offers', async (req, res, next) => {
    try {
        const key = `offers:${JSON.stringify(req.query)}`;
        const cached = cache.get(key);

        if (cached) {
            return res.json({ cached: true, items: cached });
        }

        const items = await listOffers(req.query);
        cache.set(key, items);

        res.json({ cached: false, items });
    } catch (e) {
        next(e);
    }
});

export default router;