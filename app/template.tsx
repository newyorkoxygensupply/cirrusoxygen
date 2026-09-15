// A template (unlike layout) remounts on every navigation, so this wrapper
// re-runs its enter animation each time a new route's content mounts — a
// subtle cross-fade + rise that makes navigation feel like one continuous
// instrument rather than a series of document loads. No-ops under
// reduced-motion (see .page-enter in globals.css).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
