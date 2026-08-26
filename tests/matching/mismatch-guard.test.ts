/**
 * Automated Tests: Mismatch Guard Safety Core
 * 
 * Verifies key capstone safety guarantees:
 * - Red fox post candidate "gray wolf" is REJECTED with category/subject mismatch reason.
 * - Low similarity candidates are REJECTED below threshold.
 * - Low vision confidence images are REJECTED.
 * - Valid red fox image on red fox post is APPROVED.
 */
