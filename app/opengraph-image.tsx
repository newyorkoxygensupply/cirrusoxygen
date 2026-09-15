import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #eff1ee 0%, #dde3dd 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="46" height="35" viewBox="0 0 34 26" fill="none">
            <path d="M3 7.5C9 2.5 19 2.5 31 7" stroke="#1f4d3d" strokeWidth="3.1" strokeLinecap="round" />
            <path d="M6.5 14.5C11.5 11 19.5 11 26.5 14" stroke="#1f4d3d" strokeWidth="2.5" strokeLinecap="round" opacity="0.62" />
            <path d="M10 21.5C13.7 19.3 18.7 19.3 23 21" stroke="#a35a26" strokeWidth="2.1" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#14171a" }}>
            CIRRUS<span style={{ color: "#a35a26" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#1f4d3d",
              fontWeight: 600,
            }}
          >
            Precision Respiratory Equipment
          </div>
          <div style={{ display: "flex", fontSize: 58, fontWeight: 700, color: "#14171a", lineHeight: 1.15, maxWidth: 980 }}>
            Aviation-Grade Oxygen & Sleep Apnea Systems
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#565b58", maxWidth: 820 }}>
            Self-pay only — no insurance, Medicaid, or Medicare. Prescription required.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
