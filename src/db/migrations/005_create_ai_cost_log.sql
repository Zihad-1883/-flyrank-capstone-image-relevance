-- Migration: 005_create_ai_cost_log.sql
-- Creates ai_cost_log table to track per-call AI costs, model usage, token/image counts, and operations.

CREATE TABLE IF NOT EXISTS ai_cost_log (
  id SERIAL PRIMARY KEY,
  operation TEXT NOT NULL,
  reference_id INT,
  tokens_used INT,
  estimated_cost NUMERIC(10, 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);