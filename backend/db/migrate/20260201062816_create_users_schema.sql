-- +goose Up
-- +goose StatementBegin
-- Создаем схему users
CREATE SCHEMA IF NOT EXISTS users;

-- Создаем таблицу users.profile
CREATE TABLE users.profile (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users.profile;
DROP SCHEMA IF EXISTS users CASCADE;
-- +goose StatementEnd
