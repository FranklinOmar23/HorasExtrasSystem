export function Spinner({ size = 14 }: { size?: number }) {
  return <span className="hx-spinner" style={{ width: size, height: size }} />;
}
