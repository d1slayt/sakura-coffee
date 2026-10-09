/**
 * The blossom mark for ImageResponse (Satori), which doesn't support SVG masks:
 * petals are drawn as ellipses and the bean crease as a background-coloured stroke.
 */
export function OgBlossom({ size, petal, crease }: { size: number; petal: string; crease: string }) {
  const angles = [0, 72, 144, 216, 288];
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48">
      {angles.map((a) => (
        <ellipse key={`p${a}`} cx="0" cy="-12" rx="6.2" ry="9" fill={petal} transform={`rotate(${a})`} />
      ))}
      {angles.map((a) => (
        <path
          key={`c${a}`}
          d="M0,-19 C1.6,-15 -1.6,-9 0,-4.5"
          stroke={crease}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          transform={`rotate(${a})`}
        />
      ))}
    </svg>
  );
}
