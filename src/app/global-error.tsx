"use client";

// Replaces the root layout when it fails to render, so it must own <html>/<body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#09090b", color: "#fafafa", fontFamily: "sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <div>
            <h1 style={{ fontSize: 32, marginBottom: 16 }}>Something went wrong</h1>
            {error.digest && <p style={{ fontSize: 12, color: "#71717a", marginBottom: 24 }}>{error.digest}</p>}
            <button
              onClick={reset}
              style={{ padding: "12px 24px", borderRadius: 999, border: "1px solid rgba(139,125,240,0.4)", background: "rgba(139,125,240,0.5)", color: "#fff", cursor: "pointer", fontWeight: 700 }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
