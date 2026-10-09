import { ImageResponse } from "next/og";
import { OgBlossom } from "@/components/og/blossom-svg";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#241c19" }}>
        <OgBlossom size={128} petal="#e8b8bd" crease="#241c19" />
      </div>
    ),
    size,
  );
}
