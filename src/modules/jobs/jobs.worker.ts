/**
 * Background Job Worker Loop
 * 
 * Asynchronous background worker process that polls for pending image vision/embedding jobs,
 * executes Gemini vision classification with retries (exponential backoff), tracks cost,
 * updates DB records, and flags low-confidence images.
 */
