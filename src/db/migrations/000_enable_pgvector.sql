-- Migration: 000_enable_pgvector.sql
-- Enables the pgvector extension for vector similarity search.

CREATE EXTENSION IF NOT EXISTS vector;