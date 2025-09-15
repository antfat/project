/**
 * Унифицированное построение путей внутри backend
 * -----------------------------------------------
 * Вместо "../.." используем:
 *   import { base_dir } from '../utils/base_dir.js'
 *   const pathToFile = base_dir('db', 'query', 'init.sql')
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..'); // → core/src

/**
 * Построение абсолютного пути относительно core/src
 * @param  {...string} segments — сегменты пути
 */
export function base_dir(...segments) {
    return path.resolve(ROOT, ...segments);
}

export { ROOT };