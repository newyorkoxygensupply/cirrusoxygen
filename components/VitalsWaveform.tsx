/**
 * A plethysmograph line — the pulse-oximetry waveform shape recognizable
 * from any bedside monitor — used purely as a recurring visual motif, never
 * with numbers attached. It's decoration, not a reading: no SpO2/HR figures
 * are drawn from it, so it never implies a real measurement.
 */
const BEAT = "l6,0 c1.5,0 2,-13 3.5,-13 c1.5,0 1.5,8.5 3,9.5 c1.5,1 2.5,-5 4,-5 c1.5,0 2,7.5 3.5,8.5 l6,0";
const BEATS_PER_TILE = 5;
const TILE_WIDTH = BEATS_PER_TILE * 26;

function buildTilePath() {
  return `M0,20 ${Array.from({ length: BEATS_PER_TILE }).map(() => BEAT).join(" ")}`;
}

export function VitalsWaveform({ className = "", height = 40 }: { className?: string; height?: number }) {
  const tile = buildTilePath();
  return (
    <div className={`vitals-waveform overflow-hidden ${className}`} style={{ height }} aria-hidden="true">
      <svg width="100%" height={height} viewBox={`0 0 ${TILE_WIDTH} 40`} preserveAspectRatio="none">
        <g className="vitals-waveform-track">
          <path d={tile} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,0)" />
          <path d={tile} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${TILE_WIDTH},0)`} />
        </g>
      </svg>
    </div>
  );
}
