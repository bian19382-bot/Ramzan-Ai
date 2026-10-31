// Cloudflare Pages Function: POST /api/ai/consult
// Re-exports the robust handler from /api/generate for backward compatibility.
import { onRequestPost, onRequestOptions } from '../generate';

export { onRequestPost, onRequestOptions };
