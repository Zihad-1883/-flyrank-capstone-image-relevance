-- Migration: 001_create_images.sql
-- Creates images table to store image metadata, categories, tags JSON, vision confidence, and status flags.

CREATE TABLE IF NOT EXISTS images(
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    subject TEXT,
    category TEXT,
    attributes TEXT[],
    caption TEXT,
    confidence FLOAT,
    embedding VECTOR(768),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)