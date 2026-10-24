import {it,expect} from 'vitest';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {emojiArtwork,renderEmojiText} from '../packages/cortico-world-bubble-emotes/web/emoji-art.js';
import {renderPresentation,presentationSpeech} from '../upstream/Coopanion-0.2.8/packages/cortico-world-desktop-pet/web/presentation.js';
const require=createRequire(new URL('../upstream/Coopanion-0.2.8/package.json',import.meta.url));const {JSDOM}=require('jsdom');
function root(){return new JSDOM('<p></p>').window.document.querySelector('p');}
it('ships identical font-independent hugging artwork in both renderers',()=>{
 const extension=readFileSync('packages/cortico-world-bubble-emotes/web/emoji-art.js','utf8');
 expect(readFileSync('upstream/Coopanion-0.2.8/packages/cortico-world-desktop-pet/web/emoji-art.js','utf8')).toBe(extension);
 const uri=emojiArtwork('🫂');expect(uri).toMatch(/^data:image\/svg\+xml/);
 const svg=decodeURIComponent(uri!.split(',')[1]);expect(svg).toContain('viewBox="0 0 80 80"');expect(svg).not.toMatch(/<script|<text|href=|onload=|https?:\/\/(?!www.w3.org)/i);
 expect(emojiArtwork('🫂️')).toBe(uri);expect(emojiArtwork('😊')).toBeUndefined();
});
it('renders a visible image for comfort without loading external assets',()=>{
 const el=root();renderEmojiText(el,'🫂');expect(el.querySelector('img').src).toBe(emojiArtwork('🫂'));expect(el.querySelector('img').alt).toBe('🫂');
 expect(el.querySelector('img').style.width).toBe('1.15em');
});
it('preserves neighboring text and other emojis without executing markup',()=>{
 const el=root();renderEmojiText(el,'<script>我在🫂😊</script>');expect(el.querySelector('script')).toBeNull();expect(el.querySelectorAll('img')).toHaveLength(1);expect(el.textContent).toBe('<script>我在😊</script>');
});
it('renders standalone, mixed and repeated comfort emoji in the bubble',()=>{
 const el=root();renderPresentation(el,[{kind:'emoji',text:'🫂'}]);expect(el.querySelectorAll('img')).toHaveLength(1);
 renderPresentation(el,[{kind:'text',text:'我在🫂'},{kind:'emoji',text:'🫂😊'}]);expect(el.querySelectorAll('img')).toHaveLength(2);expect(el.textContent).toBe('我在😊');
});
it('keeps reveal timing and speech independent from artwork',()=>{
 const el=root(),segments=[{kind:'text',text:'陪🫂你'},{kind:'emoji',text:'🫂'}];
 renderPresentation(el,segments,1);expect(el.textContent).toBe('陪');expect(el.querySelector('img')).toBeNull();
 renderPresentation(el,segments,2);expect(el.querySelectorAll('img')).toHaveLength(1);expect(el.textContent).toBe('陪');
 expect(presentationSpeech(segments)).toBe('陪 你');
});
