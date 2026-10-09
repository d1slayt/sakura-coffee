/**
 * True in the static GitHub Pages build (`STATIC_EXPORT=1`), where there is
 * no server: the menu comes from bundled data and forms only validate.
 * Inlined at build time via next.config `env`.
 */
export const isStaticDemo = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export const repositoryUrl = process.env.NEXT_PUBLIC_REPO_URL ?? "";

/** Prefixes a public path with the deployment base path (e.g. "/sakura-coffee"). */
export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
