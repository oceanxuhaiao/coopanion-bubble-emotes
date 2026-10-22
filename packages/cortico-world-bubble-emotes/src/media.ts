export function pngSize(bytes: Uint8Array): { width: number; height: number } {
  const b = Buffer.from(bytes);
  if (b.length < 33 || b.length > 2 * 1024 * 1024 || b.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Sticker must be a PNG under 2 MiB.');
  let offset = 8, width = 0, height = 0, ended = false;
  while (offset + 12 <= b.length) {
    const n = b.readUInt32BE(offset), type = b.toString('ascii', offset + 4, offset + 8);
    if (offset + 12 + n > b.length) throw new Error('Truncated PNG.');
    if (offset === 8 && (type !== 'IHDR' || n !== 13)) throw new Error('Invalid PNG header.');
    if (type === 'IHDR') { width = b.readUInt32BE(offset + 8); height = b.readUInt32BE(offset + 12); }
    if (type === 'acTL') throw new Error('Animated PNG is not supported.');
    offset += 12 + n;
    if (type === 'IEND') { ended = true; break; }
  }
  if (!ended || !width || !height || width > 2048 || height > 2048 || width * height > 4_194_304) throw new Error('Invalid or oversized PNG.');
  return { width, height };
}

