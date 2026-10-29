import{it,expect}from'vitest';import{readFileSync}from'node:fs';
it('ships no host patches, images, renderer modules or voice adapters',()=>{
 const report=JSON.parse(readFileSync(process.env.BUBBLE_EMOTES_PACK_REPORT??'artifacts/expression-records/npm-pack.json','utf8').replace(/^\uFEFF/,''))[0],names=report.files.map((f:{path:string})=>f.path);
 expect(names.some((p:string)=>/compat\/|\.patch$|media\.ts$|emoji-art|soft-voice/.test(p))).toBe(false);
 const pkg=JSON.parse(readFileSync('packages/cortico-world-bubble-emotes/package.json','utf8'));expect(pkg.dependencies??{}).toEqual({});expect(pkg.cortico.tags).toEqual(['experimental','high-cost']);
 expect(report.version).toBe(pkg.version);expect(pkg.main).toBe('./dist/index.js');expect(names).toContain('dist/index.js');expect(names).toContain('dist/ENV_PROMPT.md');expect(names.some((p:string)=>p.endsWith('.ts'))).toBe(false);
});
it('ships the dynamic direct guide rather than fixed examples that bypass disabled entries',()=>{
 const prompt=readFileSync('packages/cortico-world-bubble-emotes/src/ENV_PROMPT.md','utf8');expect(prompt).toContain('{{bubbleEmotes.directGuide}}');expect(prompt).not.toMatch(/\p{Extended_Pictographic}/u);
});

it('ships no independent API connector or key configuration controls',()=>{
 const runtime=readFileSync('packages/cortico-world-bubble-emotes/dist/index.js','utf8'),web=readFileSync('packages/cortico-world-bubble-emotes/dist/webui.js','utf8');
 expect(runtime).not.toMatch(/api\.deepseek\.com|api\.openai\.com|11434|Bearer |analysis-cloud\.json|storeSecret|CLOUD_PROVIDERS/);
 expect(web).not.toMatch(/保存云端设置|检测本机模型|API Key|type = "password"/);
});

it('ships no speech collection, record panel, feedback or check-history persistence',()=>{
 const runtime=readFileSync('packages/cortico-world-bubble-emotes/dist/index.js','utf8'),web=readFileSync('packages/cortico-world-bubble-emotes/dist/webui.js','utf8');
 expect(runtime).not.toMatch(/expression-records\.json|latestCursor|fromCursor|desktop-pet\.self|reviewSource|calibrationExamples|usage_hint|setInterval/);
 expect(web).not.toMatch(/recordsPanel|be-record-list|判断对了|判断错了|开始自检与记录|草稿检查记录/);
});

it('ships only the library panel without onboarding code',()=>{
 const runtime=readFileSync('packages/cortico-world-bubble-emotes/dist/index.js','utf8'),web=readFileSync('packages/cortico-world-bubble-emotes/dist/webui.js','utf8');
 expect(runtime).not.toMatch(/id: "guide"|使用引导/);expect(web).not.toMatch(/guidePanel|web\/guide\.ts|使用引导/);
});
