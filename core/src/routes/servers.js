/**
* Маршрут: /api/servers
* Управление whitelist / blacklist
*/

import { Router } from 'express';
import {
    whitelistAdd,
    blacklistAdd,
    whitelistList,
    blacklistList,
} from '../services/auditor.js';

const router = Router();

// Получить whitelist
router.get('/whitelist', async (_req, res, next) => {
    try {
        res.json(await whitelistList());
    } catch (e) {
        next(e);
    }
});

// Получить blacklist
router.get('/blacklist', async (_req, res, next) => {
    try {
        res.json(await blacklistList());
    } catch (e) {
        next(e);
    }
});

// Добавить в whitelist
router.post('/whitelist', async (req, res, next) => {
    try {
        const { source, externalId, validFor = [], reason = '' } = req.body || {};
        await whitelistAdd(source, externalId, validFor, reason);
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
});

// Добавить в blacklist
router.post('/blacklist', async (req, res, next) => {
    try {
        const { source, externalId, invalidFor = [], reason = '' } = req.body || {};
        await blacklistAdd(source, externalId, invalidFor, reason);
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
});

export default router;