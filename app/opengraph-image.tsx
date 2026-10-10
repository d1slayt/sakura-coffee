import { ImageResponse } from "next/og";
import { OgBlossom } from "@/components/og/blossom-svg";
import { getDictionary } from "@/lib/i18n";

export const alt = getDictionary().meta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph card: the blossom mark and the Latin wordmark only. The image
 * renderer's built-in font has no Cyrillic, and fetching a font at build time
 * would make builds depend on the network, so the card carries no copy.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#244c3b",
          color: "#e9e7df",
          padding: "72px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <OgBlossom size={220} petal="#d9a6a0" crease="#244c3b" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, letterSpacing: -4, lineHeight: 1 }}>SakuraCoffee</div>
          <div style={{ display: "flex", marginTop: 28, height: 3, width: "100%", background: "#a9aaa5" }} />
        </div>
      </div>
    ),
    size,
  );
}
