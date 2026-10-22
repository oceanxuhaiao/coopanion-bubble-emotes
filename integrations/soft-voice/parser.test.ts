import {describe,it,expect} from 'vitest';
// @ts-expect-error The integration adapter is distributed as JavaScript.
import {speechText,petSayFromEntry} from './parser.js';
import {DEFAULT_EMOTES} from '../../packages/cortico-world-bubble-emotes/src/catalog.ts';
describe('soft-voice text projection',()=>{
  it('skips every built-in emoji and its teaching metadata',()=>{
    const entry={tool:'pet_say',mod:'desktop-pet',run:'r',seq:1,args:{presentation:{schema:1,segments:DEFAULT_EMOTES.map(e=>({kind:'emoji',text:e.text,alt:e.usage}))}}};
    expect(petSayFromEntry(entry)).toBeNull();
    expect(petSayFromEntry({...entry,args:{presentation:{schema:1,segments:[{kind:'text',text:'慢慢来。'},...entry.args.presentation.segments]}}}).text).toBe('慢慢来。');
  });
  it('skips complex emoji while keeping ordinary text and numbers',()=>{
    expect(speechText('【happy】今天😊，谢谢👨‍👩‍👧‍👦你！🇨🇳👍🏽1️⃣ 123 © + =')).toBe('今天，谢谢 你！ 123 © + =');
  });
  it('never reads image metadata or emoji labels',()=>{
    const e={tool:'pet_say',mod:'desktop-pet',run:'r',seq:1,args:{presentation:{schema:1,segments:[{kind:'text',text:'别难过，'},{kind:'sticker',alt:'抱抱',handle:'secret.png'},{kind:'emoji',text:'😊'},{kind:'text',text:'我在。'}]}}};
    expect(petSayFromEntry(e).text).toBe('别难过， 我在。');
    expect(petSayFromEntry({...e,args:{presentation:{schema:1,segments:[{kind:'emoji',text:'😴'}]}}})).toBeNull();
    expect(petSayFromEntry({...e,failed:true})).toBeNull();
  });
});
