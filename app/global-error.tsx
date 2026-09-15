"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#eff1ee", color: "#14171a", fontFamily: "sans-serif" }}>
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            padding: "8rem 2rem",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#565b58" }}>
            Something went wrong
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 16 }}>CIRRUS hit a snag loading.</h1>
          <p style={{ marginTop: 16, color: "#565b58", fontSize: 14 }}>
            Nothing on your order was affected. Reload to try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 36,
              cursor: "pointer",
              borderRadius: 3,
              background: "#1f4d3d",
              color: "#eff1ee",
              padding: "12px 24px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
