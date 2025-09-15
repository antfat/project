/**
 * MySQL пул соединений
 * ---------------------
 * Любой модуль может импортировать pool:
 *   import pool from '../db/db_connection.js'
 *
 * pool.query(...)      → простой запрос
 * pool.getConnection() → ручное соединение
 */

import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

// Создаём пул соединений
const db_connection = mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default db_connection;