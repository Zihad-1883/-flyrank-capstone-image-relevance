/**
 * Mismatch Guard Safety Core
 * 
 * Production AI safety layer implementing 3 critical decision checks:
 * 1. Category & Subject validation (rejects category/subject mismatches, e.g. wolf on fox post)
 * 2. Vector Cosine Similarity threshold check (rejects weak matches)
 * 3. Vision AI confidence score check (rejects uncertain classifications)
 * Returns explicit status (MATCHED / REJECTED) with human-readable rejection reasons.
 */
