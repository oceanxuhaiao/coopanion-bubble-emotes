const emojiUnit=new RegExp('^(?:\\p{RGI_Emoji}|\\p{Extended_Pictographic}\\uFE0F?)$','v');
const segments=new Intl.Segmenter(undefined,{granularity:'grapheme'});
export function isEmojiContent(text:string):boolean {
  const parts=[...segments.segment(text.trim())].map(s=>s.segment);
  return parts.length>0&&parts.some(s=>!/^\s+$/u.test(s))&&parts.every(s=>/^\s+$/u.test(s)||emojiUnit.test(s));
}
