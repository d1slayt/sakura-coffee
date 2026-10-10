"use client";

/**
 * Last-resort boundary when the root layout itself fails. It replaces the
 * whole document, so it can't rely on fonts, globals.css or the dictionary
 * module graph; styles and copy are inline.
 */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, background: "#e9e7df", color: "#222421", fontFamily: "Georgia, serif" }}>
        <main style={{ maxWidth: 560, margin: "20vh auto", padding: "0 24px" }}>
          <h1 style={{ fontWeight: 400, fontSize: 40, lineHeight: 1.1 }}>Что-то пролилось.</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6 }}>Сайт SakuraCoffee не загрузился. Попробуйте ещё раз через минуту.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ marginTop: 16, padding: "12px 24px", background: "#222421", color: "#e9e7df", border: 0, font: "600 15px system-ui, sans-serif", cursor: "pointer" }}
          >
            Попробовать снова
          </button>
        </main>
      </body>
    </html>
  );
}
