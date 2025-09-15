/**
 * Для renderer-кода в Electron (React) реального доступа к FS нет.
 * Здесь base_dir используется только как "логический" alias для импортов,
 * а физически пути резолвит Vite по alias '@' -> app/src (см. vite.config.js).
 * В main-процессе Electron резолвим через path.resolve(__dirname,...).
 *
 * Логический alias для путей в React
 * ----------------------------------
 * Работает вместе с vite.config.js, где '@' → src/
 * Используется только для удобства импортов.
 */

export function base_dir(...segments) {
    return ['@', ...segments].join('/');
}