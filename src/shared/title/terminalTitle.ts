const host = "sidnei@william";
const cursor = "▌";

/**
 * Blinks a terminal cursor in the tab title at the header cursor's rhythm
 * (1s cycle). The cursor stays solid with reduced motion or in a background
 * tab, so the title never flickers for attention.
 */
export function startTerminalTitle(doc: Document = document): () => void {
  const solid = `${host} ${cursor}`;
  doc.title = solid;
  const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  let visible = true;
  const timer = window.setInterval(() => {
    visible = motion?.matches || doc.hidden ? true : !visible;
    doc.title = visible ? solid : host;
  }, 500);
  return () => {
    window.clearInterval(timer);
    doc.title = solid;
  };
}
