/**
 * ASCII Box-Drawing Diagram detection.
 *
 * Detects whether a plain code-block contains a Unicode box-drawing diagram
 * (┌─┐│└┘├┤ etc.) so the renderer can convert it to SVG automatically.
 */

// Box-drawing characters used in detection
const BOX_DRAWING_RE =
  /[\u2500-\u257F\u2580-\u259F┌┐└┘├┤┬┴┼─│═║╔╗╚╝╠╣╦╩╬]/;
const CORNER_CHARS = new Set(['┌', '┐', '└', '┘', '╔', '╗', '╚', '╝']);

/**
 * Detect whether `content` looks like a box-drawing diagram.
 *
 * Heuristics:
 *  1. At least 3 non-blank lines.
 *  2. At least 4 corner characters (enough for one closed rectangle).
 *  3. Box-drawing character density > 5 % of non-whitespace characters.
 */
export function isAsciiBoxDiagram(content: string): boolean {
  const lines = content.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length < 3) return false;

  let boxDrawingCount = 0;
  let nonWhitespaceCount = 0;
  let cornerCount = 0;

  for (const line of lines) {
    for (const ch of line) {
      if (/\s/.test(ch)) continue;
      nonWhitespaceCount++;
      if (BOX_DRAWING_RE.test(ch)) boxDrawingCount++;
      if (CORNER_CHARS.has(ch)) cornerCount++;
    }
  }

  if (nonWhitespaceCount === 0) return false;
  if (cornerCount < 4) return false;
  if (boxDrawingCount / nonWhitespaceCount < 0.05) return false;

  return true;
}
