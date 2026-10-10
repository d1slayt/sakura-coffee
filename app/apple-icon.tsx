import { ImageResponse } from "next/og";
import { OgBlossom } from "@/components/og/blossom-svg";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#244c3b" }}>
        <OgBlossom size={128} petal="#d9a6a0" crease="#244c3b" />
      </div>
    ),
    size,
  );
}
