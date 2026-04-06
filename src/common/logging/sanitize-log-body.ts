const BODY_MAX_CHARS = 5000;
const REDACT_KEYS = new Set([
  'password',
  'token',
  'refreshtoken',
  'accesstoken',
  'authorization',
  'secret',
]);

export function sanitizeLogBody(body: unknown): string | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }
  if (typeof body === 'object' && !Array.isArray(body)) {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
      if (REDACT_KEYS.has(key.toLowerCase())) {
        out[key] = '[REDACTED]';
      } else {
        out[key] = value;
      }
    }
    try {
      const s = JSON.stringify(out);
      return s.length > BODY_MAX_CHARS ? `${s.slice(0, BODY_MAX_CHARS)}…` : s;
    } catch {
      return '[unserializable]';
    }
  }
  try {
    const s = JSON.stringify(body);
    return s.length > BODY_MAX_CHARS ? `${s.slice(0, BODY_MAX_CHARS)}…` : s;
  } catch {
    return '[unserializable]';
  }
}
