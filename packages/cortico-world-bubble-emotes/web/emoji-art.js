/** Original bundled artwork for the hugging emoji on fonts without U+1FAC2. */
const huggingSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 80 80\"><path fill=\"#dce9ff\" d=\"M40 74C25 65 7 52 7 32a18 18 0 0 1 33-9 18 18 0 0 1 33 9c0 20-18 33-33 42Z\"/><circle cx=\"28\" cy=\"24\" r=\"12\" fill=\"#4389db\"/><circle cx=\"52\" cy=\"24\" r=\"12\" fill=\"#69b9ed\"/><path fill=\"#4389db\" d=\"M11 50c0-12 7-20 17-20 11 0 18 9 18 22v16H25c-8 0-14-7-14-18Z\"/><path fill=\"#69b9ed\" d=\"M69 50c0-12-7-20-17-20-11 0-18 9-18 22v16h21c8 0 14-7 14-18Z\"/><path d=\"M20 43c2 12 17 16 33 9\" fill=\"none\" stroke=\"#246bbb\" stroke-width=\"11\" stroke-linecap=\"round\"/><path d=\"M60 42c-2 12-17 20-33 17\" fill=\"none\" stroke=\"#8ad1f5\" stroke-width=\"11\" stroke-linecap=\"round\"/></svg>";
const huggingSrc = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(huggingSvg);
export function emojiArtwork(text) { return /^🫂\ufe0f?$/u.test(text) ? huggingSrc : undefined; }
export function renderEmojiText(root, text) {
  const doc = root.ownerDocument, nodes = [];
  for (const part of text.split(/(🫂\ufe0f?)/u)) {
    const src = emojiArtwork(part);
    if (!src) { nodes.push(doc.createTextNode(part)); continue; }
    const image = doc.createElement('img');
    image.src = src; image.alt = part; image.title = '拥抱'; image.className = 'emoji-art';
    image.style.cssText = 'display:inline-block;width:1.15em;height:1.15em;vertical-align:-0.15em;object-fit:contain;';
    nodes.push(image);
  }
  root.replaceChildren(...nodes);
}
