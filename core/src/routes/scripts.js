/**
 * Маршрут: /api/scripts
 * Генерация setup-скриптов и публикация в GitHub
 * (сейчас заглушка, в будущем можно подключить реальный GitHub API)
 */

import { Router } from 'express';
import { publishScript } from '../services/github.js';

const router = Router();

router.post('/generate', async (req, res, next) => {
    try {
        const {
            rentalId,
            cuda = '12.8',
            miner = 'ccminer',
            pool = {},
            wallet = '',
            worker = 'w1',
        } = req.body || {};

        const script = `#!/usr/bin/env bash
set -euo pipefail
echo "[setup] start ${rentalId}"
# TODO: install cuda ${cuda}, drivers, miner ${miner}
# pool: ${JSON.stringify(pool)}
# wallet:${wallet} worker:${worker}
echo "[setup] done"
`;

        const { url, size } = await publishScript(rentalId, script);
        res.json({ ok: true, url, size });
    } catch (e) {
        next(e);
    }
});

export default router;