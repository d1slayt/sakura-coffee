// After `next build` with output: "export", route-segment prefetch files are
// written in nested folders (menu/__next.menu/__PAGE__.txt) while the client
// router requests dotted names (menu/__next.menu.__PAGE__.txt). A plain static
// host such as GitHub Pages can't map one to the other, so this script adds
// flattened copies next to the nested ones. Without it navigation still works,
// but every prefetch 404s and falls back to a full page load.
import { copyFile, readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const outDir = process.argv[2] ?? "out";
let copied = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) await flatten(dir, full);
    else await walk(full);
  }
}

/** Copies every file under `segmentDir` to `parent/<dotted relative path>`. */
async function flatten(parent, segmentDir) {
  const stack = [segmentDir];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else {
        const dotted = relative(parent, full).split(sep).join(".");
        await copyFile(full, join(parent, dotted));
        copied++;
      }
    }
  }
}

await walk(outDir);
console.log(`Flattened ${copied} prefetch segment files.`);
