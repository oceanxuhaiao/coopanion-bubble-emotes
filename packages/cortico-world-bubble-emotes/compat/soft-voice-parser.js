/** Replacement parser for soft-voice source builds; it never changes an installed app. */
const graphemes = new Intl.Segmenter(undefined, {granularity:'grapheme'});
function withoutEmoji(text) {
  return [...graphemes.segment(text)].map(({segment:s})=>
    /\p{Emoji_Presentation}/u.test(s) || (/\p{Extended_Pictographic}|\p{Regional_Indicator}|\u20e3|\ufe0f/u.test(s) && /\ufe0f|\u200d|\u20e3/u.test(s)) ? ' ' : s).join('');
}
export function speechText(script) {
  if(typeof script!=='string')return '';
  return withoutEmoji(script.replace(/【[^】]*】/g,'').replace(/<[^<>\r\n]*>|＜[^＜＞\r\n]*＞/g,''))
    .replace(/\s+/g,' ').replace(/ +([，。！？、,.!?;:；：])/g,'$1').trim();
}
export function petSayFromEntry(entry) {
  if(!entry||typeof entry!=='object'||entry.tool!=='pet_say'||entry.failed===true)return null;
  if(entry.mod&&entry.mod!=='desktop-pet')return null;
  const args=entry.args;
  if(!args||typeof args!=='object')return null;
  let script=args.script;
  if(args.presentation!==undefined){
    const p=args.presentation;
    if(!p||p.schema!==1||!Array.isArray(p.segments))return null;
    script=p.segments.map(s=>s?.kind==='text'&&typeof s.text==='string'?s.text:' ').join('');
  }
  const text=speechText(script);
  if(!text||typeof entry.run!=='string'||!Number.isSafeInteger(entry.seq)||entry.seq<1)return null;
  return {key:JSON.stringify([entry.run,entry.seq,entry.call??'']),run:entry.run,seq:entry.seq,text,script:String(script)};
}
