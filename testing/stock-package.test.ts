import{it,expect}from'vitest';import{readFileSync}from'node:fs';
it('ships no host patches, images, renderer modules or voice adapters',()=>{
 const report=JSON.parse(readFileSync('artifacts/expression-records/npm-pack.json','utf8').replace(/^\uFEFF/,''))[0],names=report.files.map((f:{path:string})=>f.path);
 expect(names.some((p:string)=>/compat\/|\.patch$|media\.ts$|emoji-art|soft-voice/.test(p))).toBe(false);
 const pkg=JSON.parse(readFileSync('packages/cortico-world-bubble-emotes/package.json','utf8'));expect(pkg.dependencies??{}).toEqual({});expect(pkg.cortico.tags).toEqual(['experimental','high-cost']);
 expect(report.version).toBe(pkg.version);expect(pkg.main).toBe('./dist/index.js');expect(names).toContain('dist/index.js');expect(names).toContain('dist/ENV_PROMPT.md');expect(names.some((p:string)=>p.endsWith('.ts'))).toBe(false);
});
it('ships the dynamic direct guide rather than fixed examples that bypass disabled entries',()=>{
 const prompt=readFileSync('packages/cortico-world-bubble-emotes/src/ENV_PROMPT.md','utf8');expect(prompt).toContain('{{bubbleEmotes.directGuide}}');expect(prompt).not.toMatch(/\p{Extended_Pictographic}/u);
});
