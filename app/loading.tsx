export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-8 py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-border" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
        </div>
        <p className="font-mono text-[11px] tracking-[0.1em] text-muted-2 uppercase">Loading</p>
      </div>
    </div>
  );
}
