/**
 * Сервис аудита (white/black list)
 */

import db_connection from '../db/db_connection.js';

// Добавить сервер в whitelist
export async function whitelistAdd(source, externalId, validFor = [], reason = '') {
    await db_connection.query(
        `INSERT INTO whitelist (server_source, server_external_id, valid_for, reason)
     VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE
       valid_for=VALUES(valid_for), reason=VALUES(reason)`,
        [source, externalId, JSON.stringify(validFor), reason]
    );
}

// Добавить сервер в blacklist
export async function blacklistAdd(source, externalId, invalidFor = [], reason = '') {
    await db_connection.query(
        `INSERT INTO blacklist (server_source, server_external_id, invalid_for, reason)
     VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE
       invalid_for=VALUES(invalid_for), reason=VALUES(reason)`,
        [source, externalId, JSON.stringify(invalidFor), reason]
    );
}

// Получить список whitelist
export async function whitelistList() {
    const [rows] = await db_connection.query(
        'SELECT * FROM whitelist ORDER BY created_at DESC'
    );
    return rows;
}

// Получить список blacklist
export async function blacklistList() {
    const [rows] = await db_connection.query(
        'SELECT * FROM blacklist ORDER BY created_at DESC'
    );
    return rows;
}