import {mkdtempSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {DraftReview} from '../src/draft-review.ts';import {EmoteLibrary} from '../src/library.ts';
export const joy={expressionIntent:'emotional_commentary',emojiSuitability:'suitable',emotion:'joy',verdict:'missing',explanation:'开心的评论。',suggestion:'😊'};
export const draft={draft:'好消息，太好了！',context:'用户分享好消息',assessment:joy};
export function fixture(snapshot?:ConstructorParameters<typeof DraftReview>[2]){
 const dir=mkdtempSync(join(tmpdir(),'shared-review-')),lib=new EmoteLibrary(dir);
 const log=new DraftReview(dir,()=>lib.list(),snapshot);
 return {dir,lib,log,cleanup(){log.stop();rmSync(dir,{recursive:true,force:true});}};
}
