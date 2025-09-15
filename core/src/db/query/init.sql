-- Таблицы users, api_keys, servers, rentals, logs, whitelist, blacklist, idempotency_keys

CREATE TABLE IF NOT EXISTS users (...) ENGINE=InnoDB;
-- (см. прошлую версию — здесь без повторения, с теми же полями)

-- Привожу только whitelist / blacklist и idempotency:
    CREATE TABLE IF NOT EXISTS whitelist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    server_source VARCHAR(16),
    server_external_id VARCHAR(128),
    valid_for JSON,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (server_source, server_external_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    server_source VARCHAR(16),
    server_external_id VARCHAR(128),
    invalid_for JSON,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (server_source, server_external_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS idempotency_keys (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    key_hash VARCHAR(64) UNIQUE,
    result JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;