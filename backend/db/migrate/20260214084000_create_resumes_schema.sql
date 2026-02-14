-- +goose Up
-- +goose StatementBegin

-- создание схему resumes
CREATE SCHEMA IF NOT EXISTS resumes;

-- создаем таблицу resumes.resume
CREATE TABLE IF NOT EXISTS resumes.resume (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    title TEXT NOT NULL,
    user_id INTEGER NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS resumes.resume;
DROP SCHEMA IF EXISTS resumes CASCADE;
-- +goose StatementEnd
