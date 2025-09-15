/**
 * Dev-утилиты для работы с БД на этапе разработки.
 * - renameTable(oldName, newName)
 * - dropTable(name)
 * Никогда не подключайте эти функции на проде.
 */
const pool = require('./db_connection');

async function renameTable(oldName, newName) {
    await db_connection.query(`RENAME TABLE \`${oldName}\` TO \`${newName}\``);
    return { ok: true };
}

async function dropTable(name) {
    await db_connection.query(`DROP TABLE IF EXISTS \`${name}\``);
    return { ok: true };
}

module.exports = { renameTable, dropTable };