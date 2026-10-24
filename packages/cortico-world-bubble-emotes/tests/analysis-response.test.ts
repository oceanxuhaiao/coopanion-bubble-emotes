import {it,expect} from 'vitest';
import {responseJson} from '../src/analysis-response.ts';

it('stops an oversized streaming body before reading the remainder',async()=>{
 let cancelled=false,pulls=0;
 const stream=new ReadableStream<Uint8Array>({pull(c){pulls++;c.enqueue(new Uint8Array(16001));},cancel(){cancelled=true;}});
 await expect(responseJson(new Response(stream))).rejects.toMatchObject({code:'response_limit'});
 expect(cancelled).toBe(true);expect(pulls).toBeLessThanOrEqual(4);
});
it('distinguishes HTTP failures and invalid JSON without persisting raw provider errors',async()=>{
 for(const[status,code]of [[401,'http_auth'],[429,'http_limit'],[503,'http_service']]as const)await expect(responseJson(new Response('private diagnostic',{status}))).rejects.toMatchObject({code});
 await expect(responseJson(new Response('not JSON'))).rejects.toMatchObject({code:'format'});
 expect(await responseJson(new Response('{"ok":true}'))).toEqual({ok:true});
});
