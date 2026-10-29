import {it,expect} from 'vitest';
import {readBodySnapshot} from '../src/body-snapshot.ts';
import {coordinateBody} from '../src/body-coordination.ts';
import {DEFAULT_EMOTES} from '../src/catalog.ts';

it.each(['none','all','some',undefined])('does not interpret wake preference %s as live posture or quiet state',wakeOn=>{
 const state=readBodySnapshot({connected:true,onDesktop:true,skin:{figure:'whale'},wake:{wakeOn}})!;
 expect(state).toMatchObject({quiet:'unknown',posture:'unknown',faceProtection:'builtin-kit'});
 expect(coordinateBody('好开心 😊','joy','appropriate',false,DEFAULT_EMOTES,true,state)).toMatchObject({script:'【happy】好开心 😊',body:{state:'suggested',display:'unknown'}});
});
it('does not invent a connection, figure or native protection from an invalid response',()=>{
 for(const raw of [null,{}, {connected:'true',skin:{figure:'whale'}}])expect(readBodySnapshot(raw)).toBeUndefined();
 expect(readBodySnapshot({connected:true,skin:{figure:'custom'}})?.faceProtection).toBeUndefined();
});
it.each([
 {connected:false,skin:{figure:'whale'}},
 {connected:true,onDesktop:false,skin:{figure:'whale'}},
 {connected:true,skin:{figure:'custom'}},
])('keeps text and emoji when the window or supported body is unavailable %j',raw=>{
 expect(coordinateBody('好开心 😊','joy','appropriate',false,DEFAULT_EMOTES,true,readBodySnapshot(raw))).toMatchObject({script:'好开心 😊',body:{state:'blocked'}});
});
