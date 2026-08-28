-- Migration: 002_create_posts.sql
-- Creates posts table to store blog post content, titles, target subjects/categories, and post text embeddings.

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  embedding VECTOR(768),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);