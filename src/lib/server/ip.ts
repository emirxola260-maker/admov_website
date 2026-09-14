import "server-only";

/**
 * Resolves the client's real IP address in a reverse-proxy environment (e.g. Vercel, Cloudflare).
 *
 * `x-real-ip` and `x-vercel-forwarded-for` are set directly by the edge infrastructure
 * and cannot be spoofed by client-provided headers.
 *
 * For `x-forwarded-for`, untrusted client headers are prepended (`<client-ip>, <edge-proxy-ip>`).
 * Therefore, taking the last entry ensures we read the IP appended by the trusted outermost proxy,
 * rather than an arbitrary attacker-supplied first entry.
 */
export function getClientIp(request: Request): string {
  const directHeader = request.headers.get("x-real-ip") || request.headers.get("x-vercel-forwarded-for");
  if (directHeader) {
    const trimmed = directHeader.trim();
    if (trimmed) return trimmed;
  }

  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const ips = fwd.split(",").map((s) => s.trim()).filter(Boolean);
    if (ips.length > 0) {
      return ips[ips.length - 1];
    }
  }

  return "unknown";
}
