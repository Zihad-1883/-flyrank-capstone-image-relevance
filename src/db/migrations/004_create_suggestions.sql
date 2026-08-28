-- Migration: 004_create_suggestions.sql
-- Creates suggestions table to record image-to-post matching candidates, guard status (MATCHED/REJECTED), rejections reasons, and human approvals.

CREATE TABLE IF NOT EXISTS suggestions (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  image_id INT REFERENCES images(id) ON DELETE SET NULL,
  similarity_score FLOAT,
  status TEXT NOT NULL,
  rejection_reason TEXT,
  reviewed_by_human BOOLEAN NOT NULL DEFAULT false,
  human_decision TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);