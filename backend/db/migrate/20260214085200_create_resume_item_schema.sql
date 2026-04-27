-- +goose Up
-- +goose StatementBegin
-- создание схемы resume_item
CREATE SCHEMA IF NOT EXISTS resume_item;

-- таблица resume_item.personal_data
CREATE TABLE IF NOT EXISTS resume_item.personal_data (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    desired_job TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    birth_date TIMESTAMP WITH TIME ZONE,
    website TEXT,
    github TEXT
);

-- таблица resume_item.about
CREATE TABLE IF NOT EXISTS resume_item.about (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    about TEXT
);

-- таблица resume_item.custom
CREATE TABLE IF NOT EXISTS resume_item.custom (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    title TEXT,
    content TEXT
);

-- таблица resume_item.educations
CREATE TABLE IF NOT EXISTS resume_item.educations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    university VARCHAR(100),
    faculty VARCHAR(100),
    degree VARCHAR(100),
    major VARCHAR(100),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    finished BOOLEAN NOT NULL DEFAULT false
);

-- таблица resume_item.hard_skills
CREATE TABLE IF NOT EXISTS resume_item.hard_skills (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    skill_id INTEGER
);

-- таблица resume_item.job_experiences
CREATE TABLE IF NOT EXISTS resume_item.job_experiences (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    company TEXT,
    position TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS resume_item.item (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    resume_id INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    item_id INTEGER NOT NULL
)


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS resume_item.job_experiences;
DROP TABLE IF EXISTS resume_item.hard_skills;
DROP TABLE IF EXISTS resume_item.educations;
DROP TABLE IF EXISTS resume_item.custom;
DROP TABLE IF EXISTS resume_item.about;
DROP TABLE IF EXISTS resume_item.personal_data;
DROP SCHEMA IF EXISTS resume_item CASCADE;
-- +goose StatementEnd
